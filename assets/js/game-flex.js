/**
 * WebDev Odyssey - Game Mode 1: Flex Hero (CSS Layout Challenge)
 * Teaches flexbox: justify-content, align-items, flex-direction, flex-wrap
 */

class FlexHeroGame {
    constructor() {
        this.currentLevel = 0;
        this.levels = [
            {
                id: 1,
                title: "Dock the Scout",
                desc: "Move the space scout shuttle to the docking pad on the far right using <code>justify-content</code>.",
                hint: "Use <code>justify-content: flex-end;</code> to align items to the end of the flex container.",
                items: [{ id: 'S-1', icon: '🚀' }],
                targetStyle: {
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                    flexWrap: 'nowrap'
                },
                defaultCss: "justify-content: flex-start;\nalign-items: flex-start;",
                requiredProperties: { 'justify-content': 'flex-end' },
                xp: 150
            },
            {
                id: 2,
                title: "Center the Array",
                desc: "Center the satellite horizontally AND vertically in the docking chamber.",
                hint: "Combine <code>justify-content: center;</code> with <code>align-items: center;</code>.",
                items: [{ id: 'SAT-01', icon: '🛰️' }],
                targetStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    flexWrap: 'nowrap'
                },
                defaultCss: "justify-content: flex-start;\nalign-items: flex-start;",
                requiredProperties: { 'justify-content': 'center', 'align-items': 'center' },
                xp: 200
            },
            {
                id: 3,
                title: "Fleet Patrol Formation",
                desc: "Distribute the 3 scout fighters evenly across the hangar bay with equal space between them.",
                hint: "Use <code>justify-content: space-between;</code> to push items to the edges with equal spacing.",
                items: [{ id: 'F-1', icon: '🚀' }, { id: 'F-2', icon: '🛸' }, { id: 'F-3', icon: '🚀' }],
                targetStyle: {
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                    flexWrap: 'nowrap'
                },
                defaultCss: "justify-content: flex-start;",
                requiredProperties: { 'justify-content': 'space-between' },
                xp: 250
            },
            {
                id: 4,
                title: "Vertical Launch Bay",
                desc: "Stack the rockets vertically in a column and dock them at the bottom.",
                hint: "Change the main axis with <code>flex-direction: column;</code> and use <code>justify-content: flex-end;</code>.",
                items: [{ id: 'R-1', icon: '🚀' }, { id: 'R-2', icon: '🚀' }],
                targetStyle: {
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    flexWrap: 'nowrap'
                },
                defaultCss: "display: flex;\nflex-direction: row;",
                requiredProperties: { 'flex-direction': 'column', 'justify-content': 'flex-end' },
                xp: 300
            },
            {
                id: 5,
                title: "Orbital Constellation Wrap",
                desc: "The hangar is overcrowded! Allow elements to wrap onto multiple lines and space them evenly.",
                hint: "Use <code>flex-wrap: wrap;</code> and <code>justify-content: space-around;</code> with <code>align-content: center;</code>.",
                items: [
                    { id: 'O-1', icon: '🛸' }, { id: 'O-2', icon: '🛰️' },
                    { id: 'O-3', icon: '🛸' }, { id: 'O-4', icon: '🛰️' },
                    { id: 'O-5', icon: '🚀' }
                ],
                targetStyle: {
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                },
                defaultCss: "flex-wrap: nowrap;\njustify-content: flex-start;",
                requiredProperties: { 'flex-wrap': 'wrap', 'justify-content': 'space-around' },
                xp: 400
            }
        ];
    }

    init() {
        this.stageEl = document.getElementById('flex-stage');
        this.targetsOverlayEl = document.getElementById('flex-targets');
        this.codeEditorEl = document.getElementById('flex-code-input');
        this.btnCheck = document.getElementById('btn-flex-check');
        this.btnNext = document.getElementById('btn-flex-next');
        this.successBanner = document.getElementById('flex-success-banner');
        this.titleEl = document.getElementById('flex-level-title');
        this.descEl = document.getElementById('flex-level-desc');
        this.hintEl = document.getElementById('flex-level-hint');
        this.levelPillEl = document.getElementById('flex-level-num');
        this.levelSelectEl = document.getElementById('flex-level-select');

        if (!this.stageEl || !this.codeEditorEl) return;

        // Populate level selector
        if (this.levelSelectEl) {
            this.levelSelectEl.innerHTML = this.levels.map((lvl, idx) => 
                `<option value="${idx}">Level ${lvl.id}: ${lvl.title}</option>`
            ).join('');

            this.levelSelectEl.addEventListener('change', (e) => {
                this.loadLevel(parseInt(e.target.value, 10));
            });
        }

        // Live code typing listener
        this.codeEditorEl.addEventListener('input', () => {
            this.applyUserCss();
        });

        // Quick property button pills
        document.querySelectorAll('.prop-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prop = e.target.dataset.prop;
                const val = e.target.dataset.val;
                if (!prop || !val) return;

                window.sound.playClick();
                this.injectPropertyIntoEditor(prop, val);
                this.applyUserCss();
            });
        });

        if (this.btnCheck) {
            this.btnCheck.addEventListener('click', () => this.checkAlignment());
        }

        if (this.btnNext) {
            this.btnNext.addEventListener('click', () => {
                window.sound.playClick();
                if (this.currentLevel < this.levels.length - 1) {
                    this.loadLevel(this.currentLevel + 1);
                } else {
                    this.loadLevel(0); // Loop back or keep max
                }
            });
        }

        this.loadLevel(0);
    }

    loadLevel(index) {
        this.currentLevel = index;
        const level = this.levels[this.currentLevel];

        if (this.levelPillEl) this.levelPillEl.textContent = `Level ${level.id} of ${this.levels.length}`;
        if (this.titleEl) this.titleEl.textContent = level.title;
        if (this.descEl) this.descEl.innerHTML = level.desc;
        if (this.hintEl) this.hintEl.innerHTML = level.hint;
        if (this.levelSelectEl) this.levelSelectEl.value = index;

        if (this.successBanner) {
            this.successBanner.classList.remove('visible');
        }

        // Render targets
        this.targetsOverlayEl.innerHTML = '';
        Object.assign(this.targetsOverlayEl.style, {
            display: 'flex',
            justifyContent: level.targetStyle.justifyContent || 'flex-start',
            alignItems: level.targetStyle.alignItems || 'flex-start',
            flexDirection: level.targetStyle.flexDirection || 'row',
            flexWrap: level.targetStyle.flexWrap || 'nowrap',
            gap: '15px'
        });

        level.items.forEach(item => {
            const pad = document.createElement('div');
            pad.className = 'dock-target';
            pad.innerHTML = `<span>BAY</span><span>${item.id}</span>`;
            this.targetsOverlayEl.appendChild(pad);
        });

        // Render player ships
        this.stageEl.innerHTML = '';
        level.items.forEach(item => {
            const ship = document.createElement('div');
            ship.className = 'space-shuttle';
            ship.innerHTML = `<span class="shuttle-icon">${item.icon}</span><span class="shuttle-id">${item.id}</span>`;
            this.stageEl.appendChild(ship);
        });

        // Set default editor text
        this.codeEditorEl.value = level.defaultCss;
        this.applyUserCss();
    }

    injectPropertyIntoEditor(prop, val) {
        let currentText = this.codeEditorEl.value;
        const regex = new RegExp(`${prop}\\s*:[^;]+;?`, 'i');
        const newDeclaration = `${prop}: ${val};`;

        if (regex.test(currentText)) {
            currentText = currentText.replace(regex, newDeclaration);
        } else {
            currentText = currentText.trim();
            if (currentText && !currentText.endsWith(';')) currentText += ';';
            currentText += `\n${newDeclaration}`;
        }

        this.codeEditorEl.value = currentText.trim();
    }

    applyUserCss() {
        const rawCode = this.codeEditorEl.value;
        // Reset properties
        this.stageEl.style.justifyContent = '';
        this.stageEl.style.alignItems = '';
        this.stageEl.style.flexDirection = '';
        this.stageEl.style.flexWrap = '';
        this.stageEl.style.gap = '15px';

        // Parse declarations
        const declarations = rawCode.split(';');
        declarations.forEach(decl => {
            const [prop, val] = decl.split(':').map(s => s ? s.trim() : '');
            if (prop && val) {
                if (prop === 'justify-content') this.stageEl.style.justifyContent = val;
                if (prop === 'align-items') this.stageEl.style.alignItems = val;
                if (prop === 'flex-direction') this.stageEl.style.flexDirection = val;
                if (prop === 'flex-wrap') this.stageEl.style.flexWrap = val;
                if (prop === 'gap') this.stageEl.style.gap = val;
            }
        });

        // Quick check
        this.verifyPositions(false);
    }

    verifyPositions(isSubmit = true) {
        const ships = Array.from(this.stageEl.querySelectorAll('.space-shuttle'));
        const pads = Array.from(this.targetsOverlayEl.querySelectorAll('.dock-target'));

        if (ships.length === 0 || pads.length === 0) return false;

        let allDocked = true;
        const tolerance = 25; // px tolerance

        ships.forEach((ship, idx) => {
            const pad = pads[idx];
            if (!pad) return;

            const shipRect = ship.getBoundingClientRect();
            const padRect = pad.getBoundingClientRect();

            const dist = Math.hypot(
                (shipRect.left + shipRect.width / 2) - (padRect.left + padRect.width / 2),
                (shipRect.top + shipRect.height / 2) - (padRect.top + padRect.height / 2)
            );

            if (dist < tolerance) {
                ship.classList.add('docked');
            } else {
                ship.classList.remove('docked');
                allDocked = false;
            }
        });

        if (allDocked) {
            if (isSubmit) {
                this.onLevelComplete();
            }
            return true;
        }

        return false;
    }

    checkAlignment() {
        const success = this.verifyPositions(true);
        if (!success) {
            window.sound.playError();
            window.ui.showToast('Alignment failed! Check your flex properties and try again.', 'error');
        }
    }

    onLevelComplete() {
        window.sound.playSuccess();
        const level = this.levels[this.currentLevel];

        // Award XP
        window.storage.addXP(level.xp, `Completed Flex Hero Level ${level.id}`);
        window.ui.updateHUD();

        // Check badge for completing all levels
        if (this.currentLevel === this.levels.length - 1) {
            const badge = window.storage.unlockBadge(
                'flex_grandmaster',
                'Flexbox Grandmaster',
                '🌟',
                'Mastered all 5 orbital docking flexbox maneuvers!'
            );
            if (badge) {
                window.sound.playLevelUp();
                window.ui.showToast(`🏆 Badge Unlocked: ${badge.name}!`, 'badge');
            }
        }

        if (this.successBanner) {
            this.successBanner.classList.add('visible');
        }
        window.ui.showToast(`🎉 Docking Complete! +${level.xp} XP earned!`, 'success');
    }
}

window.flexGame = new FlexHeroGame();
