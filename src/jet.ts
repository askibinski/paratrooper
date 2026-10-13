import Canvas from "./canvas";
import FlightController from "./flight-controller";
import GameState from "./game-state";
import { Bounds, getRndInteger } from "./utils";

// The jet of the original game as a pixel sprite, facing left: an outlined
// fuselage and tail fin, a white nose, a stripe and two exhaust sparks.
const JET_SPRITE = [
  '.......................CCCC',
  '......................C..C.',
  '.....................C...C.',
  '....................C....C.',
  '........WWWW.......C.....C.',
  '.....WWWWWWWCCCCCCC......C.',
  '...WWWWWWW...............CP',
  '..CWWW.......PPPPPPP.....C.',
  '..C.....................C.P',
  '...CCCCCCCCCCCCCCCCCCCCC...',
];

const JET_COLORS: Record<string, string> = {
  C: Canvas.BLUE,
  W: Canvas.WHITE,
  P: Canvas.PINK,
};

// Jets fly high and fast, and drop a bomb aimed at the turret.
export default class Jet {

  static readonly SPEED = 8;
  static readonly ALTITUDE = 45;
  // Size of one sprite pixel on the canvas.
  static readonly PIXEL_SIZE = 5;
  static readonly LENGTH = JET_SPRITE[0].length * Jet.PIXEL_SIZE;
  static readonly HEIGHT = JET_SPRITE.length * Jet.PIXEL_SIZE;
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
    return { left, right: left + Jet.LENGTH, top: this.y - Jet.HEIGHT / 2, bottom: this.y + Jet.HEIGHT / 2 };
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
    const size = Jet.PIXEL_SIZE;
    const top = this.y - (JET_SPRITE.length * size) / 2;

    // Drawn facing left; mirrored for jets coming from the left.
    ctx.save();
    if (this.direction === -1) {
      ctx.translate(this.x, 0);
      ctx.scale(-1, 1);
      ctx.translate(-this.x, 0);
    }

    JET_SPRITE.forEach((row, rowIndex) => {
      // Draw every run of the same color as one rectangle.
      for (let col = 0; col < row.length; col++) {
        const color = JET_COLORS[row[col]];
        if (!color) continue;

        const runStart = col;
        while (row[col + 1] === row[runStart]) col++;
        ctx.fillStyle = color;
        ctx.fillRect(this.x + runStart * size, top + rowIndex * size, (col - runStart + 1) * size, size);
      }
    });

    ctx.restore();
  }

}
