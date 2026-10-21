<header class="app-header">
    <div class="header-container">
        <!-- Brand / Title -->
        <div class="brand">
            <div class="brand-icon">
                <span class="icon-pulse">&lt;/&gt;</span>
            </div>
            <div class="brand-info">
                <h1 class="brand-title">WEBDEV <span class="highlight">ODYSSEY</span></h1>
                <span class="brand-tagline">HTML • CSS • JS • PHP Gaming Platform</span>
            </div>
        </div>

        <!-- Mode Navigation Tabs -->
        <nav class="game-nav" aria-label="Game Modes">
            <button class="nav-tab active" data-target="flexbox">
                <span class="tab-icon">🚀</span>
                <span class="tab-label">Flex Hero</span>
                <span class="tab-badge">CSS</span>
            </button>
            <button class="nav-tab" data-target="bug-hunter">
                <span class="tab-icon">🐛</span>
                <span class="tab-label">Bug Hunter</span>
                <span class="tab-badge">HTML/JS</span>
            </button>
            <button class="nav-tab" data-target="dom-invaders">
                <span class="tab-icon">⚡</span>
                <span class="tab-label">DOM Invaders</span>
                <span class="tab-badge">Typing</span>
            </button>
            <button class="nav-tab" data-target="php-detective">
                <span class="tab-icon">🐘</span>
                <span class="tab-label">PHP Detective</span>
                <span class="tab-badge">Backend</span>
            </button>
            <button class="nav-tab" data-target="sandbox">
                <span class="tab-icon">🛠️</span>
                <span class="tab-label">Sandbox</span>
                <span class="tab-badge">Playground</span>
            </button>
            <a href="dashboard.php" class="nav-tab" style="text-decoration:none;" title="Open Server Backend Telemetry & Dashboard">
                <span class="tab-icon">📊</span>
                <span class="tab-label">Backend Stats</span>
                <span class="tab-badge" style="background:rgba(16,185,129,0.2); color:#4ade80;">PHP</span>
            </a>
        </nav>

        <!-- Player Profile & Global Stats HUD -->
        <div class="player-hud">
            <!-- Audio Toggle -->
            <button id="btn-sound-toggle" class="hud-btn" title="Toggle Sound (Mute/Unmute)">
                <span id="sound-icon">🔊</span>
            </button>

            <!-- Leaderboard Button -->
            <button id="btn-leaderboard" class="hud-btn" title="View Global Leaderboard">
                <span>🏆</span>
            </button>

            <!-- Auth / Login Button -->
            <button id="btn-auth-toggle" class="hud-btn" title="Login or Register PHP Account">
                <span>🔑</span>
            </button>

            <!-- Profile Summary Button -->
            <div class="player-card" id="btn-profile" title="Customize Player Profile">
                <div class="player-avatar" id="hud-avatar">👨‍💻</div>
                <div class="player-details">
                    <div class="player-name-row">
                        <span class="player-name" id="hud-name">Player1</span>
                        <span class="player-rank" id="hud-rank">Rookie</span>
                    </div>
                    <div class="xp-bar-container">
                        <div class="xp-bar-fill" id="hud-xp-fill" style="width: 20%;"></div>
                    </div>
                    <div class="player-meta">
                        <span class="hud-xp-text" id="hud-xp">200 / 1000 XP</span>
                        <span class="hud-score-text">⭐ <span id="hud-score">0</span> pts</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
