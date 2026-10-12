import Canvas from "./canvas";
import TrooperController from "./trooper-controller";
import GameState from "./game-state";
import Turret from "./turret";
import { Bounds, getRndInteger, shuffle } from "./utils";

// The parts of a heli, drawn back to front. When the heli explodes, every
// part falls down separately.
const HELI_PARTS = [
  'tail-long',
  'tail-short',
  'heli-body',
  'heli-body-stroke',
  'heli-body-window',
  'rotor-connection',
  'top-rotor-left',
  'top-rotor-right',
  'landing-gear-left',
  'landing-gear-right',
  'landing-gear-bar',
  'tail-rotor',
] as const;

type HeliPart = typeof HELI_PARTS[number];

export default class Heli {

  static readonly SCALE = 0.36;
  static readonly ROTOR_BLADE_MAX_LENGTH = 130;
  static readonly ROTOR_SPEED = 20;
  static readonly START_CANVAS_OFFSET = 100;
  static readonly TAIL_LENGTH = 180;
  static readonly JUMP_MARGIN = 50;
  // Troopers stay clear of the turret, so there is room to storm it.
  static readonly TURRET_MARGIN = 50;
  static readonly DROP_COOLDOWN = 40;
  static readonly HIT_HEIGHT = 30;
  // Frames after which all exploding parts have fallen off canvas.
  static readonly EXPLOSION_FRAMES = 60;

  // 1: flies from right to left. -1: flies from left to right (mirrored).
  direction = 1;
  startX = 0;
  startY = 0;
  speed = 5;
  maxTroopers = 1;
  troopersDropped = 0;
  dropCooldown = 0;
  rotorBladeLength = 0;
  rotorBladeDirection = -1;
  tailRotation = 0;
  isExploding = false;
  frame = 0;
  frameSinceExplosion = 0;
  isGone = false;

  // "explode" multipliers. These are used to change the direction and speed
  // of the falling parts in a random way. One for every part.
  private multipliers: number[];
  private explodeRotateDirections: number[];

  // If you look at the original game, I think helis from the right always
  // fly above the helis from the left (they never use the same height).
  constructor(readonly canvas: Canvas, readonly trooperController: TrooperController, readonly state: GameState) {
    this.multipliers = shuffle([0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3]);
    this.explodeRotateDirections = shuffle([-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1]);
  }

  launch = (direction: number, height: number): void => {
    this.direction = direction;
    this.startY = height;
    this.startX = (direction === -1) ? -Heli.START_CANVAS_OFFSET : this.canvas.width + Heli.START_CANVAS_OFFSET;
  }

  get centerX(): number {
    return this.startX + this.direction * Heli.SCALE * 100;
  }

  bounds = (): Bounds => {
    const width = Math.round(2 * Heli.SCALE * Heli.TAIL_LENGTH);
    const left = this.direction === 1 ? this.startX : this.startX - width;
    return { left, right: left + width, top: this.startY - Heli.HIT_HEIGHT, bottom: this.startY + Heli.HIT_HEIGHT };
  }

  run = (): void => {
    this.frame++;
    this.maybeDropTrooper();

    // This is a trick to use the frames since explosion for altering the
    // positions of the exploding parts. We only use half the frames (even
    // numbers) otherwise the animation is too fast.
    if (this.isExploding && this.frame % 2 === 0) {
      this.frameSinceExplosion++;
    }

    this.draw();

    // Visually, this gives the impression of rotating blades, because our brain want to believe.
    this.rotorBladeLength += this.rotorBladeDirection * Heli.ROTOR_SPEED;
    if (this.rotorBladeLength < 0 || this.rotorBladeLength > Heli.ROTOR_BLADE_MAX_LENGTH) {
      this.rotorBladeDirection = -this.rotorBladeDirection;
    }
    this.tailRotation += 0.1;

    // Make the whole thing fly!
    this.startX -= this.direction * this.speed;

    if (this.wentOffCanvas() || this.frameSinceExplosion > Heli.EXPLOSION_FRAMES) {
      this.isGone = true;
    }
  }

  // Each frame there is a small chance a trooper will jump, but not near the
  // canvas border or above (or close to) the turret.
  maybeDropTrooper = (): void => {
    if (this.dropCooldown > 0) {
      this.dropCooldown--;
      return;
    }
    if (this.isExploding || !this.state.isPlaying || this.troopersDropped >= this.maxTroopers) return;
    if (getRndInteger(0, 100) !== 0) return;

    // Troopers land on a grid, so they can stack (and be killed by a
    // trooper falling on top of them).
    const x = TrooperController.snapToGrid(this.centerX);
    const turretZone = Turret.BASE_SIZE / 2 + Heli.TURRET_MARGIN;
    if (x < Heli.JUMP_MARGIN || x > this.canvas.width - Heli.JUMP_MARGIN || Math.abs(x - this.canvas.centerX) < turretZone) return;

    this.trooperController.createTrooper(x, this.startY + 40);
    this.troopersDropped++;
    this.dropCooldown = Heli.DROP_COOLDOWN;
  }

  draw = (): void => {
    const ctx = this.canvas.ctx;

    // Mirror the heli around the y-axis (for helis coming from the left).
    ctx.save();
    if (this.direction === -1) {
      ctx.translate(this.startX, this.startY);
      ctx.scale(-1, 1);
      ctx.translate(-this.startX, -this.startY);
    }

    // Draw all the things!
    HELI_PARTS.forEach((part, i) => this.drawItem(part, i));

    ctx.restore();
  }

