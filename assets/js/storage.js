/**
 * WebDev Odyssey - Storage & PHP API Bridge
 * Manages player state, badges, XP, and syncs with PHP backend API
 */

class StorageManager {
    constructor() {
        this.apiBase = 'api/scores.php';
        this.storageKey = 'webdev_player_profile_v1';
        this.isPhpAvailable = false;
        this.profile = this.loadLocalProfile();
    }

    getDefaultProfile() {
        return {
            name: 'CodeNovice',
            avatar: '👨‍💻',
            xp: 0,
            score: 0,
            rank: 'Junior Dev',
            solvedPuzzles: 0,
            completedLevels: {
                flexbox: [1],      // Current active level
                bugHunter: [1],
                domInvaders: 1,
                phpDetective: [1]
            },
            badges: [
                { id: 'first_login', name: 'First Boot', icon: '💻', desc: 'Logged into WebDev Odyssey' }
            ]
        };
    }

    loadLocalProfile() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                return { ...this.getDefaultProfile(), ...parsed };
            }
        } catch (e) {
            console.error('Failed to parse local storage profile', e);
        }
        return this.getDefaultProfile();
    }

    saveProfile() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.profile));
            this.syncWithBackend();
        } catch (e) {
            console.error('Failed to save profile to localStorage', e);
        }
    }

    calculateRank(xp) {
        if (xp >= 5000) return 'Web Architect';
        if (xp >= 3500) return 'Full-Stack Guru';
        if (xp >= 2000) return 'Senior Dev';
        if (xp >= 1000) return 'Frontend Wizard';
        if (xp >= 400)  return 'Code Crafter';
        return 'Junior Novice';
    }

    addXP(amount, reason = '') {
        this.profile.xp += amount;
        this.profile.score += amount;
        const oldRank = this.profile.rank;
        const newRank = this.calculateRank(this.profile.xp);
        
        let leveledUp = false;
        if (oldRank !== newRank) {
            this.profile.rank = newRank;
            leveledUp = true;
        }

        this.saveProfile();
        return {
            currentXP: this.profile.xp,
            currentScore: this.profile.score,
            rank: this.profile.rank,
            leveledUp
        };
    }

    unlockBadge(badgeId, badgeName, icon, desc) {
        if (!this.profile.badges) this.profile.badges = [];
        const exists = this.profile.badges.some(b => b.id === badgeId);
        if (!exists) {
            const newBadge = { id: badgeId, name: badgeName, icon, desc, date: new Date().toISOString().split('T')[0] };
            this.profile.badges.push(newBadge);
            this.saveProfile();
            return newBadge;
        }
        return null;
    }

    hasBadge(badgeId) {
        return (this.profile.badges || []).some(b => b.id === badgeId);
    }

    async syncWithBackend() {
        try {
            const res = await fetch(this.apiBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player: this.profile.name,
                    score: this.profile.score,
                    xp: this.profile.xp,
                    level: this.profile.rank,
                    avatar: this.profile.avatar
                })
            });

            if (res.ok) {
                this.isPhpAvailable = true;
                const json = await res.json();
                return json;
            }
        } catch (e) {
            // PHP server offline or opened as static HTML file
            this.isPhpAvailable = false;
        }
    }

    async fetchLeaderboard() {
        try {
            const res = await fetch(this.apiBase, { method: 'GET' });
            if (res.ok) {
                const json = await res.json();
                this.isPhpAvailable = true;
                return { isOnline: true, list: json.leaderboard || [] };
            }
        } catch (e) {
            this.isPhpAvailable = false;
        }

        // Offline / Static fallback leaderboard
        const fallback = [
            { player: "AdaLovelace", score: 4850, xp: 5200, level: "Web Architect", avatar: "⚡", date: "2026-10-15" },
            { player: "ByteWizard", score: 3920, xp: 4100, level: "Full-Stack Guru", avatar: "🧙‍♂️", date: "2026-10-17" },
            { player: "CSSNinja", score: 3240, xp: 3500, level: "Flexbox Master", avatar: "🥷", date: "2026-10-18" },
            { player: "PhpPhoenix", score: 2800, xp: 3000, level: "Backend Detective", avatar: "🔥", date: "2026-10-19" },
            { player: this.profile.name, score: this.profile.score, xp: this.profile.xp, level: this.profile.rank, avatar: this.profile.avatar, date: "Today (You)" }
        ].sort((a, b) => b.score - a.score);

        return { isOnline: false, list: fallback };
    }

    resetAll() {
        localStorage.removeItem(this.storageKey);
        this.profile = this.getDefaultProfile();
        this.saveProfile();
    }
}

// Global storage instance
window.storage = new StorageManager();
