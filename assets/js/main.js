/**
 * WebDev Odyssey - Main Orchestrator & UI Controller
 * Manages tabs, modals, HUD stats, toasts, and game initialization.
 */

class UIManager {
    constructor() {
        this.activeTab = 'flexbox';
    }

    init() {
        this.bindNavTabs();
        this.bindModals();
        this.bindHUD();
        this.updateHUD();

        // Initialize sub-engines
        if (window.flexGame) window.flexGame.init();
        if (window.bugGame) window.bugGame.init();
        if (window.invadersGame) window.invadersGame.init();
        if (window.phpGame) window.phpGame.init();
        if (window.sandbox) window.sandbox.init();

        // Handle URL hash navigation
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            this.switchTab(hash);
        }

        // Welcome toast
        setTimeout(() => {
            this.showToast('🚀 Welcome to WebDev Odyssey! Select a challenge to begin.', 'info');
        }, 500);
    }

    bindNavTabs() {
        const tabs = document.querySelectorAll('.nav-tab, .footer-link-jump, .hero-cta-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = tab.dataset.target;
                if (!target) return;
                window.sound.playClick();
                this.switchTab(target);
            });
        });
    }

    switchTab(tabId) {
        this.activeTab = tabId;

        // Update nav buttons
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === tabId);
        });

        // Update sections
        document.querySelectorAll('.game-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `${tabId}-section`);
        });

        window.location.hash = tabId;

        // Specific tab lifecycle hooks
        if (tabId === 'dom-invaders' && window.invadersGame) {
            window.invadersGame.resizeCanvas();
        }
    }

    bindHUD() {
        // Sound toggle
        const btnSound = document.getElementById('btn-sound-toggle');
        const soundIcon = document.getElementById('sound-icon');
        if (btnSound && soundIcon) {
            soundIcon.textContent = window.sound.isMuted() ? '🔇' : '🔊';
            btnSound.addEventListener('click', () => {
                const isMuted = window.sound.toggleMute();
                soundIcon.textContent = isMuted ? '🔇' : '🔊';
                this.showToast(isMuted ? '🔇 Audio muted' : '🔊 Audio enabled', 'info');
            });
        }

        // Leaderboard modal button
        const btnLB = document.getElementById('btn-leaderboard');
        if (btnLB) {
            btnLB.addEventListener('click', () => {
                window.sound.playClick();
                this.openLeaderboardModal();
            });
        }

        // Auth modal button
        const btnAuth = document.getElementById('btn-auth-toggle');
        if (btnAuth) {
            btnAuth.addEventListener('click', () => {
                window.sound.playClick();
                this.openAuthModal();
            });
        }

        // Profile button
        const btnProfile = document.getElementById('btn-profile');
        if (btnProfile) {
            btnProfile.addEventListener('click', () => {
                window.sound.playClick();
                this.openProfileModal();
            });
        }
    }

    updateHUD() {
        const p = window.storage.profile;

        const hudName = document.getElementById('hud-name');
        const hudAvatar = document.getElementById('hud-avatar');
        const hudRank = document.getElementById('hud-rank');
        const hudXP = document.getElementById('hud-xp');
        const hudXPFill = document.getElementById('hud-xp-fill');
        const hudScore = document.getElementById('hud-score');

        if (hudName) hudName.textContent = p.name;
        if (hudAvatar) hudAvatar.textContent = p.avatar;
        if (hudRank) hudRank.textContent = p.rank;
        if (hudScore) hudScore.textContent = p.score;

        // XP progress towards next rank
        const thresholds = [0, 400, 1000, 2000, 3500, 5000];
        let nextTarget = 5000;
        for (let t of thresholds) {
            if (p.xp < t) {
                nextTarget = t;
                break;
            }
        }

        const pct = Math.min(100, Math.floor((p.xp / nextTarget) * 100));
        if (hudXPFill) hudXPFill.style.width = `${pct}%`;
        if (hudXP) hudXP.textContent = `${p.xp} / ${nextTarget} XP`;
    }

    bindModals() {
        // Modal close buttons
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.close;
                const modal = document.getElementById(modalId);
                if (modal) modal.classList.add('hidden');
            });
        });

        // Close on backdrop click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.add('hidden');
                }
            });
        });

        // Profile Avatar Selection
        document.querySelectorAll('.avatar-choice').forEach(choice => {
            choice.addEventListener('click', () => {
                document.querySelectorAll('.avatar-choice').forEach(c => c.classList.remove('active'));
                choice.classList.add('active');
            });
        });

        // Save Profile Button
        const btnSaveProfile = document.getElementById('btn-save-profile');
        if (btnSaveProfile) {
            btnSaveProfile.addEventListener('click', () => {
                const nameInput = document.getElementById('player-name-input');
                const selectedAvatarBtn = document.querySelector('.avatar-choice.active');

                if (nameInput && nameInput.value.trim()) {
                    window.storage.profile.name = nameInput.value.trim();
                }
                if (selectedAvatarBtn) {
                    window.storage.profile.avatar = selectedAvatarBtn.dataset.avatar;
                }

                window.storage.saveProfile();
                this.updateHUD();

                document.getElementById('modal-profile').classList.add('hidden');
                this.showToast('Profile updated and synced!', 'success');
            });
        }

        // Reset Progress Button
        const btnReset = document.getElementById('btn-reset-progress');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all game progress, XP, and badges?')) {
                    window.storage.resetAll();
                    this.updateHUD();
                    document.getElementById('modal-profile').classList.add('hidden');
                    this.showToast('All progress reset to defaults.', 'info');
                }
            });
        }

        // Refresh Leaderboard Button
        const btnRefreshLB = document.getElementById('btn-refresh-leaderboard');
        if (btnRefreshLB) {
            btnRefreshLB.addEventListener('click', () => {
                this.openLeaderboardModal();
            });
        }

        // Auth Modal Toggling & Submission
        let authMode = 'login';
        const authTitle = document.getElementById('auth-modal-title');
        const authSwitchBtn = document.getElementById('btn-auth-switch');
        const authSubmitBtn = document.getElementById('btn-auth-submit');
        const authMsg = document.getElementById('auth-message');

        if (authSwitchBtn) {
            authSwitchBtn.addEventListener('click', () => {
                authMode = authMode === 'login' ? 'signup' : 'login';
                if (authTitle) authTitle.textContent = authMode === 'login' ? '🔑 PHP Server Account' : '📝 Register New Player';
                if (authSubmitBtn) authSubmitBtn.textContent = authMode === 'login' ? 'Login' : 'Create Account';
                authSwitchBtn.textContent = authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login';
                if (authMsg) authMsg.style.display = 'none';
            });
        }

        if (authSubmitBtn) {
            authSubmitBtn.addEventListener('click', async () => {
                const username = document.getElementById('auth-username').value.trim();
                const password = document.getElementById('auth-password').value;

                if (!username || !password) {
                    if (authMsg) {
                        authMsg.textContent = 'Please fill in both username and password.';
                        authMsg.style.color = '#f87171';
                        authMsg.style.display = 'block';
                    }
                    return;
                }

                try {
                    const res = await fetch(`api/auth.php?action=${authMode}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username,
                            password,
                            avatar: window.storage.profile.avatar
                        })
                    });

                    const data = await res.json();
                    if (res.ok && data.status === 'success') {
                        if (data.user) {
                            window.storage.profile.name = data.user.username;
                            if (data.user.xp !== undefined && data.user.xp > window.storage.profile.xp) {
                                window.storage.profile.xp = data.user.xp;
                            }
                            if (data.user.score !== undefined && data.user.score > window.storage.profile.score) {
                                window.storage.profile.score = data.user.score;
                            }
                            if (data.user.rank) {
                                window.storage.profile.rank = data.user.rank;
                            }
                            window.storage.saveProfile();
                            this.updateHUD();
                        }

                        document.getElementById('modal-auth').classList.add('hidden');
                        this.showToast(data.message || 'Authentication successful!', 'success');
                    } else {
                        if (authMsg) {
                            authMsg.textContent = data.message || 'Authentication failed.';
                            authMsg.style.color = '#f87171';
                            authMsg.style.display = 'block';
                        }
                    }
                } catch (e) {
                    if (authMsg) {
                        authMsg.textContent = 'Server connection error. Make sure Apache/PHP is running.';
                        authMsg.style.color = '#f87171';
                        authMsg.style.display = 'block';
                    }
                }
            });
        }
    }

    openAuthModal() {
        const modal = document.getElementById('modal-auth');
        const authMsg = document.getElementById('auth-message');
        if (authMsg) authMsg.style.display = 'none';
        if (modal) modal.classList.remove('hidden');
    }

    openProfileModal() {
        const p = window.storage.profile;
        const modal = document.getElementById('modal-profile');
        const nameInput = document.getElementById('player-name-input');
        const statScore = document.getElementById('profile-stat-score');
        const statXP = document.getElementById('profile-stat-xp');
        const statRank = document.getElementById('profile-stat-rank');
        const badgesContainer = document.getElementById('profile-badges-list');

        if (nameInput) nameInput.value = p.name;
        if (statScore) statScore.textContent = p.score;
        if (statXP) statXP.textContent = p.xp;
        if (statRank) statRank.textContent = p.rank;

        // Avatar highlight
        document.querySelectorAll('.avatar-choice').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.avatar === p.avatar);
        });

        // Populate badges
        if (badgesContainer) {
            badgesContainer.innerHTML = (p.badges || []).map(b => 
                `<div class="badge-pill unlocked" title="${b.desc}">
                    <span>${b.icon}</span>
                    <span>${b.name}</span>
                </div>`
            ).join('');
        }

        if (modal) modal.classList.remove('hidden');
    }

    async openLeaderboardModal() {
        const modal = document.getElementById('modal-leaderboard');
        const tableBody = document.getElementById('leaderboard-body');
        const statusEl = document.getElementById('lb-server-status');

        if (modal) modal.classList.remove('hidden');

        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 20px;">Fetching global rankings...</td></tr>';
        }

        const res = await window.storage.fetchLeaderboard();

        if (statusEl) {
            if (res.isOnline) {
                statusEl.innerHTML = '<span class="status-indicator" style="background:#10b981;"></span> Connected to PHP Backend API (Live Sync)';
            } else {
                statusEl.innerHTML = '<span class="status-indicator" style="background:#f59e0b;"></span> Running in Client-Side Mode (Local Scores)';
            }
        }

        if (tableBody) {
            tableBody.innerHTML = res.list.map((entry, idx) => {
                const isMe = entry.player === window.storage.profile.name;
                return `
                <tr style="${isMe ? 'background: rgba(6, 182, 212, 0.15); font-weight: bold;' : ''}">
                    <td>${idx + 1}</td>
                    <td>${entry.avatar || '💻'} ${entry.player} ${isMe ? '(You)' : ''}</td>
                    <td><span class="player-rank">${entry.level || 'Novice'}</span></td>
                    <td style="color: #38bdf8; font-family: monospace;">${entry.xp || 0}</td>
                    <td style="color: #10b981; font-family: monospace;">${entry.score || 0}</td>
                    <td style="color: #64748b; font-size: 0.8rem;">${entry.date || 'Today'}</td>
                </tr>`;
            }).join('');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '⚠️';
        if (type === 'badge') icon = '🏆';

        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
}

// Global UI instance
window.ui = new UIManager();

document.addEventListener('DOMContentLoaded', () => {
    window.ui.init();
});
