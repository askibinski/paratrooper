import Canvas from "./canvas.js";

export default class Paratrooper {

  static readonly CHUTE_RADIUS = 30;
  static readonly CHUTE_LINE_WIDTH = 5;
  static readonly TROOPER_HEAD_SIZE = 12;
  static readonly JUMP_Y_OFFSET = 50;

  isGone: boolean;
  x: number;
  y: number;

  constructor(readonly canvas: Canvas) {
    this.isGone = false;
    this.x = 0;
    this.y = 0;
  }

  set jumpCoordinates(coordinates: { x: number, y: number }) {
    const { x, y } = coordinates;
    this.x = x;
    this.y = y;
  }

  run = (): void => {
    this.parachute();
    this.trooper();
    this.y++;
  }

  parachute = (): void => {
    // Left line.
    this.canvas.ctx.strokeStyle = Canvas.PINK;
    this.canvas.ctx.lineWidth = Paratrooper.CHUTE_LINE_WIDTH;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.x - (Paratrooper.CHUTE_RADIUS) + (Paratrooper.CHUTE_LINE_WIDTH / 2), this.y + Paratrooper.JUMP_Y_OFFSET - (4 * Paratrooper.TROOPER_HEAD_SIZE));
    this.canvas.ctx.lineTo(this.x, this.y + Paratrooper.JUMP_Y_OFFSET + 50 - (4 * Paratrooper.TROOPER_HEAD_SIZE));
    this.canvas.ctx.closePath();
    this.canvas.ctx.stroke();

    // Right line.
    this.canvas.ctx.strokeStyle = Canvas.PINK;
    this.canvas.ctx.lineWidth = Paratrooper.CHUTE_LINE_WIDTH;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.x + (Paratrooper.CHUTE_RADIUS) - (Paratrooper.CHUTE_LINE_WIDTH / 2), this.y + Paratrooper.JUMP_Y_OFFSET - (4 * Paratrooper.TROOPER_HEAD_SIZE));
    this.canvas.ctx.lineTo(this.x, this.y + Paratrooper.JUMP_Y_OFFSET + 50 - (4 * Paratrooper.TROOPER_HEAD_SIZE));
    this.canvas.ctx.closePath();
    this.canvas.ctx.stroke();

    // The chute.
    this.canvas.ctx.fillStyle = Canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.x, this.y + Paratrooper.JUMP_Y_OFFSET - (4 * Paratrooper.TROOPER_HEAD_SIZE), Paratrooper.CHUTE_RADIUS, 1 * Math.PI, 0);
    this.canvas.ctx.fill();

  }

  trooper = (): void => {
    // Head.
    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(this.x - (Paratrooper.TROOPER_HEAD_SIZE / 2), this.y + Paratrooper.JUMP_Y_OFFSET, Paratrooper.TROOPER_HEAD_SIZE, Paratrooper.TROOPER_HEAD_SIZE);
    this.canvas.ctx.fill();

    // Body.
    this.canvas.ctx.fillStyle = Canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(this.x - (Paratrooper.TROOPER_HEAD_SIZE / 2), this.y + Paratrooper.JUMP_Y_OFFSET + Paratrooper.TROOPER_HEAD_SIZE, Paratrooper.TROOPER_HEAD_SIZE, 1.5 * Paratrooper.TROOPER_HEAD_SIZE);
    this.canvas.ctx.fill();

    // Right arm (left for the viewer).
    this.canvas.ctx.fillStyle = Canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(this.x - (Paratrooper.TROOPER_HEAD_SIZE), this.y + Paratrooper.JUMP_Y_OFFSET + Paratrooper.TROOPER_HEAD_SIZE, (Paratrooper.TROOPER_HEAD_SIZE / 2), (Paratrooper.TROOPER_HEAD_SIZE / 2));
    this.canvas.ctx.fill();

    // Left arm.
    this.canvas.ctx.fillStyle = Canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(this.x + (Paratrooper.TROOPER_HEAD_SIZE / 2), this.y + Paratrooper.JUMP_Y_OFFSET + Paratrooper.TROOPER_HEAD_SIZE, (Paratrooper.TROOPER_HEAD_SIZE / 2), (Paratrooper.TROOPER_HEAD_SIZE / 2));
    this.canvas.ctx.fill();

    // Right leg (left for the viewer).
    this.canvas.ctx.fillStyle = Canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(this.x - (Paratrooper.TROOPER_HEAD_SIZE), this.y + Paratrooper.JUMP_Y_OFFSET + (2.5 * Paratrooper.TROOPER_HEAD_SIZE), (Paratrooper.TROOPER_HEAD_SIZE / 2), (1.5 * Paratrooper.TROOPER_HEAD_SIZE));
    this.canvas.ctx.fill();

    // Left leg.
    this.canvas.ctx.fillStyle = Canvas.BLUE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(this.x + (Paratrooper.TROOPER_HEAD_SIZE / 2), this.y + Paratrooper.JUMP_Y_OFFSET + (2.5 * Paratrooper.TROOPER_HEAD_SIZE), (Paratrooper.TROOPER_HEAD_SIZE / 2), (1.5 * Paratrooper.TROOPER_HEAD_SIZE));
    this.canvas.ctx.fill();

  }

}