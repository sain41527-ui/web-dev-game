# 🚀 WebDev Odyssey: The Code Quest

A gamified web development learning & arcade platform built with **HTML5, CSS3, Modern JavaScript**, and architected for **PHP 7.4 / 8.x**.

---

## 🎮 Game Modes

1. **🚀 Flex Hero (CSS Space Docking)**:
   - Interactive visual viewport where you maneuver shuttles and space stations into docking bays using CSS Flexbox rules (`justify-content`, `align-items`, `flex-direction`, `flex-wrap`).
   - 5 progressive difficulty levels with real-time collision detection.
2. **🐛 Bug Hunter (HTML & JS Code Inspector)**:
   - Real-world debugging missions: missing HTML closing tags, CSS property typos, JavaScript event listener case-sensitivity, array type errors, and XSS sanitization vulnerabilities.
   - Live rendered output & embedded diagnostic console.
3. **⚡ DOM Invaders (Speed Coder Arcade)**:
   - Retro arcade shooter where web development tags (`<div>`, `<section>`), CSS properties (`flex`, `grid`), and JS/PHP keywords (`async/await`, `$_POST`, `echo`) rain down.
   - Type tags in real-time to fire laser cannons with synthesized 8-bit Web Audio sound effects!
4. **🐘 PHP Detective (Backend Server Simulator)**:
   - Server-side coding puzzles: PHP string concatenation (`.`), `$_POST` form payload handling, REST JSON API generation (`json_encode()`), XSS protection (`htmlspecialchars()`), and password hashing (`password_verify()`).
   - Interactive terminal simulating HTTP 200/500 responses.
5. **🛠️ Live Code Sandbox**:
   - 3-pane real-time playground (HTML, CSS, JS) with instant preview and pre-built templates (Glowing Cyber Button, Canvas Particle Matrix, Glassmorphic Orbit Card) plus one-click standalone HTML project export.

---

## 🏆 Gamification & Features

- **XP & Rank Progression**: Advance from *Junior Novice* to *Web Architect* as you solve puzzles.
- **Synthesized 8-bit Audio Engine**: Custom retro sound effects built entirely on the browser's native **Web Audio API** (no external `.mp3` dependencies needed).
- **Achievements & Badges**: Unlockable career badges (*Flexbox Grandmaster*, *Bug Exterminator*, *Lightning Typer*, *Backend Detective*).
- **Global & Local Leaderboard**: Displays top coder scores.
- **Dual Runtime Support**:
  - **With PHP**: Uses PHP sessions and stores persistent global rankings in `data/scores.json` via the REST API (`api/scores.php`).
  - **Without PHP (Offline/Static)**: Automatically falls back to `localStorage` when `index.html` is opened directly in a browser.

---

## 🚀 How to Run

### Option 1: Instant Browser Launch (No PHP needed)
Simply open the file in any web browser:
```
Double-click: C:\Users\User\.gemini\antigravity\scratch\web-dev-game\index.html
```

### Option 2: Built-in PHP CLI Server
If PHP is installed in your terminal, navigate to the folder and run:
```bash
cd "C:\Users\User\.gemini\antigravity\scratch\web-dev-game"
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Apache / XAMPP / WAMP / MAMP
1. Copy the `web-dev-game` folder into your web server's root:
   - XAMPP: `C:\xampp\htdocs\web-dev-game`
   - WAMP: `C:\wamp64\www\web-dev-game`
2. Start Apache from the XAMPP/WAMP control panel.
3. Visit `http://localhost/web-dev-game/` in your browser.

---

## 📁 Project Architecture

```
web-dev-game/
├── index.php                  # PHP Server Entry Point
├── index.html                 # Standalone Browser Entry Point
├── config.php                 # PHP Session & Configuration
├── README.md                  # Documentation
├── api/
│   └── scores.php             # REST API for Leaderboard & Scores
├── data/
│   └── scores.json            # Central High-Score Database
├── includes/
│   ├── header.php             # HTML Head, Fonts & CSS Links
│   ├── navbar.php             # Nav Tabs, Player Stats HUD & Controls
│   └── footer.php             # Modals (Profile, Leaderboard) & Scripts
└── assets/
    ├── css/
    │   ├── style.css          # Main Dark/Cyber Theme & Glassmorphism
    │   ├── game-flex.css      # Space Dock & Shuttles Visuals
    │   └── game-bugs.css      # Terminal, Arcade Arena & Sandbox
    └── js/
        ├── audio.js           # 8-bit Web Audio API Synthesizer
        ├── storage.js         # PHP API Sync + localStorage Fallback
        ├── game-flex.js       # Flexbox Hero Game Engine
        ├── game-bugs.js       # Bug Hunter Debugging Quest
        ├── game-typer.js      # DOM Invaders Typing Shooter Engine
        ├── game-backend.js    # PHP Detective Server Logic Engine
        ├── sandbox.js         # Code Playground & Project Exporter
        └── main.js            # Tabs, HUD, Modals & UI Coordinator
```
