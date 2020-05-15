import Canvas from "./canvas.js";
import TrooperController from "./trooper-controller.js";

export default class Heli {

  static readonly SCALE = 0.36;
  static readonly ROTOR_BLADE_MAX_LENGTH = 130;
  static readonly ROTOR_SPEED = 20;
  static readonly HELI_SPEED = 5;
  static readonly HELI_START_CANVAS_OFFSET = 100;
  static readonly HELI_TAIL_LENGTH = 180;

  heli: Heli;
  direction: number;
  paratrooper: boolean;
  startX: number;
  startY: number;
  rotorBladeLength: number;
  rotorBladeDirection: number;
  tailRotation: number;
  collisionWidth: number;
  isExploding: boolean;
  frame: number;
  frameSinceExplosion: number;
  isGone: boolean;
  multipliers: number[];
  explodeRotateDirections: number[];

  // If you look at the original game, I think helis from the right always
  // fly above the helis from the left (they never use the same height).
  constructor(readonly canvas: Canvas, readonly trooperController: TrooperController) {
    this.paratrooper = false;
    this.rotorBladeLength = 0;
    this.rotorBladeDirection = -1;
    this.tailRotation = 0;

    this.direction = 1;
    this.startX = 0;
    this.startY = 0;
    this.collisionWidth = 0;

    // Used for easier collision detecting.
    this.isExploding = false;
    this.frame = 0;
    this.frameSinceExplosion = 0;
    this.isGone = false;

    // "explode" multipliers. These are used to change the direction and speed
    // of the falling parts in a random way.
    // The length of these arrays corresponds to the number of items!
    this.multipliers = [0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3];
    this.explodeRotateDirections = [-1, -1, -1, -1, -1 - 1, 1, 1, 1, 1, 1, 1];
    this.multipliers = this.canvas.shuffle(this.multipliers);
    this.explodeRotateDirections = this.canvas.shuffle(this.explodeRotateDirections);
  }

  public set toggle(direction: number) {
    this.direction = direction;
    this.startX = (direction === -1) ? - Heli.HELI_START_CANVAS_OFFSET : this.canvas.width + Heli.HELI_START_CANVAS_OFFSET;
    this.collisionWidth = this.direction * Math.round(Heli.SCALE * Heli.HELI_TAIL_LENGTH);
  }

  public set height(height: number) {
    this.startY = height;
  }

  // A wrapper around every item part which needs to be drawn, containing logic
  // for the explosion.
  drawItem = (name: string, i: number) => {

    let x = !this.isExploding ? this.startX : this.startX + this.direction * (Heli.HELI_SPEED * this.multipliers[i]);
    let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multipliers[i]);

    const { centerX, centerY } = this.getItemPartCenter(name, x, y);

