import Canvas from "./canvas";
import Turret from "./turret";

export default class Aircraft {

  static readonly SCALE = 0.35;
  static readonly AIRCRAFT_SPEED = 7;
  static readonly AIRCRAFT_START_CANVAS_OFFSET = 100;
  static readonly AIRCRAFT_LENGTH = 200;
  static readonly AIRCRAFT_HEIGHT = 60;
  static readonly BOMB_DROP_THRESHOLD = 20;

  direction: number;
  startX: number;
  startY: number;
  collisionWidth: number;
  isExploding: boolean;
  frame: number;
  frameSinceExplosion: number;
  isGone: boolean;
  multipliers: number[];
  explodeRotateDirections: number[];
  shouldDropBomb: boolean;
  bombDropped: boolean;

  constructor(readonly canvas: Canvas) {
    this.direction = 1;
    this.startX = 0;
    this.startY = 0;
    this.collisionWidth = 0;

    // Used for collision detection
    this.isExploding = false;
    this.frame = 0;
    this.frameSinceExplosion = 0;
    this.isGone = false;
    this.shouldDropBomb = false;
    this.bombDropped = false;

    // "explode" multipliers. These are used to change the direction and speed
    // of the falling parts in a random way.
    this.multipliers = [0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3];
    this.explodeRotateDirections = [-1, -1, -1, -1, -1 - 1, 1, 1, 1, 1, 1, 1];
    this.multipliers = this.canvas.shuffle(this.multipliers);
    this.explodeRotateDirections = this.canvas.shuffle(this.explodeRotateDirections);
  }

  set toggle(direction: number) {
    this.direction = direction;
    this.startX = (direction === -1) ? - Aircraft.AIRCRAFT_START_CANVAS_OFFSET : this.canvas.width + Aircraft.AIRCRAFT_START_CANVAS_OFFSET;
    this.collisionWidth = this.direction * Math.round(Aircraft.SCALE * Aircraft.AIRCRAFT_LENGTH);
  }

  set height(height: number) {
    this.startY = height;
  }

  // Check if the aircraft is directly over the turret (to drop bombs)
  isOverTurret(): boolean {
    const turretCenter = this.canvas.width / 2;
    const aircraftCenter = this.startX + (Aircraft.SCALE * Aircraft.AIRCRAFT_LENGTH / 2);
    
    return Math.abs(turretCenter - aircraftCenter) < Aircraft.BOMB_DROP_THRESHOLD &&
           !this.bombDropped && !this.isExploding;
  }

  // A wrapper around every item part which needs to be drawn, containing logic
  // for the explosion.
  drawItem = (name: string, i: number) => {
    let x = !this.isExploding ? this.startX : this.startX + this.direction * (Aircraft.AIRCRAFT_SPEED * this.multipliers[i]);
    let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multipliers[i]);

    const { centerX, centerY } = this.getItemPartCenter(name, x, y);

    if (this.isExploding) {
      this.canvas.ctx.save();
      this.canvas.ctx.translate(centerX, centerY);
      this.canvas.ctx.rotate(this.explodeRotateDirections[i] * 0.05 * Math.PI);
      this.canvas.ctx.translate(-centerX, -centerY);
    }

    this.drawItemPart(name, x, y, centerX, centerY);

