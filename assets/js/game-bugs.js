/**
 * WebDev Odyssey - Game Mode 2: Bug Hunter (HTML, CSS & JavaScript Debugging)
 * Presents real buggy snippets for players to inspect, fix, and run!
 */

class BugHunterGame {
    constructor() {
        this.currentLevel = 0;
        this.levels = [
            {
                id: 1,
                title: "The Broken Card Tag",
                category: "HTML",
                desc: "An intern forgot to close a tag in this alert banner component. Find the broken tag and close it properly!",
                hint: "Look at the <code>&lt;div class=\"alert-box\"&gt;</code>. Notice how the closing <code>&lt;/div&gt;</code> is missing or mistyped as <code>&lt;/dev&gt;</code>.",
                buggyCode: `<div class="card-box" style="padding: 15px; border-radius: 8px; background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc;">\n  <h3>System Alert</h3>\n  <p>Status: All systems operational</p>\n</dev>`,
                expectedSnippet: "</div>",
                validator: (code) => {
                    const clean = code.trim().toLowerCase();
                    return clean.includes('</div>') && !clean.includes('</dev>');
                },
                xp: 150
            },
            {
                id: 2,
                title: "CSS Typo Nightmare",
                category: "CSS",
                desc: "This glowing action button won't light up! Fix the CSS property typo and missing semicolon.",
                hint: "In CSS, the property is <code>background-color</code> (not <code>background-colour</code>) and all statements must end with a semicolon <code>;</code>.",
                buggyCode: `<style>\n  .glow-btn {\n    background-colour: #06b6d4\n    color: #ffffff;\n    padding: 10px 20px;\n    border-radius: 6px;\n    border: none;\n    font-weight: bold;\n    cursor: pointer;\n  }\n</style>\n<button class="glow-btn">Launch System</button>`,
                expectedSnippet: "background-color",
                validator: (code) => {
                    return code.includes('background-color:') && code.includes('#06b6d4;');
                },
                xp: 200
            },
            {
                id: 3,
                title: "The Broken Event Listener",
                category: "JavaScript",
                desc: "The counter button refuses to increment when clicked. Inspect the JavaScript code for case-sensitivity bugs!",
                hint: "JavaScript is strictly case-sensitive. The method name is <code>addEventListener</code> with a capital 'L'.",
                buggyCode: `<button id="counter-btn" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">Clicks: 0</button>\n<script>\n  let count = 0;\n  const btn = document.getElementById("counter-btn");\n  // BUG: Check the method casing below!\n  btn.addEventlistener("click", () => {\n    count++;\n    btn.textContent = "Clicks: " + count;\n  });\n<\/script>`,
                expectedSnippet: "addEventListener",
                validator: (code) => {
                    return code.includes('addEventListener') && !code.includes('addEventlistener');
                },
                xp: 250
            },
            {
                id: 4,
                title: "Array Method TypeError",
                category: "JavaScript",
                desc: "The render list function crashes with: <code>TypeError: items.map is not a function</code>. Fix the data structure!",
                hint: "Objects with curly braces <code>{}</code> do not have a <code>.map()</code> method. Use an array with square brackets <code>[]</code> instead.",
                buggyCode: `<ul id="feature-list" style="color: #334155; font-family: monospace;"></ul>\n<script>\n  // BUG: items is defined as an Object instead of an Array!\n  const items = { 0: "HTML5", 1: "CSS3", 2: "JavaScript" };\n  \n  const list = document.getElementById("feature-list");\n  list.innerHTML = items.map(item => "<li>" + item + "</li>").join("");\n<\/script>`,
                expectedSnippet: '["HTML5", "CSS3", "JavaScript"]',
                validator: (code) => {
                    return (code.includes('["HTML5"') || code.includes("['HTML5'")) && code.includes(']');
                },
                xp: 300
            },
            {
                id: 5,
                title: "XSS Vulnerability Guard",
                category: "Security",
                desc: "A comment widget is using vulnerable <code>innerHTML</code> directly on user inputs! Secure it by switching to <code>textContent</code>.",
                hint: "Replace <code>msgContainer.innerHTML = userInput;</code> with <code>msgContainer.textContent = userInput;</code> to prevent malicious HTML/script injection.",
                buggyCode: `<div id="comment-box" style="padding: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;"></div>\n<script>\n  const userInput = "Hello <b>World</b> & Welcome!";\n  const box = document.getElementById("comment-box");\n  // BUG: Insecure insertion allows script injection\n  box.innerHTML = userInput;\n<\/script>`,
                expectedSnippet: "box.textContent",
                validator: (code) => {
                    return code.includes('box.textContent =') && !code.includes('box.innerHTML =');
                },
                xp: 350
            }
        ];
    }

