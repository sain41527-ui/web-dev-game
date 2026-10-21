<?php
/**
 * RESTful Score and Leaderboard API for WebDev Odyssey
 * Accepts GET (fetch leaderboard) and POST (submit new high score)
 */

require_once __DIR__ . '/../config.php';

// Enable CORS for flexibility
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$scoresFile = SCORES_FILE;

// Fetch current scores
$scores = [];
if (file_exists($scoresFile)) {
    $raw = file_get_contents($scoresFile);
    $scores = json_decode($raw, true) ?: [];
}

// Handle GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Sort descending by score
    usort($scores, function($a, $b) {
        return ($b['score'] ?? 0) <=> ($a['score'] ?? 0);
    });

    // Return top 10
    $topScores = array_slice($scores, 0, 10);
    sendJsonResponse([
        "status" => "success",
        "count" => count($topScores),
        "leaderboard" => $topScores
    ]);
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read JSON payload
    $body = file_get_contents('php://input');
    $data = json_decode($body, true);

    if (!$data) {
        sendJsonResponse(["status" => "error", "message" => "Invalid JSON payload"], 400);
    }

    $player = trim(strip_tags($data['player'] ?? 'Anonymous'));
    if (empty($player)) {
        $player = 'Anonymous Coder';
    }
    // Limit player name length
    $player = substr($player, 0, 20);

    $score = isset($data['score']) ? intval($data['score']) : 0;
    $xp = isset($data['xp']) ? intval($data['xp']) : 0;
    $level = trim(strip_tags($data['level'] ?? 'Novice Coder'));
    $avatar = trim(strip_tags($data['avatar'] ?? '💻'));

    $newEntry = [
        "player" => $player,
        "score" => $score,
        "xp" => $xp,
        "level" => $level,
        "avatar" => $avatar,
        "date" => date('Y-m-d')
    ];

    // Check if player already exists in leaderboard
    $found = false;
    foreach ($scores as &$entry) {
        if (strcasecmp($entry['player'], $player) === 0) {
            // Update if new score or XP is higher
            if ($score > ($entry['score'] ?? 0)) {
                $entry['score'] = $score;
            }
            if ($xp > ($entry['xp'] ?? 0)) {
                $entry['xp'] = $xp;
            }
            $entry['level'] = $level;
            $entry['avatar'] = $avatar;
            $entry['date'] = date('Y-m-d');
            $found = true;
            break;
        }
    }
    unset($entry);

    if (!$found) {
        $scores[] = $newEntry;
    }

    // Sort descending by score
    usort($scores, function($a, $b) {
        return ($b['score'] ?? 0) <=> ($a['score'] ?? 0);
    });

    // Keep top 25
    $scores = array_slice($scores, 0, 25);

    // Save back to JSON file
    file_put_contents($scoresFile, json_encode($scores, JSON_PRETTY_PRINT));

    sendJsonResponse([
        "status" => "success",
        "message" => "Score saved successfully!",
        "entry" => $newEntry,
        "leaderboard" => array_slice($scores, 0, 10)
    ]);
}

sendJsonResponse(["status" => "error", "message" => "Method not allowed"], 405);
