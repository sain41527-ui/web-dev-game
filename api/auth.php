<?php
/**
 * WebDev Odyssey - User Authentication & Session API
 * Handles user registration, login, logout, and profile sync.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/Database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? '';
$db = Database::getInstance();
$pdo = $db->getPdo();

// 1. Check current authenticated user
if ($action === 'me' || ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($action))) {
    if (isset($_SESSION['user_id']) && $pdo) {
        $stmt = $pdo->prepare("SELECT id, username, avatar, rank, xp, score, created_at FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        if ($user) {
            sendJsonResponse([
                "status" => "success",
                "logged_in" => true,
                "user" => $user
            ]);
        }
    }

    sendJsonResponse([
        "status" => "success",
        "logged_in" => false,
        "message" => "Guest mode active"
    ]);
}

// 2. Handle POST requests (Signup, Login, Logout)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true) ?: [];

    // Logout
    if ($action === 'logout') {
        unset($_SESSION['user_id']);
        session_destroy();
        sendJsonResponse(["status" => "success", "message" => "Logged out successfully"]);
    }

    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        sendJsonResponse(["status" => "error", "message" => "Username and password are required"], 400);
    }

    if (strlen($username) < 3 || strlen($username) > 20) {
        sendJsonResponse(["status" => "error", "message" => "Username must be between 3 and 20 characters"], 400);
    }

    // Signup
    if ($action === 'signup') {
        if (!$pdo) {
            sendJsonResponse(["status" => "error", "message" => "Database unavailable"], 500);
        }

        // Check if username taken
        $check = $pdo->prepare("SELECT id FROM users WHERE LOWER(username) = LOWER(?)");
        $check->execute([$username]);
        if ($check->fetch()) {
            sendJsonResponse(["status" => "error", "message" => "Username already taken. Please choose another."], 409);
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $avatar = $data['avatar'] ?? '👨‍💻';

        $ins = $pdo->prepare("INSERT INTO users (username, password_hash, avatar, rank, xp, score) VALUES (?, ?, ?, 'Junior Novice', 0, 0)");
        $ins->execute([$username, $hash, $avatar]);
        $userId = $pdo->lastInsertId();

        $_SESSION['user_id'] = $userId;

        sendJsonResponse([
            "status" => "success",
            "message" => "Account created successfully! Welcome aboard.",
            "user" => [
                "id" => $userId,
                "username" => $username,
                "avatar" => $avatar,
                "rank" => "Junior Novice",
                "xp" => 0,
                "score" => 0
            ]
        ]);
    }

    // Login
    if ($action === 'login') {
        if (!$pdo) {
            sendJsonResponse(["status" => "error", "message" => "Database unavailable"], 500);
        }

        $stmt = $pdo->prepare("SELECT id, username, password_hash, avatar, rank, xp, score FROM users WHERE LOWER(username) = LOWER(?)");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            sendJsonResponse(["status" => "error", "message" => "Invalid username or password"], 401);
        }

        $_SESSION['user_id'] = $user['id'];
        unset($user['password_hash']);

        sendJsonResponse([
            "status" => "success",
            "message" => "Welcome back, {$user['username']}!",
            "user" => $user
        ]);
    }
}

sendJsonResponse(["status" => "error", "message" => "Invalid action"], 400);
