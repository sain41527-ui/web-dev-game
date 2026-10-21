    <!-- Global Modals & Notifications -->

    <!-- Profile Modal -->
    <div id="modal-profile" class="modal-overlay hidden">
        <div class="modal-box">
            <div class="modal-header">
                <h2>🛠️ Player Profile</h2>
                <button class="modal-close" data-close="modal-profile">&times;</button>
            </div>
            <div class="modal-body">
                <div class="profile-avatar-select">
                    <label>Choose Your Dev Avatar:</label>
                    <div class="avatar-grid">
                        <button class="avatar-choice active" data-avatar="👨‍💻">👨‍💻</button>
                        <button class="avatar-choice" data-avatar="👩‍💻">👩‍💻</button>
                        <button class="avatar-choice" data-avatar="🧙‍♂️">🧙‍♂️</button>
                        <button class="avatar-choice" data-avatar="🥷">🥷</button>
                        <button class="avatar-choice" data-avatar="🤖">🤖</button>
                        <button class="avatar-choice" data-avatar="👾">👾</button>
                        <button class="avatar-choice" data-avatar="🚀">🚀</button>
                        <button class="avatar-choice" data-avatar="⚡">⚡</button>
                    </div>
                </div>

                <div class="form-group">
                    <label for="player-name-input">Hacker Handle / Nickname:</label>
                    <input type="text" id="player-name-input" maxlength="18" placeholder="e.g. CodeCommander">
                </div>

                <div class="profile-stats-card">
                    <h3>Career Stats</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Total Score</span>
                            <span class="stat-val" id="profile-stat-score">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total XP</span>
                            <span class="stat-val" id="profile-stat-xp">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Puzzles Solved</span>
                            <span class="stat-val" id="profile-stat-solved">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Current Rank</span>
                            <span class="stat-val text-cyan" id="profile-stat-rank">Junior Novice</span>
                        </div>
                    </div>
                </div>

                <div class="achievements-section">
                    <h3>Unlocked Badges</h3>
                    <div class="badges-container" id="profile-badges-list">
                        <!-- Filled dynamically -->
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="btn-save-profile" class="btn btn-primary">Save Profile</button>
                <button id="btn-reset-progress" class="btn btn-danger" title="Clear all local data">Reset Progress</button>
            </div>
        </div>
    </div>

    <!-- Leaderboard Modal -->
    <div id="modal-leaderboard" class="modal-overlay hidden">
        <div class="modal-box modal-lg">
            <div class="modal-header">
                <h2>🏆 Global High Scores & Leaderboard</h2>
                <button class="modal-close" data-close="modal-leaderboard">&times;</button>
            </div>
            <div class="modal-body">
                <div class="leaderboard-status" id="lb-server-status">
                    <span class="status-indicator"></span> Checking PHP backend connection...
                </div>
                <div class="table-responsive">
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Dev</th>
                                <th>Rank Level</th>
                                <th>XP</th>
                                <th>Score</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboard-body">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button id="btn-refresh-leaderboard" class="btn btn-secondary">🔄 Refresh</button>
                <button class="btn btn-primary" data-close="modal-leaderboard">Close</button>
            </div>
        </div>
    </div>

    <!-- User Auth / PHP Account Modal -->
    <div id="modal-auth" class="modal-overlay hidden">
        <div class="modal-box">
            <div class="modal-header">
                <h2 id="auth-modal-title">🔑 PHP Server Account</h2>
                <button class="modal-close" data-close="modal-auth">&times;</button>
            </div>
            <div class="modal-body">
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    Sign in or create an account powered by PHP Sessions &amp; SQLite password hashing to sync your career stats across devices.
                </p>
                <div class="form-group">
                    <label for="auth-username">Username:</label>
                    <input type="text" id="auth-username" placeholder="e.g. CodeNinja" autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="auth-password">Password:</label>
                    <input type="password" id="auth-password" placeholder="••••••••">
                </div>
                <div id="auth-message" style="font-size: 0.82rem; margin-top: 0.5rem; display: none;"></div>
            </div>
            <div class="modal-footer" style="justify-content: space-between;">
                <div>
                    <button id="btn-auth-switch" class="btn btn-secondary btn-sm">Need an account? Register</button>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button id="btn-auth-submit" class="btn btn-primary">Login</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification Container -->
    <div id="toast-container" class="toast-container"></div>

    <!-- Footer Information -->
    <footer class="app-footer">
        <div class="footer-content">
            <p>Built with ❤️ for Web Developers • Supports <strong>HTML5, CSS3, Vanilla JS &amp; PHP 7.4/8.x</strong></p>
            <p class="footer-links">
                <a href="#flexbox" class="footer-link-jump" data-target="flexbox">Flex Hero</a> •
                <a href="#bug-hunter" class="footer-link-jump" data-target="bug-hunter">Bug Hunter</a> •
                <a href="#dom-invaders" class="footer-link-jump" data-target="dom-invaders">DOM Invaders</a> •
                <a href="#php-detective" class="footer-link-jump" data-target="php-detective">PHP Detective</a> •
                <a href="#sandbox" class="footer-link-jump" data-target="sandbox">Live Sandbox</a>
            </p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="assets/js/audio.js"></script>
    <script src="assets/js/storage.js"></script>
    <script src="assets/js/game-flex.js"></script>
    <script src="assets/js/game-bugs.js"></script>
    <script src="assets/js/game-typer.js"></script>
    <script src="assets/js/game-backend.js"></script>
    <script src="assets/js/sandbox.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