    if (this.isExploding) {
      this.canvas.ctx.restore();
    }
  }

  // The core part of drawing an item part.
  drawItemPart = (name: string, x: number, y: number, centerX: number, centerY: number) => {
    switch (name) {
      case 'body':
        this.canvas.ctx.fillStyle = Canvas.BLACK;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 50), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 150), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 200), y);
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 150), y + (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 50), y + (Aircraft.SCALE * 20));
        this.canvas.ctx.closePath();
        this.canvas.ctx.fill();
        break;
      case 'body-stroke':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Aircraft.SCALE * 8);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 50), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 150), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 200), y);
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 150), y + (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 50), y + (Aircraft.SCALE * 20));
        this.canvas.ctx.closePath();
        this.canvas.ctx.stroke();
        break;
      case 'cockpit':
        this.canvas.ctx.fillStyle = Canvas.WHITE;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Aircraft.SCALE * 50), y - (Aircraft.SCALE * 10));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 70), y - (Aircraft.SCALE * 15));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 90), y - (Aircraft.SCALE * 15));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 100), y - (Aircraft.SCALE * 10));
        this.canvas.ctx.closePath();
        this.canvas.ctx.fill();
        break;
      case 'wing-top':
        this.canvas.ctx.fillStyle = Canvas.BLACK;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Aircraft.SCALE * 100), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 75), y - (Aircraft.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 125), y - (Aircraft.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 125), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.closePath();
        this.canvas.ctx.fill();
        break;
      case 'wing-top-stroke':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Aircraft.SCALE * 6);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Aircraft.SCALE * 100), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 75), y - (Aircraft.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 125), y - (Aircraft.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 125), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.closePath();
        this.canvas.ctx.stroke();
        break;
      case 'wing-bottom':
        this.canvas.ctx.fillStyle = Canvas.BLACK;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Aircraft.SCALE * 100), y + (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 75), y + (Aircraft.SCALE * 40));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 125), y + (Aircraft.SCALE * 40));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 125), y + (Aircraft.SCALE * 20));
        this.canvas.ctx.closePath();
        this.canvas.ctx.fill();
        break;
      case 'wing-bottom-stroke':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Aircraft.SCALE * 6);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Aircraft.SCALE * 100), y + (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 75), y + (Aircraft.SCALE * 40));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 125), y + (Aircraft.SCALE * 40));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 125), y + (Aircraft.SCALE * 20));
        this.canvas.ctx.closePath();
        this.canvas.ctx.stroke();
        break;
      case 'tail':
        this.canvas.ctx.fillStyle = Canvas.BLACK;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Aircraft.SCALE * 150), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 160), y - (Aircraft.SCALE * 40));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 175), y - (Aircraft.SCALE * 40));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 175), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.closePath();
        this.canvas.ctx.fill();
        break;
      case 'tail-stroke':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Aircraft.SCALE * 6);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Aircraft.SCALE * 150), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 160), y - (Aircraft.SCALE * 40));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 175), y - (Aircraft.SCALE * 40));
        this.canvas.ctx.lineTo(x + (Aircraft.SCALE * 175), y - (Aircraft.SCALE * 20));
        this.canvas.ctx.closePath();
        this.canvas.ctx.stroke();
        break;
    }

    // Check if aircraft is off screen (for cleanup)
    if (y > (2 * this.canvas.height)) {
      this.isGone = true;
    }
  }

  // Used for the translate back and forth in case of exploding.
  getItemPartCenter = (name: string, x: number, y: number): { centerX: number, centerY: number } => {
    switch (name) {
      case 'body':
      case 'body-stroke':
        return {
          centerX: x + (Aircraft.SCALE * 100),
          centerY: y,
        };
      case 'cockpit':
        return {
          centerX: x + (Aircraft.SCALE * 75),
          centerY: y - (Aircraft.SCALE * 12.5),
        };
      case 'wing-top':
      case 'wing-top-stroke':
        return {
          centerX: x + (Aircraft.SCALE * 100),
          centerY: y - (Aircraft.SCALE * 35),
        };
      case 'wing-bottom':
      case 'wing-bottom-stroke':
        return {
          centerX: x + (Aircraft.SCALE * 100),
          centerY: y + (Aircraft.SCALE * 30),
        };
      case 'tail':
      case 'tail-stroke':
        return {
          centerX: x + (Aircraft.SCALE * 165),
          centerY: y - (Aircraft.SCALE * 30),
        };
      default:
        return {
          centerX: x,
          centerY: y,
        };
    }
  }

  draw = (): void => {
    this.frame++;

    // Each framerun, check if we should drop a bomb
    if (this.isOverTurret() && !this.bombDropped) {
      this.shouldDropBomb = true;
      this.bombDropped = true;
    }

    // This is a trick to use the frames since explosion for altering the
    // positions of the exploding parts. We only use half the frames (even
    // numbers) otherwise the animation is too fast.
    if (this.isExploding && this.frame % 2 == 0) {
      this.frameSinceExplosion++;
    }

    // Mirror the aircraft around the y-axis (for aircraft coming from the left).
    this.canvas.ctx.save();
    if (this.direction === -1) {
      this.canvas.ctx.translate(this.startX, this.startY);
      this.canvas.ctx.scale(-1, 1);
      this.canvas.ctx.translate(-this.startX, -this.startY);
    }

    // Draw all the aircraft parts
    this.drawItem('body', 0);
    this.drawItem('body-stroke', 1);
    this.drawItem('cockpit', 2);
    this.drawItem('wing-top', 3);
    this.drawItem('wing-top-stroke', 4);
    this.drawItem('wing-bottom', 5);
    this.drawItem('wing-bottom-stroke', 6);
    this.drawItem('tail', 7);
    this.drawItem('tail-stroke', 8);

    // The second restore for the mirroring.
    this.canvas.ctx.restore();

    // Make the aircraft fly!
    this.startX = this.startX - (this.direction * Aircraft.AIRCRAFT_SPEED);

    if (this.wentOffCanvas()) {
      this.isGone = true;
    }
  }

  // Check if the aircraft flew over and went off canvas.
  wentOffCanvas = (): boolean => {
    return ((this.startX > (this.canvas.width + Aircraft.AIRCRAFT_START_CANVAS_OFFSET)) || 
            (this.startX < (-Aircraft.AIRCRAFT_START_CANVAS_OFFSET)));
  }
}