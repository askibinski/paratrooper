import Canvas from "./canvas";
import FlightController from "./flight-controller";
import GameState from "./game-state";
import { Bounds, getRndInteger } from "./utils";

// Jets fly high and fast, and drop a bomb aimed at the turret.
export default class Jet {

  static readonly SPEED = 8;
  static readonly ALTITUDE = 45;
  static readonly LENGTH = 132;
  static readonly START_CANVAS_OFFSET = 150;
  // Horizontal distance from the turret in which the bomb is released.
  static readonly DROP_MAX_DISTANCE = 650;
  static readonly DROP_MIN_DISTANCE = 280;

  // 1: flies from right to left. -1: flies from left to right (mirrored).
  direction = 1;
  x = 0;
  y = Jet.ALTITUDE;
  hasDropped = false;
  isGone = false;

  constructor(readonly canvas: Canvas, readonly flightController: FlightController, readonly state: GameState) { }

  launch = (direction: number): void => {
    this.direction = direction;
    this.x = (direction === -1) ? -Jet.START_CANVAS_OFFSET : this.canvas.width + Jet.START_CANVAS_OFFSET;
  }

  bounds = (): Bounds => {
    const left = this.direction === 1 ? this.x : this.x - Jet.LENGTH;
    return { left, right: left + Jet.LENGTH, top: this.y - 35, bottom: this.y + 30 };
  }

  run = (): void => {
    this.x -= this.direction * Jet.SPEED;
    this.maybeDropBomb();
    this.draw();

    if (this.x > this.canvas.width + Jet.START_CANVAS_OFFSET || this.x < -Jet.START_CANVAS_OFFSET) {
      this.isGone = true;
    }
  }

  maybeDropBomb = (): void => {
    if (this.hasDropped || !this.state.isPlaying) return;

    // Positive while approaching the turret.
    const distance = (this.x - this.canvas.centerX) * this.direction;
    if (distance > Jet.DROP_MAX_DISTANCE || distance < Jet.DROP_MIN_DISTANCE) return;

    // Drop at a random moment, but always before passing the minimum distance.
    if (getRndInteger(0, 25) === 0 || distance - Jet.SPEED < Jet.DROP_MIN_DISTANCE) {
      this.flightController.dropBomb(this.x + this.direction * 60, this.y + 15);
      this.hasDropped = true;
    }
  }

  draw = (): void => {
    const ctx = this.canvas.ctx;
    const { x, y } = this;

    // Drawn facing left; mirrored for jets coming from the left.
    ctx.save();
    if (this.direction === -1) {
      ctx.translate(x, y);
      ctx.scale(-1, 1);
      ctx.translate(-x, -y);
    }

    // Tail fin.
    ctx.fillStyle = Canvas.PINK;
    ctx.beginPath();
    ctx.moveTo(x + 95, y - 9);
    ctx.lineTo(x + 120, y - 35);
    ctx.lineTo(x + 132, y - 35);
    ctx.lineTo(x + 124, y - 9);
    ctx.closePath();
    ctx.fill();

    // Fuselage.
    ctx.fillStyle = Canvas.WHITE;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 25, y - 9);
    ctx.lineTo(x + 124, y - 9);
    ctx.lineTo(x + 128, y + 9);
    ctx.lineTo(x + 25, y + 9);
    ctx.closePath();
    ctx.fill();

    // Cockpit.
    ctx.fillStyle = Canvas.BLUE;
    ctx.fillRect(x + 20, y - 7, 18, 6);

    // Wing.
    ctx.fillStyle = Canvas.BLUE;
    ctx.beginPath();
    ctx.moveTo(x + 45, y + 3);
    ctx.lineTo(x + 90, y + 3);
    ctx.lineTo(x + 65, y + 30);
    ctx.lineTo(x + 48, y + 30);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

}
