/**
 * WebDev Odyssey - Game Mode 5: Live Code Sandbox & Playground
 * Allows real-time experimentation with HTML, CSS, and JS with template loading and file export.
 */

class CodeSandbox {
    constructor() {
        this.htmlEditor = null;
        this.cssEditor = null;
        this.jsEditor = null;
        this.previewFrame = null;

        this.templates = {
            button: {
                html: `<div class="container">\n  <button class="cyber-btn" onclick="triggerAlert()">\n    <span>⚡ ACTIVATE HYPERDRIVE</span>\n  </button>\n</div>`,
                css: `body {\n  background: #0b0f19;\n  color: #fff;\n  font-family: sans-serif;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.cyber-btn {\n  position: relative;\n  padding: 16px 36px;\n  background: linear-gradient(135deg, #06b6d4, #8b5cf6);\n  border: none;\n  border-radius: 8px;\n  color: #fff;\n  font-size: 1.1rem;\n  font-weight: 800;\n  letter-spacing: 1px;\n  cursor: pointer;\n  box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);\n  transition: transform 0.2s, box-shadow 0.2s;\n}\n\n.cyber-btn:hover {\n  transform: translateY(-3px) scale(1.02);\n  box-shadow: 0 0 35px rgba(139, 92, 246, 0.8);\n}`,
                js: `function triggerAlert() {\n  alert("🚀 Hyperdrive online! Velocity: Warp 9.8");\n}`
            },
            particle: {
                html: `<canvas id="c"></canvas>`,
                css: `body { margin: 0; overflow: hidden; background: #000; }\ncanvas { display: block; }`,
                js: `const c = document.getElementById('c');\nconst ctx = c.getContext('2d');\nc.width = window.innerWidth;\nc.height = window.innerHeight;\n\nconst dots = Array.from({ length: 40 }, () => ({\n  x: Math.random() * c.width,\n  y: Math.random() * c.height,\n  vx: (Math.random() - 0.5) * 3,\n  vy: (Math.random() - 0.5) * 3,\n  r: Math.random() * 4 + 2\n}));\n\nfunction loop() {\n  ctx.fillStyle = 'rgba(0,0,0,0.15)';\n  ctx.fillRect(0,0,c.width,c.height);\n  ctx.fillStyle = '#06b6d4';\n  dots.forEach(d => {\n    d.x += d.vx; d.y += d.vy;\n    if (d.x < 0 || d.x > c.width) d.vx *= -1;\n    if (d.y < 0 || d.y > c.height) d.vy *= -1;\n    ctx.beginPath();\n    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);\n    ctx.fill();\n  });\n  requestAnimationFrame(loop);\n}\nloop();`
            },
            card: {
                html: `<div class="card">\n  <div class="avatar">🛸</div>\n  <h2>Starship Navigator</h2>\n  <p>Real-time telemetry and galactic coordinate mapper.</p>\n  <span class="badge">ONLINE</span>\n</div>`,
                css: `body {\n  background: radial-gradient(circle at center, #1e1b4b, #0f172a);\n  font-family: system-ui, sans-serif;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: rgba(255, 255, 255, 0.05);\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 16px;\n  padding: 30px;\n  text-align: center;\n  color: #fff;\n  box-shadow: 0 20px 40px rgba(0,0,0,0.5);\n  width: 280px;\n}\n\n.avatar { font-size: 3rem; margin-bottom: 10px; }\n.card h2 { font-size: 1.3rem; margin: 0 0 10px; }\n.card p { color: #94a3b8; font-size: 0.9rem; line-height: 1.4; }\n.badge {\n  display: inline-block;\n  margin-top: 15px;\n  padding: 4px 12px;\n  border-radius: 20px;\n  background: #10b981;\n  color: #fff;\n  font-size: 0.75rem;\n  font-weight: bold;\n}`,
                js: `// Interactive card tilt on hover\nconsole.log("Card component ready");`
            }
        };
    }

    init() {
        this.htmlEditor = document.getElementById('sandbox-html');
        this.cssEditor = document.getElementById('sandbox-css');
        this.jsEditor = document.getElementById('sandbox-js');
        this.previewFrame = document.getElementById('sandbox-iframe');
        this.btnRun = document.getElementById('btn-sandbox-run');
        this.btnDownload = document.getElementById('btn-sandbox-export');
        this.templateSelect = document.getElementById('sandbox-template-select');

        if (!this.htmlEditor) return;

        if (this.btnRun) {
            this.btnRun.addEventListener('click', () => {
                window.sound.playClick();
                this.updatePreview();
            });
        }

        if (this.templateSelect) {
            this.templateSelect.addEventListener('change', (e) => {
                const choice = e.target.value;
                if (this.templates[choice]) {
                    this.loadTemplate(choice);
                }
            });
        }

        if (this.btnDownload) {
            this.btnDownload.addEventListener('click', () => {
                window.sound.playClick();
                this.exportProject();
            });
        }

        // Load default template
        this.loadTemplate('button');
    }

    loadTemplate(name) {
        const t = this.templates[name];
        if (!t) return;

        this.htmlEditor.value = t.html;
        this.cssEditor.value = t.css;
        this.jsEditor.value = t.js;
        this.updatePreview();
    }

    updatePreview() {
        if (!this.previewFrame) return;

        const html = this.htmlEditor.value;
        const css = this.cssEditor.value;
        const js = this.jsEditor.value;

        const combinedDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch(err) {
      console.error(err);
    }
  <\/script>
</body>
</html>`;

        this.previewFrame.srcdoc = combinedDoc;
    }

    exportProject() {
        const html = this.htmlEditor.value;
        const css = this.cssEditor.value;
        const js = this.jsEditor.value;

        const completeDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported from WebDev Odyssey</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  <\/script>
</body>
</html>`;

        const blob = new Blob([completeDoc], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webdev-odyssey-project.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.ui.showToast('💾 Project HTML downloaded successfully!', 'success');
    }
}

window.sandbox = new CodeSandbox();
