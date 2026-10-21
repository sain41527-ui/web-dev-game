<?php
/**
 * WebDev Odyssey - Database Management Layer
 * Uses PDO SQLite for robust server-side storage with automated JSON fallback
 */

require_once __DIR__ . '/../config.php';

class Database {
    private static $instance = null;
    private $pdo = null;
    private $dbFile;

    private function __construct() {
        $this->dbFile = DATA_DIR . '/odyssey.sqlite';
        $this->initConnection();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    private function initConnection() {
        try {
            $this->pdo = new PDO("sqlite:" . $this->dbFile);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->createTables();
        } catch (PDOException $e) {
            $this->pdo = null; // Fallback to JSON
            error_log("SQLite connection failed: " . $e->getMessage());
        }
    }

    public function getPdo() {
        return $this->pdo;
    }

    private function createTables() {
        if (!$this->pdo) return;

        $schema = "
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            avatar TEXT DEFAULT '👨‍💻',
            rank TEXT DEFAULT 'Junior Novice',
            xp INTEGER DEFAULT 0,
            score INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            game_mode TEXT NOT NULL,
            level_id INTEGER NOT NULL,
            score_earned INTEGER DEFAULT 0,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            badge_id TEXT NOT NULL,
            badge_name TEXT NOT NULL,
            badge_icon TEXT NOT NULL,
            unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER DEFAULT 0,
            challenge_id TEXT NOT NULL,
            code TEXT NOT NULL,
            status TEXT NOT NULL,
            output TEXT,
            exec_time_ms REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player TEXT NOT NULL,
            score INTEGER DEFAULT 0,
            xp INTEGER DEFAULT 0,
            level TEXT DEFAULT 'Junior Novice',
            avatar TEXT DEFAULT '💻',
            date TEXT NOT NULL
        );
        ";

        $this->pdo->exec($schema);
        $this->seedInitialData();
    }

    private function seedInitialData() {
        if (!$this->pdo) return;

        // Check if leaderboard has data
        $stmt = $this->pdo->query("SELECT COUNT(*) as cnt FROM leaderboard");
        $res = $stmt->fetch();
        if ($res && $res['cnt'] == 0) {
            $default = [
                ['AdaLovelace', 4850, 5200, 'Web Architect', '⚡', '2026-10-15'],
                ['ByteWizard', 3920, 4100, 'Full-Stack Guru', '🧙‍♂️', '2026-10-17'],
                ['CSSNinja', 3240, 3500, 'Flexbox Master', '🥷', '2026-10-18'],
                ['PhpPhoenix', 2800, 3000, 'Backend Detective', '🔥', '2026-10-19'],
                ['DevRookie', 1250, 1400, 'Junior Dev', '🚀', '2026-10-20']
            ];

            $insert = $this->pdo->prepare("INSERT INTO leaderboard (player, score, xp, level, avatar, date) VALUES (?, ?, ?, ?, ?, ?)");
            foreach ($default as $d) {
                $insert->execute($d);
            }
        }
    }

    // Leaderboard helpers
    public function getLeaderboard($limit = 10) {
        if ($this->pdo) {
            $stmt = $this->pdo->prepare("SELECT player, score, xp, level, avatar, date FROM leaderboard ORDER BY score DESC LIMIT ?");
            $stmt->execute([$limit]);
            return $stmt->fetchAll();
        }

        // Fallback to JSON
        if (file_exists(SCORES_FILE)) {
            $raw = file_get_contents(SCORES_FILE);
            $scores = json_decode($raw, true) ?: [];
            usort($scores, fn($a, $b) => ($b['score'] ?? 0) <=> ($a['score'] ?? 0));
            return array_slice($scores, 0, $limit);
        }
        return [];
    }

    public function saveScore($player, $score, $xp, $level, $avatar) {
        $date = date('Y-m-d');
        if ($this->pdo) {
            // Check existing
            $check = $this->pdo->prepare("SELECT id, score, xp FROM leaderboard WHERE LOWER(player) = LOWER(?)");
            $check->execute([$player]);
            $existing = $check->fetch();

            if ($existing) {
                $newScore = max($score, $existing['score']);
                $newXp = max($xp, $existing['xp']);
                $up = $this->pdo->prepare("UPDATE leaderboard SET score = ?, xp = ?, level = ?, avatar = ?, date = ? WHERE id = ?");
                $up->execute([$newScore, $newXp, $level, $avatar, $date, $existing['id']]);
            } else {
                $ins = $this->pdo->prepare("INSERT INTO leaderboard (player, score, xp, level, avatar, date) VALUES (?, ?, ?, ?, ?, ?)");
                $ins->execute([$player, $score, $xp, $level, $avatar, $date]);
            }
            return true;
        }

        // JSON fallback
        return false;
    }
}
