import { isTyping } from "./utils";

// Retro sound effects, synthesized with the Web Audio API (no audio files needed).
export default class Sound {

  static readonly STORAGE_KEY = 'paratrooper-muted';

  muted: boolean;
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private button: HTMLButtonElement | null;

  constructor() {
    this.muted = this.loadMuted();
    this.button = document.querySelector<HTMLButtonElement>('#sound');
    this.button?.addEventListener('click', () => {
      this.toggle();
      this.button?.blur();
    });
    this.updateButton();

    // Browsers only allow audio after a user gesture.
    window.addEventListener('keydown', this.handleKey);
    window.addEventListener('pointerdown', this.unlock);
  }

  handleKey = (e: KeyboardEvent): void => {
    this.unlock();
    if (e.code === 'KeyM' && !isTyping()) {
      this.toggle();
    }
  }

  toggle = (): void => {
    this.muted = !this.muted;
    try {
      localStorage.setItem(Sound.STORAGE_KEY, this.muted ? '1' : '0');
    } catch (e) {
      // Storage might be unavailable (e.g. private mode), that's fine.
    }
    this.updateButton();
  }

  shoot = (): void => this.tone(1400, 500, 0.05, 'square', 0.025);
  chuteHit = (): void => this.tone(700, 300, 0.08, 'triangle', 0.06);
  land = (): void => this.tone(180, 120, 0.08, 'square', 0.03);
  splat = (): void => this.noise(0.12, 0.12, 900);
  bombDrop = (): void => this.tone(1800, 600, 1.2, 'sine', 0.025);

  explosion = (big = false): void => {
    this.noise(big ? 1.5 : 0.5, big ? 0.4 : 0.22, big ? 600 : 1500);
    this.tone(big ? 90 : 160, 30, big ? 1.2 : 0.4, 'sawtooth', big ? 0.12 : 0.05);
  }

  gameOver = (): void => {
    [392, 330, 262, 196].forEach((freq, i) => this.tone(freq, freq, 0.25, 'square', 0.04, i * 0.28));
  }

  newWave = (): void => {
    [262, 330, 392, 523].forEach((freq, i) => this.tone(freq, freq, 0.1, 'square', 0.03, i * 0.1));
  }

  private loadMuted(): boolean {
    try {
      return localStorage.getItem(Sound.STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  private updateButton(): void {
    if (this.button) {
      this.button.textContent = this.muted ? 'Sound: off' : 'Sound: on';
    }
  }

  private unlock = (): void => {
    try {
      if (!this.ctx) {
        this.ctx = new AudioContext();
      }
      else if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
    } catch (e) {
      // No Web Audio support: play silently.
      this.ctx = null;
    }
  }

  private ready(): AudioContext | null {
    if (this.muted || !this.ctx || this.ctx.state !== 'running') {
      return null;
    }
    return this.ctx;
  }

  // A tone sliding from one frequency to another.
  private tone(from: number, to: number, duration: number, type: OscillatorType, volume: number, delay = 0): void {
    const ctx = this.ready();
    if (!ctx) return;

    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    osc.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  }

  // A burst of filtered white noise, the basis of every good explosion.
  private noise(duration: number, volume: number, cutoff: number): void {
    const ctx = this.ready();
    if (!ctx) return;

    if (!this.noiseBuffer) {
      this.noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    const start = ctx.currentTime;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = this.noiseBuffer;
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(start);
    source.stop(start + duration);
  }

}