  // A wrapper around every item part which needs to be drawn, containing logic
  // for the explosion.
  drawItem = (name: HeliPart, i: number): void => {
    const ctx = this.canvas.ctx;
    const x = !this.isExploding ? this.startX : this.startX + this.direction * (this.speed * this.multipliers[i]);
    const y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multipliers[i]);
    const { centerX, centerY } = this.getItemPartCenter(name, x, y);

    ctx.save();
    if (this.isExploding) {
      ctx.translate(centerX, centerY);
      ctx.rotate(this.explodeRotateDirections[i] * this.tailRotation / 2 * Math.PI);
      ctx.translate(-centerX, -centerY);
    }
    this.drawItemPart(name, x, y, centerX, centerY);
    ctx.restore();
  }

  // Draws a straight line, the building block of most heli parts.
  line = (color: string, width: number, points: [number, number][]): void => {
    const ctx = this.canvas.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = Heli.SCALE * width;
    ctx.beginPath();
    points.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
    ctx.stroke();
  }

  bodyPath = (x: number, y: number): void => {
    const ctx = this.canvas.ctx;
    const s = Heli.SCALE;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (s * 50), y - (s * 50));
    ctx.lineTo(x + (s * 150), y - (s * 50));
    ctx.lineTo(x + (s * 200), y);
    ctx.lineTo(x + (s * 150), y + (s * 50));
    ctx.lineTo(x + (s * 50), y + (s * 50));
    ctx.closePath();
  }

  // The core part of drawing an item part.
  drawItemPart = (name: HeliPart, x: number, y: number, centerX: number, centerY: number): void => {
    const ctx = this.canvas.ctx;
    const s = Heli.SCALE;

    switch (name) {
      case 'tail-long':
        this.line(Canvas.WHITE, 15, [[x + (s * 150), y - (s * 15)], [x + (s * (150 + Heli.TAIL_LENGTH)), y - (s * 15)]]);
        break;
      case 'tail-short':
        this.line(Canvas.WHITE, 20, [[x + (s * 150), y], [x + (s * 270), y]]);
        break;
      case 'heli-body':
        ctx.fillStyle = Canvas.BLACK;
        this.bodyPath(x, y);
        ctx.fill();
        break;
      case 'heli-body-stroke':
        ctx.strokeStyle = Canvas.WHITE;
        ctx.lineWidth = s * 10;
        this.bodyPath(x, y);
        ctx.stroke();
        break;
      case 'heli-body-window':
        ctx.fillStyle = Canvas.WHITE;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (s * 50), y - (s * 50));
        ctx.lineTo(x + (s * 125), y - (s * 50));
        ctx.lineTo(x + (s * 75), y);
        ctx.closePath();
        ctx.fill();
        break;
      case 'rotor-connection':
        this.line(Canvas.WHITE, 15, [[x + (s * 100), y - (s * 50)], [x + (s * 100), y - (s * 80)]]);
        break;
      case 'top-rotor-left':
        this.line(Canvas.PINK, 15, [[x + (s * 100), y - (s * 80)], [x + (s * 100) - (s * this.rotorBladeLength), y - (s * 80)]]);
        break;
      case 'top-rotor-right':
        this.line(Canvas.PINK, 15, [[x + (s * 100), y - (s * 80)], [x + (s * 100) + (s * this.rotorBladeLength), y - (s * 80)]]);
        break;
      case 'landing-gear-left':
        this.line(Canvas.WHITE, 15, [[x + (s * 50), y + (s * 50)], [x + (s * 50), y + (s * 85)]]);
        break;
      case 'landing-gear-right':
        this.line(Canvas.WHITE, 15, [[x + (s * 150), y + (s * 50)], [x + (s * 150), y + (s * 85)]]);
        break;
      case 'landing-gear-bar':
        this.line(Canvas.BLUE, 10, [[x - (s * 20), y + (s * 65)], [x, y + (s * 85)], [x + (s * 210), y + (s * 85)]]);
        break;
      case 'tail-rotor':
        // When exploding, drawItem() already rotates this part.
        if (!this.isExploding) {
          ctx.translate(centerX, centerY);
          ctx.rotate(-this.tailRotation * Math.PI);
          ctx.translate(-centerX, -centerY);
        }
        this.line(Canvas.PINK, 15, [[x + (s * 330), y + (s * 10)], [x + (s * 330), y - (s * 40)]]);
        break;
    }
  }

  // Used for the translate back and forth in case of exploding.
  getItemPartCenter = (name: HeliPart, x: number, y: number): { centerX: number, centerY: number } => {
    const s = Heli.SCALE;
    const centers: Record<HeliPart, [number, number]> = {
      'tail-long': [150 + (Heli.TAIL_LENGTH / 2), -15],
      'tail-short': [210, 0],
      'heli-body': [100, 0],
      'heli-body-stroke': [100, 0],
      'heli-body-window': [62.5, -25],
      'rotor-connection': [100, -65],
      'top-rotor-left': [100, -80],
      'top-rotor-right': [100, -80],
      'landing-gear-left': [50, 67.5],
      'landing-gear-right': [150, 76.5],
      'landing-gear-bar': [105, 85],
      'tail-rotor': [330, -15],
    };
    const [dx, dy] = centers[name];
    return { centerX: x + s * dx, centerY: y + s * dy };
  }

  // Check if the heli flew over and went off canvas.
  wentOffCanvas = (): boolean => {
    return this.startX > this.canvas.width + Heli.START_CANVAS_OFFSET || this.startX < -Heli.START_CANVAS_OFFSET;
  }

}
