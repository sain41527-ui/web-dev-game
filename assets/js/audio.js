/**
 * WebDev Odyssey - Web Audio API Synthesizer
 * Generates retro 8-bit sound effects on the fly without any external media files.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('webdev_sound_muted') === 'true';
        this.masterVolume = 0.25;
    }

    initContext() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('webdev_sound_muted', this.muted);
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }

    playTone(frequency, type, duration, startGain = 0.3, endGain = 0.001) {
        if (this.muted) return;
        try {
            this.initContext();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

            gain.gain.setValueAtTime(startGain * this.masterVolume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(endGain, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            // Audio context not allowed before user interaction
        }
    }

    playClick() {
        this.playTone(800, 'square', 0.05, 0.15);
    }

    playSuccess() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.18, 0.25);
            }, idx * 75);
        });
    }

    playError() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(70, this.ctx.currentTime + 0.25);

            gain.gain.setValueAtTime(0.3 * this.masterVolume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.25);
        } catch (e) {}
    }

    playLevelUp() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const melody = [
            { f: 440, d: 0.1 },  // A4
            { f: 554, d: 0.1 },  // C#5
            { f: 659, d: 0.1 },  // E5
            { f: 880, d: 0.25 }  // A5
        ];

        melody.forEach((note, i) => {
            setTimeout(() => {
                this.playTone(note.f, 'triangle', note.d, 0.35);
            }, i * 110);
        });
    }

    playLaser() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(900, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.18);

            gain.gain.setValueAtTime(0.25 * this.masterVolume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.18);
        } catch (e) {}
    }

    playExplosion() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        try {
            // Buffer noise generator for arcade explosion
            const bufferSize = this.ctx.sampleRate * 0.2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.2);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.3 * this.masterVolume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch (e) {}
    }
}

// Global sound instance
window.sound = new SoundEngine();