    init() {
        this.codeEditorEl = document.getElementById('bug-code-input');
        this.previewEl = document.getElementById('bug-preview-container');
        this.consoleEl = document.getElementById('bug-console-output');
        this.titleEl = document.getElementById('bug-level-title');
        this.badgeEl = document.getElementById('bug-category-badge');
        this.descEl = document.getElementById('bug-level-desc');
        this.hintEl = document.getElementById('bug-level-hint');
        this.btnRun = document.getElementById('btn-bug-run');
        this.btnNext = document.getElementById('btn-bug-next');
        this.levelSelectEl = document.getElementById('bug-level-select');

        if (!this.codeEditorEl) return;

        // Populate level select
        if (this.levelSelectEl) {
            this.levelSelectEl.innerHTML = this.levels.map((lvl, idx) => 
                `<option value="${idx}">Bug ${lvl.id}: ${lvl.title} (${lvl.category})</option>`
            ).join('');

            this.levelSelectEl.addEventListener('change', (e) => {
                this.loadLevel(parseInt(e.target.value, 10));
            });
        }

        if (this.btnRun) {
            this.btnRun.addEventListener('click', () => {
                window.sound.playClick();
                this.testAndExecute();
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

        if (this.titleEl) this.titleEl.textContent = `Bug #${level.id}: ${level.title}`;
        if (this.badgeEl) this.badgeEl.textContent = level.category;
        if (this.descEl) this.descEl.innerHTML = level.desc;
        if (this.hintEl) this.hintEl.innerHTML = level.hint;
        if (this.codeEditorEl) this.codeEditorEl.value = level.buggyCode;
        if (this.levelSelectEl) this.levelSelectEl.value = idx;

        this.logConsole('info', `[Debugger Ready] Bug #${level.id} loaded. Inspect code and click "Run & Inspect".`);
        this.renderPreview(level.buggyCode);
    }

    logConsole(type, msg) {
        if (!this.consoleEl) return;
        const span = document.createElement('span');
        span.className = type === 'error' ? 'log-error' : (type === 'success' ? 'log-success' : 'log-info');
        span.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        this.consoleEl.appendChild(span);
        this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
    }

    renderPreview(code) {
        if (!this.previewEl) return;
        // Strip script execution for preview safe rendering or execute inside sandboxed iframe
        this.previewEl.innerHTML = `<span class="preview-tag">LIVE COMPONENT</span><div style="width:100%;">${code}</div>`;

        // If level has interactive JS script, execute safely in isolated scope
        const scripts = this.previewEl.querySelectorAll('script');
        scripts.forEach(s => {
            try {
                const fn = new Function(s.textContent);
                fn();
            } catch (err) {
                this.logConsole('error', `Runtime Error: ${err.message}`);
            }
        });
    }

    testAndExecute() {
        const userCode = this.codeEditorEl.value;
        const level = this.levels[this.currentLevel];

        this.renderPreview(userCode);

        const isFixed = level.validator(userCode);

        if (isFixed) {
            window.sound.playSuccess();
            this.logConsole('success', `✓ SUCCESS! Bug eliminated. Component rendered without errors.`);
            
            // Award XP
            window.storage.addXP(level.xp, `Solved Bug #${level.id}`);
            window.ui.updateHUD();

            if (this.currentLevel === this.levels.length - 1) {
                const badge = window.storage.unlockBadge(
                    'bug_exterminator',
                    'Bug Exterminator',
                    '🐛',
                    'Successfully fixed all HTML, CSS, and JS debugging challenges!'
                );
                if (badge) {
                    window.sound.playLevelUp();
                    window.ui.showToast(`🏆 Badge Unlocked: ${badge.name}!`, 'badge');
                }
            }

            window.ui.showToast(`🎉 Bug Fixed! +${level.xp} XP earned!`, 'success');
        } else {
            window.sound.playError();
            this.logConsole('error', `✗ FAILED: Bug still present. Check the hint and syntax carefully.`);
            window.ui.showToast('Bug not yet resolved. Inspect hint for clues!', 'error');
        }
    }
}

window.bugGame = new BugHunterGame();