    if (this.isExploding) {
      this.canvas.ctx.save();
      this.canvas.ctx.translate(centerX, centerY);
      this.canvas.ctx.rotate(this.explodeRotateDirections[i] * this.tailRotation / 2 * Math.PI);
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
      case 'tail-long':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Heli.SCALE * 150), y - (Heli.SCALE * 15));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * (150 + Heli.HELI_TAIL_LENGTH)), y - (Heli.SCALE * 15));
        this.canvas.ctx.stroke();
        break;
      case 'tail-short':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 20);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Heli.SCALE * 150), y);
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 270), y);
        this.canvas.ctx.stroke();
        break;
      case 'heli-body':
        this.canvas.ctx.fillStyle = Canvas.BLACK;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 10);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y - (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y - (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 200), y);
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y + (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y + (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x, y);
        this.canvas.ctx.closePath();
        this.canvas.ctx.fill();
      case 'heli-body-stroke':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 10);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y - (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y - (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 200), y);
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y + (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y + (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x, y);
        this.canvas.ctx.closePath();
        this.canvas.ctx.stroke();
        break;
      case 'heli-body-window':
        this.canvas.ctx.fillStyle = Canvas.WHITE;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y - (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 125), y - (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 75), y);
        this.canvas.ctx.moveTo(x, y);
        this.canvas.ctx.lineTo(x, y);
        this.canvas.ctx.closePath();
        this.canvas.ctx.fill();
        break;
      case 'rotor-connection':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Heli.SCALE * 100), y - (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 100), y - (Heli.SCALE * 80));
        this.canvas.ctx.stroke();
        break;
      case 'top-rotor-left':
        this.canvas.ctx.strokeStyle = Canvas.PINK;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Heli.SCALE * 100), y - (Heli.SCALE * 80));
        this.canvas.ctx.lineTo(x + ((Heli.SCALE * 100) - (Heli.SCALE * this.rotorBladeLength)), y - (Heli.SCALE * 80));
        this.canvas.ctx.stroke();
        break;
      case 'top-rotor-right':
        this.canvas.ctx.strokeStyle = Canvas.PINK;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Heli.SCALE * 100), y - (Heli.SCALE * 80));
        this.canvas.ctx.lineTo(x + ((Heli.SCALE * 100) + (Heli.SCALE * this.rotorBladeLength)), y - (Heli.SCALE * 80));
        this.canvas.ctx.stroke();
        break;
      case 'landing-gear-left':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Heli.SCALE * 50), y + (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y + (Heli.SCALE * 85));
        this.canvas.ctx.stroke();
        break;
      case 'landing-gear-right':
        this.canvas.ctx.strokeStyle = Canvas.WHITE;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y + (Heli.SCALE * 50));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y + (Heli.SCALE * 85));
        this.canvas.ctx.stroke();
        break;
      case 'landing-gear-bar':
        this.canvas.ctx.strokeStyle = Canvas.BLUE;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 10);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x - (Heli.SCALE * 20), y + (Heli.SCALE * 65));
        this.canvas.ctx.lineTo(x, y + (Heli.SCALE * 85));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 210), y + (Heli.SCALE * 85));
        this.canvas.ctx.stroke();
        break;
      case 'tail-rotor':
        if (!this.isExploding) {
          this.canvas.ctx.save();
          this.canvas.ctx.translate(centerX, centerY);
          this.canvas.ctx.rotate(-this.tailRotation * Math.PI);
          this.canvas.ctx.translate(-centerX, -centerY);
        }
        this.canvas.ctx.strokeStyle = Canvas.PINK;
        this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x + (Heli.SCALE * 330), y - ((Heli.SCALE * 15) - (Heli.SCALE * 25)));
        this.canvas.ctx.lineTo(x + (Heli.SCALE * 330), y - ((Heli.SCALE * 15) + (Heli.SCALE * 25)));
        this.canvas.ctx.stroke();
        this.tailRotation = this.tailRotation + 0.1;
        this.canvas.ctx.restore();
        // @TODO this is a weak way to make sure all the falling parts from the explosion
        // are off-canvas so we can remove the heli in flight controller.
        if (y > (2 * this.canvas.height)) {
          this.isGone = true;
        }
        break;
    }
  }

  // Used for the translate back and forth in case of exploding.
  getItemPartCenter = (name: string, x: number, y: number): { centerX: number, centerY: number } => {
    switch (name) {
      case 'tail-long':
        return {
          centerX: x + (Heli.SCALE * (150 + (Heli.HELI_TAIL_LENGTH / 2))),
          centerY: y - (Heli.SCALE * 15),
        }
        break;
      case 'tail-short':
        return {
          centerX: x + (Heli.SCALE * 210),
          centerY: y,
        }
        break;
      case 'heli-body':
        return {
          centerX: x + (Heli.SCALE * 100),
          centerY: y,
        }
        break;
      case 'heli-body-stroke':
        return {
          centerX: x + (Heli.SCALE * 100),
          centerY: y,
        }
        break;
      case 'heli-body-window':
        return {
          centerX: x + (Heli.SCALE * 62.5),
          centerY: y - (Heli.SCALE * 25),
        }
        break;
      case 'rotor-connection':
        return {
          centerX: x + (Heli.SCALE * 100),
          centerY: y - (Heli.SCALE * 65),
        }
        break;
      case 'top-rotor-left':
        return {
          centerX: x + (Heli.SCALE * 100),
          centerY: y - (Heli.SCALE * 80),
        }
        break;
      case 'top-rotor-right':
        return {
          centerX: x + (Heli.SCALE * 100),
          centerY: y - (Heli.SCALE * 80),
        }
        break;
      case 'landing-gear-left':
        return {
          centerX: x + (Heli.SCALE * 50),
          centerY: y + (Heli.SCALE * 67.5),
        }
        break;
      case 'landing-gear-right':
        return {
          centerX: x + (Heli.SCALE * 150),
          centerY: y + (Heli.SCALE * 76.5),
        }
        break;
      case 'landing-gear-bar':
        return {
          centerX: x + (Heli.SCALE * 105),
          centerY: y + (Heli.SCALE * 85),
        }
        break;
      case 'tail-rotor':
        return {
          centerX: x + (Heli.SCALE * 330),
          centerY: y - (Heli.SCALE * 15),
        }
        break;
    }
  }

  draw = (): void => {
    this.frame++;

    // Each frame, there is a 0,05% chance a trooper will jump.
    if (!this.paratrooper && this.canvas.getRndInteger(1, 100) === 1) {
      this.trooperController.createTrooper(this.startX, this.startY);
      this.paratrooper = true;
      console.log('jump!');
    }

    // This is a trick to use the frames since explosion for altering the
    // positions of the exploding parts. We only use half the frames (even
    // numbers) otherwise the animation is too fast.
    if (this.isExploding && this.frame % 2 == 0) {
      this.frameSinceExplosion++;
    }

    // Mirror the heli around the y-axis (for helis coming from the left).
    this.canvas.ctx.save();
    if (this.direction === -1) {
      this.canvas.ctx.translate(this.startX, this.startY);
      this.canvas.ctx.scale(-1, 1);
      this.canvas.ctx.translate(-this.startX, -this.startY);
    }

    // Draw all the things!
    this.drawItem('tail-long', 0);
    this.drawItem('tail-short', 1);
    this.drawItem('heli-body', 2);
    this.drawItem('heli-body-stroke', 3);
    this.drawItem('heli-body-window', 4);
    this.drawItem('rotor-connection', 5);
    this.drawItem('top-rotor-left', 6);
    this.drawItem('top-rotor-right', 7);
    this.drawItem('landing-gear-left', 8);
    this.drawItem('landing-gear-right', 9);
    this.drawItem('landing-gear-bar', 10);
    this.drawItem('tail-rotor', 11);

    // Visually, this gives the impression of rotating blades, because our brain want to believe.
    this.rotorBladeLength = this.rotorBladeLength + (this.rotorBladeDirection * Heli.ROTOR_SPEED);
    if (this.rotorBladeLength < 0 || this.rotorBladeLength > Heli.ROTOR_BLADE_MAX_LENGTH) {
      this.rotorBladeDirection = -1 * this.rotorBladeDirection;
    }

    // Hit X range (debug)
    // this.canvas.ctx.strokeStyle = '#FF0000';
    // this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
    // this.canvas.ctx.beginPath();
    // this.canvas.ctx.moveTo(this.startX, this.startY);
    // this.canvas.ctx.lineTo(this.startX + (Heli.SCALE * (2 * Heli.HELI_TAIL_LENGTH)), this.startY);
    // this.canvas.ctx.stroke();

    // The second restore for the mirroring.
    this.canvas.ctx.restore();

    // Make the whole thing fly!
    this.startX = this.startX - (this.direction * Heli.HELI_SPEED);

    if (this.wentOffCanvas()) {
      this.isGone = true;
    }
  }

  // Check if the heli flied over and went off canvas.
  wentOffCanvas = () => {
    return ((this.startX > (this.canvas.width + Heli.HELI_START_CANVAS_OFFSET)) || (this.startX < (-Heli.HELI_START_CANVAS_OFFSET)));
  }

}