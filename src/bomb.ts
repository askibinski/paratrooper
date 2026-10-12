import Canvas from "./canvas";
import { Bounds } from "./utils";

// A bomb flies in a straight line towards its target (the turret).
export default class Bomb {

  static readonly RADIUS = 14;

  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  targetY = 0;
  frame = 0;
  isGone = false;

  constructor(readonly canvas: Canvas) { }

  launch = (x: number, y: number, targetX: number, targetY: number, speed: number): void => {
    const distance = Math.hypot(targetX - x, targetY - y);
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.vx = (targetX - x) / distance * speed;
    this.vy = (targetY - y) / distance * speed;
  }

  get hasReachedTarget(): boolean {
    return this.y >= this.targetY;
  }

  bounds = (): Bounds => {
    return { left: this.x - Bomb.RADIUS, right: this.x + Bomb.RADIUS, top: this.y - Bomb.RADIUS, bottom: this.y + Bomb.RADIUS };
  }

  run = (): void => {
    this.frame++;
    this.x += this.vx;
    this.y += this.vy;

    const ctx = this.canvas.ctx;
    ctx.fillStyle = Canvas.WHITE;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Bomb.RADIUS, 0, 2 * Math.PI);
    ctx.fill();

    // A blinking fuse, so it stands out.
    ctx.fillStyle = this.frame % 20 < 10 ? Canvas.PINK : Canvas.BLUE;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Bomb.RADIUS / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

}
