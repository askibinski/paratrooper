import Canvas from "./canvas.js";

export default class Turret {

  BASE_WIDTH_HEIGHT = 200;
  SCORE_HEIGHT = 80;
  canvas: Canvas;
  twh: number;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    // Turret base width height. 
    this.twh = Math.round(this.BASE_WIDTH_HEIGHT / 3);
  }

  draw = () => {
    this.base();
    this.turretBaseTop();
    this.turretBaseBottom();
    this.turretBasePivot();
    this.floor();
  }

  floor = () => {
    this.canvas.ctx.fillStyle = this.canvas.BLACK;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(0, (this.canvas.height - this.SCORE_HEIGHT), this.canvas.width, this.SCORE_HEIGHT);
    this.canvas.ctx.fill();
    this.canvas.ctx.strokeStyle = this.canvas.BLUE;
    this.canvas.ctx.lineWidth = 3;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(0, (this.canvas.height - this.SCORE_HEIGHT));
    this.canvas.ctx.lineTo(this.canvas.width, (this.canvas.height - this.SCORE_HEIGHT));
    this.canvas.ctx.stroke();
  }

  // Base.
  base = () => {
    this.canvas.ctx.fillStyle = this.canvas.WHITE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect((this.canvas.width / 2) - (this.BASE_WIDTH_HEIGHT / 2), (this.canvas.height - this.BASE_WIDTH_HEIGHT - this.SCORE_HEIGHT), this.BASE_WIDTH_HEIGHT, this.BASE_WIDTH_HEIGHT);
    this.canvas.ctx.fill();
  }

  // Turret base top (the rounded part).
  turretBaseTop = () => {
    this.canvas.ctx.fillStyle = this.canvas.PINK;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (this.BASE_WIDTH_HEIGHT + this.twh + this.SCORE_HEIGHT)), this.twh / 2, 1 * Math.PI, 0);
    this.canvas.ctx.fill();
  }

  // Turret base (square part).
  turretBaseBottom = () => {
    this.canvas.ctx.fillStyle = this.canvas.PINK;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect((this.canvas.width / 2) - (this.twh / 2), (this.canvas.height - this.BASE_WIDTH_HEIGHT - this.twh - this.SCORE_HEIGHT), this.twh, this.twh);
    this.canvas.ctx.fill();
  }

  // The pivot point.
  turretBasePivot = () => {
    this.canvas.ctx.fillStyle = this.canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (this.BASE_WIDTH_HEIGHT + this.twh + this.SCORE_HEIGHT)), this.twh / 8, 2 * Math.PI, 0);
    this.canvas.ctx.fill();
  }

}