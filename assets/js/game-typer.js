/**
 * WebDev Odyssey - Game Mode 3: DOM Invaders (Speed Coder Arcade Game)
 * An action typing shooter featuring web dev tags, CSS rules, and JS/PHP keywords.
 */

class DomInvadersGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.animationId = null;

        this.score = 0;
        this.shields = 3;
        this.wave = 1;
        this.combo = 0;

        this.enemies = [];
        this.lasers = [];
        this.particles = [];

        this.lastSpawnTime = 0;
        this.spawnInterval = 2000; // ms

        this.wordPool = [
            '<div>', '<span>', '<header>', '<footer>', '<section>', '<button>', '<script>',
            'flex', 'grid', 'margin', 'padding', 'border', 'opacity', 'display',
            'const', 'let', 'function', 'return', 'async', 'await', 'import', 'export',
            'echo', '$_POST', '$_GET', 'array_map', 'json_encode', 'include', 'foreach'
        ];
    }

    init() {
        this.canvas = document.getElementById('invaders-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.inputEl = document.getElementById('invaders-input');
        this.scoreEl = document.getElementById('invaders-score');
        this.shieldsEl = document.getElementById('invaders-shields');
        this.waveEl = document.getElementById('invaders-wave');
        this.comboEl = document.getElementById('invaders-combo');
        this.btnStart = document.getElementById('btn-invaders-start');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        if (this.inputEl) {
            this.inputEl.addEventListener('input', (e) => this.handleTyping(e));
            this.inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.fireAtMatched(this.inputEl.value.trim());
                }
            });
        }

        if (this.btnStart) {
            this.btnStart.addEventListener('click', () => {
                window.sound.playClick();
                this.startGame();
            });
        }
    }

    resizeCanvas() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    startGame() {
        this.isRunning = true;
        this.score = 0;
        this.shields = 3;
        this.wave = 1;
        this.combo = 0;
        this.enemies = [];
        this.lasers = [];
        this.particles = [];
        this.spawnInterval = 2000;
        this.lastSpawnTime = performance.now();

        this.updateHUD();
        if (this.inputEl) {
            this.inputEl.value = '';
            this.inputEl.disabled = false;
            this.inputEl.focus();
        }

        if (this.btnStart) {
            this.btnStart.textContent = 'Restart Wave';
        }

        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.animationId = requestAnimationFrame((ts) => this.loop(ts));
        window.ui.showToast('🚀 DOM Invaders activated! Type words to fire laser cannons.', 'info');
    }

    updateHUD() {
        if (this.scoreEl) this.scoreEl.textContent = this.score;
        if (this.waveEl) this.waveEl.textContent = this.wave;
        if (this.comboEl) this.comboEl.textContent = `${this.combo}x`;
        if (this.shieldsEl) {
            this.shieldsEl.innerHTML = '❤️'.repeat(Math.max(0, this.shields));
        }
    }

    spawnEnemy() {
        const word = this.wordPool[Math.floor(Math.random() * this.wordPool.length)];
        const padding = 50;
        const x = padding + Math.random() * (this.canvas.width - padding * 2 - 100);
        const speed = 0.6 + (this.wave * 0.15) + Math.random() * 0.4;

        this.enemies.push({
            text: word,
            x: x,
            y: 30,
            speed: speed,
            color: word.startsWith('<') ? '#06b6d4' : (word.startsWith('$') || word.includes('echo') ? '#a855f7' : '#10b981')
        });
    }

    handleTyping() {
        const val = this.inputEl.value.trim();
        if (!val) return;

        // Auto-fire if complete word matches an enemy
        const matched = this.enemies.find(e => e.text.toLowerCase() === val.toLowerCase());
        if (matched) {
            this.destroyEnemy(matched);
            this.inputEl.value = '';
        }
    }

    fireAtMatched(val) {
        const matched = this.enemies.find(e => e.text.toLowerCase() === val.toLowerCase());
        if (matched) {
            this.destroyEnemy(matched);
            this.inputEl.value = '';
        }
    }

    destroyEnemy(enemy) {
        window.sound.playLaser();
        setTimeout(() => window.sound.playExplosion(), 60);

        // Add laser beam animation
        this.lasers.push({
            startX: this.canvas.width / 2,
            startY: this.canvas.height - 40,
            targetX: enemy.x + 30,
            targetY: enemy.y,
            progress: 0
        });

        // Add particle burst
        for (let i = 0; i < 16; i++) {
            this.particles.push({
                x: enemy.x + 30,
                y: enemy.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1.0,
                color: enemy.color
            });
        }

        // Remove enemy
        this.enemies = this.enemies.filter(e => e !== enemy);

        // Update score & combo
        this.combo++;
        const pts = 50 * Math.max(1, Math.floor(this.combo / 3));
        this.score += pts;

        // Check wave progression
        if (this.score >= this.wave * 300) {
            this.wave++;
            this.spawnInterval = Math.max(900, this.spawnInterval - 150);
            window.ui.showToast(`🔥 Wave ${this.wave} incoming! Speed increased!`, 'info');
        }

        this.updateHUD();
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        // Spawn timer
        if (timestamp - this.lastSpawnTime > this.spawnInterval) {
            this.spawnEnemy();
            this.lastSpawnTime = timestamp;
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Player Cannon at bottom center
        const cannonX = this.canvas.width / 2;
        const cannonY = this.canvas.height - 30;
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.beginPath();
        this.ctx.arc(cannonX, cannonY, 18, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(cannonX, cannonY);
        this.ctx.lineTo(cannonX, cannonY - 24);
        this.ctx.stroke();

        // Update & Render Lasers
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const l = this.lasers[i];
            l.progress += 0.2;

            this.ctx.strokeStyle = '#38bdf8';
            this.ctx.lineWidth = 4;
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = '#06b6d4';

            this.ctx.beginPath();
            this.ctx.moveTo(l.startX, l.startY);
            this.ctx.lineTo(l.targetX, l.targetY);
            this.ctx.stroke();

            this.ctx.shadowBlur = 0;

            if (l.progress >= 1) {
                this.lasers.splice(i, 1);
            }
        }

        // Update & Render Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.035;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        }

        // Update & Render Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.y += e.speed;

            // Draw Enemy Bubble
            this.ctx.font = '14px "Fira Code", monospace';
            const textWidth = this.ctx.measureText(e.text).width;
            const boxPadding = 8;
            const boxWidth = textWidth + boxPadding * 2;
            const boxHeight = 26;

            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            this.ctx.strokeStyle = e.color;
            this.ctx.lineWidth = 1.5;

            this.ctx.beginPath();
            this.ctx.roundRect(e.x - boxPadding, e.y - 18, boxWidth, boxHeight, 6);
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(e.text, e.x, e.y);

            // Check if reached bottom
            if (e.y > this.canvas.height - 40) {
                this.enemies.splice(i, 1);
                this.onEnemyBreach();
            }
        }

        this.animationId = requestAnimationFrame((ts) => this.loop(ts));
    }

    onEnemyBreach() {
        window.sound.playError();
        this.shields--;
        this.combo = 0;
        this.updateHUD();

        if (this.shields <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.isRunning = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);

        window.sound.playError();
        if (this.inputEl) this.inputEl.disabled = true;

        // Award XP
        const earnedXP = Math.floor(this.score / 2);
        window.storage.addXP(earnedXP, 'DOM Invaders Arcade run');
        window.ui.updateHUD();

        // Check arcade badge
        if (this.score >= 1000) {
            const badge = window.storage.unlockBadge(
                'lightning_typer',
                'Lightning Typer',
                '⚡',
                'Scored over 1,000 points in DOM Invaders!'
            );
            if (badge) {
                window.sound.playLevelUp();
                window.ui.showToast(`🏆 Badge Unlocked: ${badge.name}!`, 'badge');
            }
        }

        window.ui.showToast(`💥 Game Over! Final Score: ${this.score} (+${earnedXP} XP earned)`, 'error');
    }
}

window.invadersGame = new DomInvadersGame();
