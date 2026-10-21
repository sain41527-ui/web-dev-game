/**
 * WebDev Odyssey - Game Mode 4: PHP Detective (Backend & Server Logic)
 * Interactive challenges focusing on PHP syntax, superglobals, JSON APIs, and security.
 */

class PhpDetectiveGame {
    constructor() {
        this.currentLevel = 0;
        this.levels = [
            {
                id: 1,
                title: "PHP String Concatenation",
                topic: "Syntax & Variables",
                desc: "Unlike JavaScript which uses <code>+</code> for concatenation, PHP uses the dot operator <code>.</code>. Fix this greeting script!",
                hint: "Change <code>$greeting = \"Welcome, \" + $name;</code> to use a dot: <code>$greeting = \"Welcome, \" . $name;</code>.",
                starterCode: "<?php\n$name = \"CodeExplorer\";\n// BUG: In PHP, '+' is only for arithmetic addition!\n$greeting = \"Welcome, \" + $name;\necho $greeting;\n?>",
                expectedSnippet: '"Welcome, " . $name',
                validator: (code) => {
                    return code.includes('. $name') || code.includes('.$name');
                },
                simulatedOutput: (code) => {
                    if (code.includes('. $name') || code.includes('.$name')) {
                        return "HTTP/1.1 200 OK\nContent-Type: text/plain\n\nWelcome, CodeExplorer";
                    }
                    return "HTTP/1.1 500 Internal Server Error\n\nFatal Error: Unsupported operand types: string + string in script.php on line 4";
                },
                xp: 180
            },
            {
                id: 2,
                title: "Handling POST Form Requests",
                topic: "Superglobals ($_POST)",
                desc: "A login form is sending credentials via HTTP POST, but the backend script is incorrectly looking in <code>$_GET</code>!",
                hint: "Replace <code>$_GET['email']</code> with <code>$_POST['email']</code> to capture the posted payload.",
                starterCode: "<?php\n// Request Method: POST\n// Payload: email=dev@example.com\n\nif ($_SERVER['REQUEST_METHOD'] === 'POST') {\n    // BUG: Form data is transmitted via $_POST, not $_GET!\n    $email = $_GET['email'] ?? '';\n    echo \"Authenticated: \" . $email;\n}\n?>",
                expectedSnippet: "$_POST['email']",
                validator: (code) => {
                    return code.includes("$_POST['email']") || code.includes('$_POST["email"]');
                },
                simulatedOutput: (code) => {
                    if (code.includes("$_POST['email']") || code.includes('$_POST["email"]')) {
                        return "HTTP/1.1 200 OK\nContent-Type: text/plain\n\nAuthenticated: dev@example.com";
                    }
                    return "HTTP/1.1 200 OK\nNotice: Undefined index: email in $_GET on line 7\nAuthenticated: ";
                },
                xp: 220
            },
            {
                id: 3,
                title: "Building a REST JSON API",
                topic: "JSON & Headers",
                desc: "Configure the PHP response to return valid JSON with proper headers using <code>json_encode()</code>.",
                hint: "Use <code>header('Content-Type: application/json');</code> and <code>echo json_encode($response);</code>.",
                starterCode: "<?php\n$response = [\n    'status' => 'success',\n    'server' => 'Apache/PHP 8.2',\n    'players_online' => 124\n];\n\n// TODO: Set header and encode associative array to JSON string\nheader('Content-Type: application/json');\n// BUG: Arrays cannot be printed with 'echo $response;'!\necho $response;\n?>",
                expectedSnippet: "json_encode($response)",
                validator: (code) => {
                    return code.includes('json_encode($response)');
                },
                simulatedOutput: (code) => {
                    if (code.includes('json_encode($response)')) {
                        return 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  "status": "success",\n  "server": "Apache/PHP 8.2",\n  "players_online": 124\n}';
                    }
                    return "HTTP/1.1 200 OK\nWarning: Array to string conversion in api.php on line 10\nArray";
                },
                xp: 260
            },
            {
                id: 4,
                title: "XSS Defense with htmlspecialchars",
                topic: "Security & Sanitization",
                desc: "Prevent malicious JavaScript injection by escaping user comments before rendering them in the HTML template.",
                hint: "Wrap user input with <code>htmlspecialchars($comment, ENT_QUOTES, 'UTF-8')</code>.",
                starterCode: "<?php\n$comment = \"<script>alert('pwned')</script>\";\n\n// BUG: Vulnerable to Cross-Site Scripting (XSS)\n// Sanitize output using htmlspecialchars()\n$safeComment = $comment;\necho \"<div>User said: \" . $safeComment . \"</div>\";\n?>",
                expectedSnippet: "htmlspecialchars",
                validator: (code) => {
                    return code.includes('htmlspecialchars($comment') || code.includes('htmlspecialchars( $comment');
                },
                simulatedOutput: (code) => {
                    if (code.includes('htmlspecialchars($comment') || code.includes('htmlspecialchars( $comment')) {
                        return "HTTP/1.1 200 OK\nContent-Type: text/html\n\n<div>User said: &lt;script&gt;alert('pwned')&lt;/script&gt;</div>\n[Security Check: PASS - Injection neutralized]";
                    }
                    return "HTTP/1.1 200 OK\n[SECURITY ALERT]: Dangerous unescaped script tags rendered! Vulnerable to XSS attack!";
                },
                xp: 300
            },
            {
                id: 5,
                title: "Secure Password Verification",
                topic: "Authentication",
                desc: "Verify a hashed user password safely using PHP's native <code>password_verify()</code> function.",
                hint: "Use <code>password_verify($inputPassword, $storedHash)</code> which returns a boolean.",
                starterCode: "<?php\n$inputPassword = \"secret123\";\n$storedHash = password_hash(\"secret123\", PASSWORD_BCRYPT);\n\n// BUG: Never use plain string comparison (==) on hashed passwords!\nif ($inputPassword == $storedHash) {\n    echo \"Login Granted\";\n} else {\n    echo \"Login Denied\";\n}\n?>",
                expectedSnippet: "password_verify",
                validator: (code) => {
                    return code.includes('password_verify($inputPassword, $storedHash)');
                },
                simulatedOutput: (code) => {
                    if (code.includes('password_verify($inputPassword, $storedHash)')) {
                        return "HTTP/1.1 200 OK\n\n[Auth Engine]: Hash verified with Bcrypt cost factor 10.\nResult: Login Granted (Session Initialized)";
                    }
                    return "HTTP/1.1 200 OK\nResult: Login Denied (Plain string comparison failed against hash)";
                },
                xp: 350
            }
        ];
    }

    init() {
        this.codeEditorEl = document.getElementById('php-code-input');
        this.terminalEl = document.getElementById('php-terminal-response');
        this.titleEl = document.getElementById('php-level-title');
        this.topicEl = document.getElementById('php-topic-badge');
        this.descEl = document.getElementById('php-level-desc');
        this.hintEl = document.getElementById('php-level-hint');
        this.btnExecute = document.getElementById('btn-php-execute');
        this.btnNext = document.getElementById('btn-php-next');
        this.levelSelectEl = document.getElementById('php-level-select');

        if (!this.codeEditorEl) return;

        // Populate level selector
        if (this.levelSelectEl) {
            this.levelSelectEl.innerHTML = this.levels.map((lvl, idx) => 
                `<option value="${idx}">Mission ${lvl.id}: ${lvl.title}</option>`
            ).join('');

            this.levelSelectEl.addEventListener('change', (e) => {
                this.loadLevel(parseInt(e.target.value, 10));
            });
        }

        if (this.btnExecute) {
            this.btnExecute.addEventListener('click', () => {
                window.sound.playClick();
                this.executeScript();
            });
        }

        if (this.btnNext) {
            this.btnNext.addEventListener('click', () => {
                window.sound.playClick();
                if (this.currentLevel < this.levels.length - 1) {
                    this.loadLevel(this.currentLevel + 1);
                } else {
                    this.loadLevel(0);
                }
            });
        }

        this.loadLevel(0);
    }

    loadLevel(idx) {
        this.currentLevel = idx;
        const level = this.levels[this.currentLevel];

        if (this.titleEl) this.titleEl.textContent = `Mission #${level.id}: ${level.title}`;
        if (this.topicEl) this.topicEl.textContent = level.topic;
        if (this.descEl) this.descEl.innerHTML = level.desc;
        if (this.hintEl) this.hintEl.innerHTML = level.hint;
        if (this.codeEditorEl) this.codeEditorEl.value = level.starterCode;
        if (this.levelSelectEl) this.levelSelectEl.value = idx;

        if (this.terminalEl) {
            this.terminalEl.textContent = `[PHP Server Engine v8.2]\nStatus: Idle. Edit the script and click "Run Script & Test Server".`;
        }
    }

    async executeScript() {
        const userCode = this.codeEditorEl.value;
        const level = this.levels[this.currentLevel];

        if (this.terminalEl) {
            this.terminalEl.textContent = "Connecting to PHP Backend Engine (api/eval_php.php)...\nEvaluating code in isolated sandbox...";
        }

        let isSolved = false;
        let outputText = "";
        let serverPowered = false;

        try {
            // Attempt genuine server-side evaluation via PHP API
            const res = await fetch('api/eval_php.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: userCode,
                    challenge_id: level.id,
                    mode: 'challenge'
                })
            });

            if (res.ok) {
                const data = await res.json();
                serverPowered = true;
                isSolved = data.passed;

                let testSummary = (data.tests || []).map(t => (t.passed ? "  ✓ " : "  ✗ ") + t.name).join("\n");
                outputText = `[HTTP Status ${data.http_status}] Execution: ${data.execution_time_ms}ms | Memory: ${data.memory_used}\n\n${data.output}\n\nServer Validation Tests:\n${testSummary}`;
            }
        } catch (e) {
            // Fallback to client-side simulation if server is unreachable
            serverPowered = false;
        }

        if (!serverPowered) {
            outputText = level.simulatedOutput(userCode) + "\n\n(Note: Evaluated in client simulation mode)";
            isSolved = level.validator(userCode);
        }

        if (this.terminalEl) {
            this.terminalEl.textContent = outputText;
        }

        if (isSolved) {
            window.sound.playSuccess();
            window.storage.addXP(level.xp, `Solved PHP Detective Mission #${level.id}`);
            window.ui.updateHUD();

            // Notify backend progress API
            try {
                fetch('api/progress.php?action=level', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        game_mode: 'php_detective',
                        level_id: level.id,
                        score_earned: level.xp
                    })
                });
            } catch(err) {}

            if (this.currentLevel === this.levels.length - 1) {
                const badge = window.storage.unlockBadge(
                    'backend_detective',
                    'Backend Detective',
                    '🐘',
                    'Mastered all PHP backend challenges, APIs, and security filters!'
                );
                if (badge) {
                    window.sound.playLevelUp();
                    window.ui.showToast(`🏆 Badge Unlocked: ${badge.name}!`, 'badge');
                }
            }

            window.ui.showToast(`🎉 Server Responded 200 OK! +${level.xp} XP earned!`, 'success');
        } else {
            window.sound.playError();
            window.ui.showToast('Server test failed. Inspect terminal output for errors.', 'error');
        }
    }
}

window.phpGame = new PhpDetectiveGame();
