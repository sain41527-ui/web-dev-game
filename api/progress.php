<?php
/**
 * WebDev Odyssey - Progress & Achievement Persistence API
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

$db = Database::getInstance();
$pdo = $db->getPdo();
$action = $_GET['action'] ?? 'sync';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    $data = json_decode($body, true) ?: [];

    // 1. Sync full profile (XP, Score, Rank)
    if ($action === 'sync') {
        $player = trim($data['player'] ?? 'Anonymous Coder');
        $score = intval($data['score'] ?? 0);
        $xp = intval($data['xp'] ?? 0);
        $rank = trim($data['rank'] ?? 'Junior Novice');
        $avatar = trim($data['avatar'] ?? '💻');

        // Update database user if logged in
        if (isset($_SESSION['user_id']) && $pdo) {
            $up = $pdo->prepare("UPDATE users SET score = ?, xp = ?, rank = ?, avatar = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?");
            $up->execute([$score, $xp, $rank, $avatar, $_SESSION['user_id']]);
        }

        // Update leaderboard
        $db->saveScore($player, $score, $xp, $rank, $avatar);

        sendJsonResponse([
            "status" => "success",
            "message" => "Progress synced to server database",
            "synced" => [
                "player" => $player,
                "score" => $score,
                "xp" => $xp,
                "rank" => $rank
            ]
        ]);
    }

    // 2. Record Completed Level
    if ($action === 'level') {
        $userId = $_SESSION['user_id'] ?? 0;
        $gameMode = $data['game_mode'] ?? 'unknown';
        $levelId = intval($data['level_id'] ?? 1);
        $scoreEarned = intval($data['score_earned'] ?? 0);

        if ($pdo) {
            $ins = $pdo->prepare("INSERT INTO progress (user_id, game_mode, level_id, score_earned) VALUES (?, ?, ?, ?)");
            $ins->execute([$userId, $gameMode, $levelId, $scoreEarned]);
        }

        sendJsonResponse(["status" => "success", "message" => "Level progress recorded"]);
    }

    // 3. Record Achievement Badge
    if ($action === 'badge') {
        $userId = $_SESSION['user_id'] ?? 0;
        $badgeId = $data['badge_id'] ?? '';
        $badgeName = $data['badge_name'] ?? '';
        $badgeIcon = $data['badge_icon'] ?? '🏆';

        if ($pdo && !empty($badgeId)) {
            $check = $pdo->prepare("SELECT id FROM achievements WHERE user_id = ? AND badge_id = ?");
            $check->execute([$userId, $badgeId]);
            if (!$check->fetch()) {
                $ins = $pdo->prepare("INSERT INTO achievements (user_id, badge_id, badge_name, badge_icon) VALUES (?, ?, ?, ?)");
                $ins->execute([$userId, $badgeId, $badgeName, $badgeIcon]);
            }
        }

        sendJsonResponse(["status" => "success", "message" => "Badge recorded on server"]);
    }
}

sendJsonResponse(["status" => "error", "message" => "Unsupported request"], 400);
