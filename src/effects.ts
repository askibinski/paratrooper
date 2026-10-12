import Canvas from "./canvas";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface Popup {
  x: number;
  y: number;
  text: string;
  life: number;
}

interface ExplosionOptions {
  count?: number;
  speed?: number;
  size?: number;
  life?: number;
  colors?: string[];
}

// Particle effects for explosions and unfortunate landings.
export default class Effects {

  static readonly GRAVITY = 0.2;
  static readonly POPUP_LIFE = 50;

  particles: Particle[] = [];
  popups: Popup[] = [];

  constructor(readonly canvas: Canvas) { }

  explode = (x: number, y: number, options: ExplosionOptions = {}): void => {
    const {
      count = 30,
      speed = 6,
      size = 8,
      life = 60,
      colors = [Canvas.WHITE, Canvas.PINK, Canvas.BLUE],
    } = options;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const velocity = speed * (0.3 + Math.random() * 0.7);
      const particleLife = Math.round(life * (0.5 + Math.random() * 0.5));
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        // A bit of an upwards bias looks more dramatic.
        vy: Math.sin(angle) * velocity - speed / 3,
        life: particleLife,
        maxLife: particleLife,
        size: size * (0.5 + Math.random() * 0.5),
        color: colors[i % colors.length],
      });
    }
  }

  splat = (x: number, y: number): void => {
    this.explode(x, y, { count: 14, speed: 3, size: 6, life: 45, colors: [Canvas.PINK, Canvas.WHITE] });
  }

  // A floating text, e.g. the points scored.
  popup = (x: number, y: number, text: string): void => {
    this.popups.push({ x, y, text, life: Effects.POPUP_LIFE });
  }

  reset = (): void => {
    this.particles = [];
    this.popups = [];
  }

  run = (): void => {
    const ctx = this.canvas.ctx;
    const ground = this.canvas.groundY;

    ctx.save();
    this.particles.forEach((p) => {
      p.vy += Effects.GRAVITY;
      p.x += p.vx;
      p.y += p.vy;
      // Bounce a little on the ground.
      if (p.y > ground - p.size) {
        p.y = ground - p.size;
        p.vy *= -0.3;
        p.vx *= 0.6;
      }
      p.life--;

      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });

    this.popups.forEach((popup) => {
      popup.y -= 1.5;
      popup.life--;
      ctx.globalAlpha = Math.max(0, popup.life / Effects.POPUP_LIFE);
      this.canvas.text(popup.text, popup.x, popup.y, 40, 'center', Canvas.WHITE, 'middle');
    });
    ctx.restore();

    this.particles = this.particles.filter((p) => p.life > 0);
    this.popups = this.popups.filter((popup) => popup.life > 0);
  }

}
