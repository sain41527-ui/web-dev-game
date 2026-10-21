<?php
/**
 * WebDev Odyssey - Main Game Application
 * Dynamic PHP entry point
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main class="main-content">
    <!-- Hero Banner -->
    <section class="hero-banner">
        <div class="hero-text">
            <h2>Sain hacker,s world</h2>
            <p>Conquer HTML5, CSS3, JavaScript, and PHP through interactive coding mini-games, visual puzzles, and arcade challenges!</p>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <button class="btn btn-primary hero-cta-btn" data-target="flexbox">🚀 Play Flex Hero</button>
                <button class="btn btn-secondary hero-cta-btn" data-target="bug-hunter">🐛 sain Hunter</button>
                <button class="btn btn-secondary hero-cta-btn" data-target="dom-invaders">⚡ farhan Invaders</button>
                <button class="btn btn-secondary hero-cta-btn" data-target="php-detective">🐘 PHP Detective</button>
            </div>
        </div>
        <div class="hero-stats">
            <div class="hero-stat-badge">
                <span class="hero-stat-num">20+</span>
                <span class="hero-stat-label">Challenges</span>
            </div>
            <div class="hero-stat-badge">
                <span class="hero-stat-num">4</span>
                <span class="hero-stat-label">Game Modes</span>
            </div>
            <div class="hero-stat-badge">
                <span class="hero-stat-num">PHP 8.x</span>
                <span class="hero-stat-label">Ready</span>
            </div>
        </div>
    </section>

    <!-- =========================================================================
         MODE 1: FLEX HERO (CSS Layout Game)
         ========================================================================= -->
    <section id="flexbox-section" class="game-section active">
        <div class="panel-header" style="border-radius: var(--radius-lg); margin-bottom: 1rem;">
            <div class="panel-title">
                <span>🚀 Flex Hero: Orbital Docking Fleet</span>
                <span class="level-indicator" id="flex-level-num">Level 1 of 5</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <label for="flex-level-select" style="font-size:0.8rem; color:var(--text-muted);">Jump to:</label>
                <select id="flex-level-select" style="background:#090c13; color:#fff; border:1px solid var(--border-subtle); padding:0.25rem 0.5rem; border-radius:4px; font-size:0.8rem;">
                    <!-- Filled dynamically -->
                </select>
            </div>
        </div>

        <div class="game-workspace">
            <!-- Left: Code & Controls -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title" id="flex-level-title">Dock the Scout</span>
                    <span style="font-size:0.75rem; color:var(--color-amber);">⭐ +150 XP</span>
                </div>
                <div class="panel-body">
                    <div class="instruction-card">
                        <div class="instruction-title">Mission Briefing</div>
                        <div class="instruction-body" id="flex-level-desc">Move the space scout shuttle to the docking pad on the far right using flexbox.</div>
                    </div>

                    <div class="hint-box" id="flex-level-hint">
                        Hint: Use <code>justify-content: flex-end;</code> to align items to the end of the flex container.
                    </div>

                    <!-- CSS Rule Builder Shortcuts -->
                    <div class="css-rule-builder">
                        <div class="property-group">
                            <span class="property-label">justify-content:</span>
                            <div class="property-buttons">
                                <button class="prop-btn" data-prop="justify-content" data-val="flex-start">flex-start</button>
                                <button class="prop-btn" data-prop="justify-content" data-val="center">center</button>
                                <button class="prop-btn" data-prop="justify-content" data-val="flex-end">flex-end</button>
                                <button class="prop-btn" data-prop="justify-content" data-val="space-between">space-between</button>
                                <button class="prop-btn" data-prop="justify-content" data-val="space-around">space-around</button>
                            </div>
                        </div>
                        <div class="property-group">
                            <span class="property-label">align-items:</span>
                            <div class="property-buttons">
                                <button class="prop-btn" data-prop="align-items" data-val="flex-start">flex-start</button>
                                <button class="prop-btn" data-prop="align-items" data-val="center">center</button>
                                <button class="prop-btn" data-prop="align-items" data-val="flex-end">flex-end</button>
                            </div>
                        </div>
                        <div class="property-group">
                            <span class="property-label">flex-direction:</span>
                            <div class="property-buttons">
                                <button class="prop-btn" data-prop="flex-direction" data-val="row">row</button>
                                <button class="prop-btn" data-prop="flex-direction" data-val="column">column</button>
                            </div>
                        </div>
                    </div>

                    <!-- Code Textarea -->
                    <div class="code-editor-container">
                        <div class="editor-topbar">
                            <div class="editor-dots">
                                <span class="editor-dot red"></span>
                                <span class="editor-dot yellow"></span>
                                <span class="editor-dot green"></span>
                            </div>
                            <span>#docking-stage { display: flex; }</span>
                        </div>
                        <textarea id="flex-code-input" class="code-textarea" spellcheck="false"></textarea>
                    </div>

                    <div class="action-row">
                        <button id="btn-flex-check" class="btn btn-primary">Check Alignment 🚀</button>
                        <button id="btn-flex-next" class="btn btn-secondary">Next Level ⏩</button>
                    </div>
                </div>
            </div>

            <!-- Right: Interactive Viewport -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title">🛰️ Orbital Docking Bay Viewport</span>
                    <span style="font-size:0.75rem; color:var(--color-cyan);">Real-time Telemetry</span>
                </div>
                <div class="panel-body" style="position:relative; display:flex; align-items:center; justify-content:center;">
                    <div class="flex-simulator-container">
                        <!-- Target pads overlay -->
                        <div id="flex-targets" class="docking-targets-overlay"></div>
                        <!-- Player controllable ships -->
                        <div id="flex-stage" class="docking-stage"></div>
                        <!-- Success Banner -->
                        <div id="flex-success-banner" class="success-banner">
                            <h3>PERFECT ALIGNMENT!</h3>
                            <p>Shuttles successfully locked into bay coordinates.</p>
                            <button class="btn btn-success" onclick="document.getElementById('btn-flex-next').click()">Proceed to Next Mission</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- =========================================================================
         MODE 2: BUG HUNTER (HTML & JavaScript Debugging)
         ========================================================================= -->
    <section id="bug-hunter-section" class="game-section">
        <div class="panel-header" style="border-radius: var(--radius-lg); margin-bottom: 1rem;">
            <div class="panel-title">
                <span>🐛 Bug Hunter: Code Inspector</span>
                <span class="level-indicator" id="bug-category-badge">HTML</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <label for="bug-level-select" style="font-size:0.8rem; color:var(--text-muted);">Select Bug:</label>
                <select id="bug-level-select" style="background:#090c13; color:#fff; border:1px solid var(--border-subtle); padding:0.25rem 0.5rem; border-radius:4px; font-size:0.8rem;">
                    <!-- Filled dynamically -->
                </select>
            </div>
        </div>

        <div class="game-workspace">
            <!-- Left: Buggy Source Code -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title" id="bug-level-title">Bug #1: The Broken Card</span>
                    <span style="font-size:0.75rem; color:var(--color-amber);">⭐ +150 XP</span>
                </div>
                <div class="panel-body">
                    <div class="instruction-card">
                        <div class="instruction-title">Bug Report</div>
                        <div class="instruction-body" id="bug-level-desc">Find the broken tag in this alert banner component and fix it.</div>
                    </div>

                    <div class="hint-box" id="bug-level-hint">
                        Hint: Look closely at closing tags.
                    </div>

                    <div class="code-editor-container">
                        <div class="editor-topbar">
                            <div class="editor-dots">
                                <span class="editor-dot red"></span>
                                <span class="editor-dot yellow"></span>
                                <span class="editor-dot green"></span>
                            </div>
                            <span>component-source.html</span>
                        </div>
                        <textarea id="bug-code-input" class="code-textarea" rows="9" spellcheck="false"></textarea>
                    </div>

                    <div class="action-row">
                        <button id="btn-bug-run" class="btn btn-primary">Run &amp; Inspect 🔍</button>
                        <button id="btn-bug-next" class="btn btn-secondary">Next Bug ⏩</button>
                    </div>
                </div>
            </div>

            <!-- Right: Live Output & Console -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title">🖥️ Output Inspector &amp; Error Console</span>
                    <span style="font-size:0.75rem; color:var(--color-emerald);">Live Renderer</span>
                </div>
                <div class="panel-body">
                    <div class="bug-simulator-wrapper">
                        <!-- Live Component Preview -->
                        <div id="bug-preview-container" class="bug-component-preview">
                            <!-- Injected dynamically -->
                        </div>

                        <!-- Console Output -->
                        <div class="terminal-console" id="bug-console-output">
                            <!-- Log messages -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- =========================================================================
         MODE 3: DOM INVADERS (Speed Coder Arcade)
         ========================================================================= -->
    <section id="dom-invaders-section" class="game-section">
        <div class="panel-header" style="border-radius: var(--radius-lg); margin-bottom: 1rem;">
            <div class="panel-title">
                <span>⚡ DOM Invaders: Speed Coder Defense</span>
                <span class="level-indicator">Arcade Mode</span>
            </div>
            <div>
                <button id="btn-invaders-start" class="btn btn-primary btn-sm">Start Defense Wave</button>
            </div>
        </div>

        <div class="arcade-arena-container">
            <!-- HUD Overlay -->
            <div class="arcade-hud-overlay">
                <div class="arcade-stat">
                    <span>SCORE:</span>
                    <strong id="invaders-score" style="color:var(--color-emerald);">0</strong>
                </div>
                <div class="arcade-stat">
                    <span>WAVE:</span>
                    <strong id="invaders-wave" style="color:var(--color-cyan);">1</strong>
                </div>
                <div class="arcade-stat">
                    <span>COMBO:</span>
                    <strong id="invaders-combo" style="color:var(--color-amber);">0x</strong>
                </div>
                <div class="arcade-stat">
                    <span>SHIELDS:</span>
                    <div id="invaders-shields" class="arcade-shields">❤️❤️❤️</div>
                </div>
            </div>

            <!-- Interactive Canvas -->
            <canvas id="invaders-canvas" class="arcade-canvas"></canvas>

            <!-- Typing Input Controls -->
            <div class="arcade-controls-row">
                <div class="arcade-input-group">
                    <input type="text" id="invaders-input" class="arcade-input" placeholder="Type falling tag to blast laser..." autocomplete="off" spellcheck="false" disabled>
                    <button class="arcade-fire-btn" onclick="document.getElementById('invaders-input').focus()">FIRE</button>
                </div>
            </div>
        </div>
    </section>

    <!-- =========================================================================
         MODE 4: PHP DETECTIVE (Backend Logic & Server Simulation)
         ========================================================================= -->
    <section id="php-detective-section" class="game-section">
        <div class="panel-header" style="border-radius: var(--radius-lg); margin-bottom: 1rem;">
            <div class="panel-title">
                <span>🐘 PHP Detective: Server-Side Logic</span>
                <span class="level-indicator" id="php-topic-badge">Syntax &amp; Variables</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <label for="php-level-select" style="font-size:0.8rem; color:var(--text-muted);">Mission:</label>
                <select id="php-level-select" style="background:#090c13; color:#fff; border:1px solid var(--border-subtle); padding:0.25rem 0.5rem; border-radius:4px; font-size:0.8rem;">
                    <!-- Filled dynamically -->
                </select>
            </div>
        </div>

        <div class="game-workspace">
            <!-- Left: PHP Source Code -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title" id="php-level-title">Mission #1: String Concatenation</span>
                    <span style="font-size:0.75rem; color:var(--color-amber);">⭐ +180 XP</span>
                </div>
                <div class="panel-body">
                    <div class="instruction-card">
                        <div class="instruction-title">Backend Objective</div>
                        <div class="instruction-body" id="php-level-desc">Fix the script to concatenate variables properly using PHP syntax.</div>
                    </div>

                    <div class="hint-box" id="php-level-hint">
                        Hint: In PHP, strings are concatenated using the dot operator (.).
                    </div>

                    <div class="code-editor-container">
                        <div class="editor-topbar">
                            <div class="editor-dots">
                                <span class="editor-dot red"></span>
                                <span class="editor-dot yellow"></span>
                                <span class="editor-dot green"></span>
                            </div>
                            <span>backend-handler.php</span>
                        </div>
                        <textarea id="php-code-input" class="code-textarea" rows="10" spellcheck="false"></textarea>
                    </div>

                    <div class="action-row">
                        <button id="btn-php-execute" class="btn btn-primary">Run Script &amp; Test Server 🐘</button>
                        <button id="btn-php-next" class="btn btn-secondary">Next Mission ⏩</button>
                    </div>
                </div>
            </div>

            <!-- Right: Terminal Response -->
            <div class="panel-card">
                <div class="panel-header">
                    <span class="panel-title">📟 Server Terminal Simulator</span>
                    <span class="server-status-pill">PHP 8.2 Engine</span>
                </div>
                <div class="panel-body">
                    <div class="server-response-card" id="php-terminal-response">
                        [PHP Server Engine v8.2]
Status: Idle. Edit the script and click "Run Script &amp; Test Server".
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- =========================================================================
         MODE 5: CODE SANDBOX (Live Playground)
         ========================================================================= -->
    <section id="sandbox-section" class="game-section">
        <div class="panel-header" style="border-radius: var(--radius-lg); margin-bottom: 1rem;">
            <div class="panel-title">
                <span>🛠️ Code Sandbox: Live Frontend Playground</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <label for="sandbox-template-select" style="font-size:0.8rem; color:var(--text-muted);">Starter Template:</label>
                <select id="sandbox-template-select" style="background:#090c13; color:#fff; border:1px solid var(--border-subtle); padding:0.35rem 0.6rem; border-radius:4px; font-size:0.8rem;">
                    <option value="button">🌟 Cyber Glowing Button</option>
                    <option value="particle">🎮 Canvas Particle Matrix</option>
                    <option value="card">🛸 Glassmorphism Orbit Card</option>
                </select>
                <button id="btn-sandbox-run" class="btn btn-primary btn-sm">Run Code ⚡</button>
                <button id="btn-sandbox-export" class="btn btn-secondary btn-sm" title="Download standalone HTML file">Export HTML 💾</button>
            </div>
        </div>

        <div class="sandbox-grid">
            <!-- Left: HTML, CSS, JS Editors -->
            <div class="sandbox-editors">
                <!-- HTML Editor -->
                <div class="code-editor-container">
                    <div class="editor-topbar">
                        <span>index.html (Structure)</span>
                    </div>
                    <textarea id="sandbox-html" class="code-textarea" rows="5" spellcheck="false"></textarea>
                </div>

                <!-- CSS Editor -->
                <div class="code-editor-container">
                    <div class="editor-topbar">
                        <span>styles.css (Design)</span>
                    </div>
                    <textarea id="sandbox-css" class="code-textarea" rows="7" spellcheck="false"></textarea>
                </div>

                <!-- JS Editor -->
                <div class="code-editor-container">
                    <div class="editor-topbar">
                        <span>script.js (Interactivity)</span>
                    </div>
                    <textarea id="sandbox-js" class="code-textarea" rows="5" spellcheck="false"></textarea>
                </div>
            </div>

            <!-- Right: Real-time Sandboxed Iframe -->
            <div class="sandbox-preview-container">
                <div class="sandbox-preview-toolbar">
                    <span>LIVE VIEWPORT (Sandboxed iframe)</span>
                    <span>100% Client-Side</span>
                </div>
                <iframe id="sandbox-iframe" class="sandbox-iframe" sandbox="allow-scripts allow-modals"></iframe>
            </div>
        </div>
    </section>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
