import Canvas from "./canvas";
import GameState from "./game-state";
import Effects from "./effects";
import Sound from "./sound";

export default class Turret {

  static readonly BASE_SIZE = 200;

  // Turret width/height (the pink part on top of the base).
  readonly twh = Math.round(Turret.BASE_SIZE / 3);

  constructor(readonly canvas: Canvas, readonly state: GameState, readonly effects: Effects, readonly sound: Sound) { }

  get baseTop(): number {
    return this.canvas.groundY - Turret.BASE_SIZE;
  }

  get baseLeft(): number {
    return this.canvas.centerX - Turret.BASE_SIZE / 2;
  }

  get baseRight(): number {
    return this.canvas.centerX + Turret.BASE_SIZE / 2;
  }

  // The point the barrel rotates around (and bullets are fired from).
  get pivotX(): number {
    return this.canvas.centerX;
  }

  get pivotY(): number {
    return this.baseTop - this.twh;
  }

  get isDestroyed(): boolean {
    return this.state.phase === 'destroyed' || this.state.phase === 'over';
  }

  // Kaboom. Game over.
  destroy = (): void => {
    if (this.isDestroyed) return;

    this.state.setPhase('destroyed');
    this.effects.explode(this.pivotX, this.pivotY, { count: 80, speed: 14, size: 14, life: 120 });
    this.effects.explode(this.pivotX, this.baseTop + Turret.BASE_SIZE / 2, { count: 60, speed: 10, size: 18, life: 140 });
    this.canvas.shake();
    this.sound.explosion(true);
  }

  draw = (): void => {
    if (this.isDestroyed) {
      this.rubble();
    }
    else {
      this.base();
      this.turretBaseTop();
      this.turretBaseBottom();
      this.turretBasePivot();
    }
    this.floor();
  }

  floor = (): void => {
    const ctx = this.canvas.ctx;
    ctx.fillStyle = Canvas.BLACK;
    ctx.fillRect(0, this.canvas.groundY, this.canvas.width, Canvas.HUD_HEIGHT);
    ctx.strokeStyle = Canvas.BLUE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, this.canvas.groundY);
    ctx.lineTo(this.canvas.width, this.canvas.groundY);
    ctx.stroke();
  }

  // Base.
  base = (): void => {
    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.fillRect(this.baseLeft, this.baseTop, Turret.BASE_SIZE, Turret.BASE_SIZE);
  }

  // What's left of the base after it blew up.
  rubble = (): void => {
    const ctx = this.canvas.ctx;
    ctx.fillStyle = Canvas.WHITE;
    ctx.beginPath();
    ctx.moveTo(this.baseLeft, this.canvas.groundY);
    ctx.lineTo(this.baseLeft + 30, this.canvas.groundY - 60);
    ctx.lineTo(this.baseLeft + 70, this.canvas.groundY - 40);
    ctx.lineTo(this.canvas.centerX, this.canvas.groundY - 90);
    ctx.lineTo(this.baseRight - 60, this.canvas.groundY - 30);
    ctx.lineTo(this.baseRight - 25, this.canvas.groundY - 70);
    ctx.lineTo(this.baseRight, this.canvas.groundY);
    ctx.closePath();
    ctx.fill();
  }

  // Turret base top (the rounded part).
  turretBaseTop = (): void => {
    this.canvas.ctx.fillStyle = Canvas.PINK;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.pivotX, this.pivotY, this.twh / 2, Math.PI, 0);
    this.canvas.ctx.fill();
  }

  // Turret base (square part).
  turretBaseBottom = (): void => {
    this.canvas.ctx.fillStyle = Canvas.PINK;
    this.canvas.ctx.fillRect(this.pivotX - this.twh / 2, this.pivotY, this.twh, this.twh);
  }

  // The pivot point.
  turretBasePivot = (): void => {
    this.canvas.ctx.fillStyle = Canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.pivotX, this.pivotY, this.twh / 8, 0, 2 * Math.PI);
    this.canvas.ctx.fill();
  }

}
