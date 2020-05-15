import Canvas from "./canvas.js";

export default class Turret {

  static readonly BASE_WIDTH_HEIGHT = 200;
  static readonly SCORE_HEIGHT = 80;
  static readonly canvas: Canvas;
  twh: number;

  constructor(readonly canvas: Canvas) {
    // Turret base width height. 
    this.twh = Math.round(Turret.BASE_WIDTH_HEIGHT / 3);
  }

  draw = (): void => {
    this.base();
    this.turretBaseTop();
    this.turretBaseBottom();
    this.turretBasePivot();
    this.floor();
  }

  floor = (): void => {
    this.canvas.ctx.fillStyle = Canvas.BLACK;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(0, (this.canvas.height - Turret.SCORE_HEIGHT), this.canvas.width, Turret.SCORE_HEIGHT);
    this.canvas.ctx.fill();
    this.canvas.ctx.strokeStyle = Canvas.BLUE;
    this.canvas.ctx.lineWidth = 3;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(0, (this.canvas.height - Turret.SCORE_HEIGHT));
    this.canvas.ctx.lineTo(this.canvas.width, (this.canvas.height - Turret.SCORE_HEIGHT));
    this.canvas.ctx.stroke();
  }

  // Base.
  base = (): void => {
    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect((this.canvas.width / 2) - (Turret.BASE_WIDTH_HEIGHT / 2), (this.canvas.height - Turret.BASE_WIDTH_HEIGHT - Turret.SCORE_HEIGHT), Turret.BASE_WIDTH_HEIGHT, Turret.BASE_WIDTH_HEIGHT);
    this.canvas.ctx.fill();
  }

  // Turret base top (the rounded part).
  turretBaseTop = (): void => {
    this.canvas.ctx.fillStyle = Canvas.PINK;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (Turret.BASE_WIDTH_HEIGHT + this.twh + Turret.SCORE_HEIGHT)), this.twh / 2, 1 * Math.PI, 0);
    this.canvas.ctx.fill();
  }

  // Turret base (square part).
  turretBaseBottom = (): void => {
    this.canvas.ctx.fillStyle = Canvas.PINK;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect((this.canvas.width / 2) - (this.twh / 2), (this.canvas.height - Turret.BASE_WIDTH_HEIGHT - this.twh - Turret.SCORE_HEIGHT), this.twh, this.twh);
    this.canvas.ctx.fill();
  }

  // The pivot point.
  turretBasePivot = (): void => {
    this.canvas.ctx.fillStyle = Canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (Turret.BASE_WIDTH_HEIGHT + this.twh + Turret.SCORE_HEIGHT)), this.twh / 8, 2 * Math.PI, 0);
    this.canvas.ctx.fill();
  }

}