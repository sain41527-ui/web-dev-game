<?php
/**
 * WebDev Odyssey - Server Telemetry & Admin Dashboard
 * Displays real-time PHP server metrics, database stats, and live code evaluations.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/Database.php';

$db = Database::getInstance();
$pdo = $db->getPdo();

// Fetch metrics
$userCount = 0;
$submissionCount = 0;
$recentSubmissions = [];
$topScores = $db->getLeaderboard(5);

if ($pdo) {
    try {
        $uStmt = $pdo->query("SELECT COUNT(*) FROM users");
        $userCount = $uStmt->fetchColumn();

        $sStmt = $pdo->query("SELECT COUNT(*) FROM submissions");
        $submissionCount = $sStmt->fetchColumn();

        $rStmt = $pdo->query("SELECT challenge_id, status, exec_time_ms, created_at, output FROM submissions ORDER BY id DESC LIMIT 8");
        $recentSubmissions = $rStmt->fetchAll();
    } catch (Exception $e) {}
}

$sqliteFile = DATA_DIR . '/odyssey.sqlite';
$sqliteSize = file_exists($sqliteFile) ? round(filesize($sqliteFile) / 1024, 2) . ' KB' : '0 KB';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Dashboard • WebDev Odyssey</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .dashboard-container { max-width: 1300px; margin: 2rem auto; padding: 0 1.5rem; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
        .metric-card {
            background: rgba(18, 25, 39, 0.85);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-md);
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
        }
        .metric-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem; }
        .metric-value { font-size: 1.75rem; font-weight: 800; font-family: var(--font-mono); color: #fff; }
        .status-badge { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; }
        .status-passed { background: rgba(16, 185, 129, 0.2); color: #4ade80; border: 1px solid #10b981; }
        .status-failed { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; }
        .telemetry-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        .telemetry-table td, .telemetry-table th { padding: 0.75rem; border-bottom: 1px solid var(--border-subtle); }
        .telemetry-table th { background: #0c101a; color: var(--text-muted); font-weight: 600; text-align: left; }
    </style>
</head>
<body class="dark-theme">
    <header class="app-header">
        <div class="header-container">
            <div class="brand">
                <div class="brand-icon"><span>&lt;/&gt;</span></div>
                <div class="brand-info">
                    <h1 class="brand-title">WEBDEV <span class="highlight">ODYSSEY</span></h1>
                    <span class="brand-tagline">Backend Telemetry &amp; Server Center</span>
                </div>
            </div>
            <div>
                <a href="index.php" class="btn btn-primary btn-sm">🎮 Back to Game Arena</a>
            </div>
        </div>
    </header>

    <div class="dashboard-container">
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 1.5rem;">
            🐘 PHP Server Engine Status: <span style="color: var(--color-emerald);">Online (HTTP 200 OK)</span>
        </h2>

        <!-- Telemetry Metrics -->
        <div class="metrics-grid">
            <div class="metric-card">
                <span class="metric-label">PHP Version</span>
                <span class="metric-value" style="color: var(--color-cyan);"><?php echo PHP_VERSION; ?></span>
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;"><?php echo PHP_OS; ?> (Win64)</span>
            </div>
            <div class="metric-card">
                <span class="metric-label">Web Server</span>
                <span class="metric-value" style="color: var(--color-purple); font-size: 1.25rem;">
                    <?php echo explode(' ', $_SERVER['SERVER_SOFTWARE'] ?? 'Apache/2.4')[0]; ?>
                </span>
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Port <?php echo $_SERVER['SERVER_PORT'] ?? 80; ?></span>
            </div>
            <div class="metric-card">
                <span class="metric-label">Database Storage</span>
                <span class="metric-value" style="color: var(--color-emerald);"><?php echo $sqliteSize; ?></span>
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">PDO SQLite (Active)</span>
            </div>
            <div class="metric-card">
                <span class="metric-label">Code Submissions</span>
                <span class="metric-value" style="color: var(--color-amber);"><?php echo $submissionCount; ?></span>
                <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Evaluated in Sandbox</span>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <!-- Left: Server Specs -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title">⚙️ Server Runtime Environment</span>
                </div>
                <div class="panel-body" style="padding: 0;">
                    <table class="telemetry-table">
                        <tr><td><strong>Operating System</strong></td><td><?php echo php_uname('s') . ' ' . php_uname('r'); ?></td></tr>
                        <tr><td><strong>Memory Limit</strong></td><td><?php echo ini_get('memory_limit'); ?></td></tr>
                        <tr><td><strong>Max Execution Time</strong></td><td><?php echo ini_get('max_execution_time'); ?> seconds</td></tr>
                        <tr><td><strong>Session Save Path</strong></td><td><?php echo session_save_path() ?: 'System Default (temp)'; ?></td></tr>
                        <tr><td><strong>JSON Extension</strong></td><td><span class="status-badge status-passed">Loaded</span></td></tr>
                        <tr><td><strong>PDO SQLite Extension</strong></td><td><span class="status-badge status-passed">Loaded</span></td></tr>
                        <tr><td><strong>Output Buffering (ob_start)</strong></td><td><span class="status-badge status-passed">Active</span></td></tr>
                    </table>
                </div>
            </div>

            <!-- Right: Interactive PHP REPL -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title">⚡ Interactive PHP Live Console</span>
                </div>
                <div class="panel-body">
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
                        Type arbitrary PHP code below. It will be sent via AJAX to <code>/api/eval_php.php</code> and evaluated server-side.
                    </p>
                    <div class="code-editor-container" style="margin-bottom: 0.75rem;">
                        <textarea id="repl-input" class="code-textarea" rows="6" spellcheck="false">&lt;?php
$greeting = "Hello from PHP " . PHP_VERSION;
$data = ['status' => 200, 'timestamp' => time()];
echo $greeting . "\n" . json_encode($data, JSON_PRETTY_PRINT);
?&gt;</textarea>
                    </div>
                    <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center;">
                        <button id="btn-run-repl" class="btn btn-primary btn-sm">Execute on Server 🚀</button>
                        <span id="repl-status" style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);"></span>
                    </div>
                    <div style="margin-top: 0.75rem;">
                        <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">SERVER OUTPUT:</label>
                        <pre id="repl-output" style="background: #060911; border: 1px solid var(--border-subtle); padding: 0.75rem; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.8rem; color: #38bdf8; min-height: 80px; overflow-x: auto; white-space: pre-wrap;">Ready to execute.</pre>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Code Submissions Feed -->
        <div class="panel-card" style="margin-top: 1.5rem;">
            <div class="panel-header">
                <span class="panel-title">📋 Live Server Submissions Log</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Real-time Evaluator Log</span>
            </div>
            <div class="panel-body" style="padding: 0;">
                <table class="telemetry-table">
                    <thead>
                        <tr>
                            <th>Challenge</th>
                            <th>Status</th>
                            <th>Execution Time</th>
                            <th>Output Excerpt</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($recentSubmissions)): ?>
                            <tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No submissions evaluated yet. Solve a PHP Detective puzzle in the game to see it logged here!</td></tr>
                        <?php else: ?>
                            <?php foreach ($recentSubmissions as $sub): ?>
                                <tr>
                                    <td><strong><?php echo htmlspecialchars($sub['challenge_id']); ?></strong></td>
                                    <td>
                                        <span class="status-badge <?php echo $sub['status'] === 'PASSED' ? 'status-passed' : 'status-failed'; ?>">
                                            <?php echo htmlspecialchars($sub['status']); ?>
                                        </span>
                                    </td>
                                    <td style="font-family: var(--font-mono); color: var(--color-cyan);"><?php echo $sub['exec_time_ms']; ?> ms</td>
                                    <td style="font-family: var(--font-mono); font-size: 0.78rem; max-width: 350px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                        <?php echo htmlspecialchars(substr($sub['output'] ?? '', 0, 70)); ?>
                                    </td>
                                    <td style="color: var(--text-muted); font-size: 0.75rem;"><?php echo htmlspecialchars($sub['created_at']); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('btn-run-repl').addEventListener('click', async () => {
            const code = document.getElementById('repl-input').value;
            const outputEl = document.getElementById('repl-output');
            const statusEl = document.getElementById('repl-status');

            statusEl.textContent = 'Executing...';
            outputEl.textContent = 'Waiting for server response...';

            try {
                const res = await fetch('api/eval_php.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: code, mode: 'repl' })
                });

                const data = await res.json();
                statusEl.textContent = `Completed in ${data.execution_time_ms || 0}ms (${data.memory_used || ''})`;
                outputEl.textContent = data.output || 'No output returned.';
                outputEl.style.color = data.passed ? '#4ade80' : '#f87171';
            } catch (err) {
                statusEl.textContent = 'Server Error';
                outputEl.textContent = 'Failed to connect to /api/eval_php.php: ' + err.message;
                outputEl.style.color = '#f87171';
            }
        });
    </script>
</body>
</html>
