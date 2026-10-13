import Canvas from "./canvas";
import TrooperController from "./trooper-controller";
import { Bounds, getRndInteger } from "./utils";

// falling: in the air. landed: on the ground (or on top of other troopers).
// assault: storming the turret.
export type TrooperState = 'falling' | 'landed' | 'assault';
// packed: not deployed (yet). open: floating down. shot: bad luck.
export type ChuteState = 'packed' | 'open' | 'shot';

interface Waypoint {
  x: number;
  y: number;
}

export default class Paratrooper {

  static readonly HEAD_SIZE = 12;
  static readonly WIDTH = 2 * Paratrooper.HEAD_SIZE;
  static readonly HEIGHT = 4 * Paratrooper.HEAD_SIZE;
  static readonly CHUTE_RADIUS = 30;
  static readonly CHUTE_LINE_WIDTH = 5;
  // Distance between the top of the head and the canopy.
  static readonly CHUTE_OFFSET = 48;
  static readonly CHUTE_FALL_SPEED = 1;
  static readonly FREE_FALL_SPEED = 4;
  static readonly SETTLE_SPEED = 4;
  static readonly WALK_SPEED = 2;

  // x is the center of the trooper, y the top of the head.
  x = 0;
  y = 0;
  state: TrooperState = 'falling';
  chute: ChuteState = 'packed';
  // Used to know who is standing on whom.
  landOrder = 0;
  waypoints: Waypoint[] = [];
  isGone = false;
  // Frames of free fall before the chute opens.
  private deployDelay = getRndInteger(10, 60);

  constructor(readonly canvas: Canvas, readonly trooperController: TrooperController) { }

  bodyBounds = (): Bounds => {
    return {
      left: this.x - Paratrooper.WIDTH / 2,
      right: this.x + Paratrooper.WIDTH / 2,
      top: this.y,
      bottom: this.y + Paratrooper.HEIGHT,
    };
  }

  chuteBounds = (): Bounds => {
    const canopy = this.y - Paratrooper.CHUTE_OFFSET;
    return {
      left: this.x - Paratrooper.CHUTE_RADIUS,
      right: this.x + Paratrooper.CHUTE_RADIUS,
      top: canopy - Paratrooper.CHUTE_RADIUS,
      bottom: canopy + Paratrooper.CHUTE_RADIUS / 2,
    };
  }

  update = (): void => {
    switch (this.state) {
      case 'falling':
        this.fall();
        break;
      case 'landed':
        this.settle();
        break;
      case 'assault':
        // Marching is coordinated by the trooper controller.
        break;
    }
  }

  fall = (): void => {
    if (this.chute === 'packed' && --this.deployDelay <= 0) {
      this.chute = 'open';
    }

    // Obviously, because of Newton, a trooper falls faster without a chute.
    // There are 2 scenarios: he didn't deploy yet, or the poor bastard got
    // his chute shot down (which by the way is not against the convention
    // of Geneva apparently: https://en.wikipedia.org/wiki/Attacks_on_parachutists
    const speed = this.chute === 'open' ? Paratrooper.CHUTE_FALL_SPEED : Paratrooper.FREE_FALL_SPEED;
    const surface = this.trooperController.surfaceAt(this.x);

    if (this.y + Paratrooper.HEIGHT + speed < surface) {
      this.y += speed;
      return;
    }

    this.y = surface - Paratrooper.HEIGHT;
    if (this.chute === 'open') {
      this.trooperController.land(this);
    }
    else {
      this.trooperController.crash(this);
    }
  }

  // Troopers standing on someone who got shot drop down.
  settle = (): void => {
    const restingY = this.trooperController.restingY(this);
    if (this.y < restingY) {
      this.y = Math.min(restingY, this.y + Paratrooper.SETTLE_SPEED);
    }
  }

  // Move towards the next waypoint: first horizontally, then vertically.
  // Returns true when all waypoints are reached.
  march = (): boolean => {
    const waypoint = this.waypoints[0];
    if (!waypoint) return true;

    const step = (from: number, to: number): number => from + Math.sign(to - from) * Math.min(Paratrooper.WALK_SPEED, Math.abs(to - from));
    if (this.x !== waypoint.x) {
      this.x = step(this.x, waypoint.x);
    }
    else if (this.y !== waypoint.y) {
      this.y = step(this.y, waypoint.y);
    }
    else {
      this.waypoints.shift();
    }
    return this.waypoints.length === 0;
  }

  draw = (): void => {
    this.trooper();
    if (this.state === 'falling' && this.chute === 'open') {
      this.parachute();
    }
  }

  parachute = (): void => {
    const ctx = this.canvas.ctx;
    const canopy = this.y - Paratrooper.CHUTE_OFFSET;
    const lineOffset = Paratrooper.CHUTE_RADIUS - (Paratrooper.CHUTE_LINE_WIDTH / 2);

    // Lines.
    ctx.strokeStyle = Canvas.PINK;
    ctx.lineWidth = Paratrooper.CHUTE_LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(this.x - lineOffset, canopy);
    ctx.lineTo(this.x, this.y + 2);
    ctx.lineTo(this.x + lineOffset, canopy);
    ctx.stroke();

    // The chute.
    ctx.fillStyle = Canvas.BLUE;
    ctx.beginPath();
    ctx.arc(this.x, canopy, Paratrooper.CHUTE_RADIUS, Math.PI, 0);
    ctx.fill();
  }

  trooper = (): void => {
    const ctx = this.canvas.ctx;
    const h = Paratrooper.HEAD_SIZE;
    const { x, y } = this;

    // Head.
    ctx.fillStyle = Canvas.WHITE;
    ctx.fillRect(x - h / 2, y, h, h);

    ctx.fillStyle = Canvas.BLUE;
    // Body.
    ctx.fillRect(x - h / 2, y + h, h, 1.5 * h);
    // Arms.
    ctx.fillRect(x - h, y + h, h / 2, h / 2);
    ctx.fillRect(x + h / 2, y + h, h / 2, h / 2);
    // Legs.
    ctx.fillRect(x - h, y + 2.5 * h, h / 2, 1.5 * h);
    ctx.fillRect(x + h / 2, y + 2.5 * h, h / 2, 1.5 * h);
  }

}
