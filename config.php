<?php
/**
 * WebDev Odyssey - Configuration & Session Bootstrapper
 * Compatible with PHP 7.4+ and PHP 8.x
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// App constants
define('APP_NAME', 'WebDev Odyssey: The Code Quest');
define('APP_VERSION', '1.0.0');
define('DATA_DIR', __DIR__ . '/data');
define('SCORES_FILE', DATA_DIR . '/scores.json');

// Ensure data directory exists
if (!file_exists(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Initialize default scores if file does not exist
if (!file_exists(SCORES_FILE)) {
    $defaultScores = [
        ["player" => "AdaLovelace", "score" => 4850, "xp" => 5200, "level" => "Web Architect", "avatar" => "⚡", "date" => "2026-10-15"],
        ["player" => "ByteWizard", "score" => 3920, "xp" => 4100, "level" => "Full-Stack Guru", "avatar" => "🧙‍♂️", "date" => "2026-10-17"],
        ["player" => "CSSNinja", "score" => 3240, "xp" => 3500, "level" => "Flexbox Master", "avatar" => "🥷", "date" => "2026-10-18"],
        ["player" => "PhpPhoenix", "score" => 2800, "xp" => 3000, "level" => "Backend Detective", "avatar" => "🔥", "date" => "2026-10-19"],
        ["player" => "DevRookie", "score" => 1250, "xp" => 1400, "level" => "Junior Dev", "avatar" => "🚀", "date" => "2026-10-20"]
    ];
    file_put_contents(SCORES_FILE, json_encode($defaultScores, JSON_PRETTY_PRINT));
}

// Helper function to send JSON responses
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}
