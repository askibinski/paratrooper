import Canvas from "./canvas";
import Turret from "./turret";
import FlightController from "./flight-controller";
import TrooperController from "./trooper-controller";
import Score from "./score";
import Effects from "./effects";
import Sound from "./sound";
import { contains } from "./utils";

export default class Bullet {

  static readonly SIZE = 10;
  static readonly SPEED = 10;

  static readonly POINTS_HELI = 10;
  static readonly POINTS_JET = 10;
  static readonly POINTS_BOMB = 30;

  // The center of the bullet.
  x: number;
  y: number;
  // Angle in radians, 0 is straight up.
  angle = 0;
  isGone = false;

  constructor(
    readonly canvas: Canvas,
    readonly turret: Turret,
    readonly flightController: FlightController,
    readonly trooperController: TrooperController,
    readonly score: Score,
    readonly effects: Effects,
    readonly sound: Sound,
  ) {
    this.x = turret.pivotX;
    this.y = turret.pivotY;
    // Every time we shoot, the score is subtracted by one.
    this.score.subtract(1);
  }

  // Position as used by the barrel: in half turns, 0 is straight up.
  aim = (position: number): void => {
    this.angle = position * Math.PI;
  }

  run = (): void => {
    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.fillRect(this.x - Bullet.SIZE / 2, this.y - Bullet.SIZE / 2, Bullet.SIZE, Bullet.SIZE);

    // Yay for maths!
    this.x += Bullet.SPEED * Math.sin(this.angle);
    this.y -= Bullet.SPEED * Math.cos(this.angle);

    if (this.wentOffCanvas()) {
      this.isGone = true;
      return;
    }

    this.checkHits();
  }

  // A bullet can only hit one thing.
  checkHits = (): void => {
    this.isGone = this.hitBomb() || this.hitJet() || this.hitHeli() || this.hitTrooper();
  }

  hitBomb = (): boolean => {
    const bomb = this.flightController.bombs.find((b) => !b.isGone && contains(b.bounds(), this.x, this.y, Bullet.SIZE / 2));
    if (!bomb) return false;

    bomb.isGone = true;
    this.effects.explode(bomb.x, bomb.y, { count: 20, speed: 5, size: 6, life: 40 });
    this.effects.popup(bomb.x, bomb.y, `+${Bullet.POINTS_BOMB}`);
    this.sound.explosion();
    this.score.add(Bullet.POINTS_BOMB);
    return true;
  }

  hitJet = (): boolean => {
    const jet = this.flightController.jets.find((j) => !j.isGone && contains(j.bounds(), this.x, this.y, Bullet.SIZE / 2));
    if (!jet) return false;

    jet.isGone = true;
    const b = jet.bounds();
    const centerX = (b.left + b.right) / 2;
    const centerY = (b.top + b.bottom) / 2;
    this.effects.explode(centerX, centerY, { count: 40, speed: 8, size: 10, life: 70 });
    this.effects.popup(centerX, centerY + 40, `+${Bullet.POINTS_JET}`);
    this.sound.explosion();
    this.score.add(Bullet.POINTS_JET);
    return true;
  }

  hitHeli = (): boolean => {
    const heli = this.flightController.helis.find((h) => !h.isExploding && contains(h.bounds(), this.x, this.y, Bullet.SIZE / 2));
    if (!heli) return false;

    heli.isExploding = true;
    this.effects.explode(heli.centerX, heli.startY, { count: 15, speed: 5, size: 6, life: 40 });
    this.effects.popup(heli.centerX, heli.startY + 50, `+${Bullet.POINTS_HELI}`);
    this.sound.explosion();
    this.score.add(Bullet.POINTS_HELI);
    return true;
  }

  hitTrooper = (): boolean => {
    for (const trooper of this.trooperController.troopers) {
      // Once they storm the turret, it's too late.
      if (trooper.isGone || trooper.state === 'assault') continue;

      if (contains(trooper.bodyBounds(), this.x, this.y, Bullet.SIZE / 2)) {
        this.trooperController.kill(trooper);
        return true;
      }

      // A chute hit doesn't actually give you points. But the inevitable
      // death of the trooper will.
      if (trooper.state === 'falling' && trooper.chute === 'open' && contains(trooper.chuteBounds(), this.x, this.y, Bullet.SIZE / 2)) {
        trooper.chute = 'shot';
        this.sound.chuteHit();
        return true;
      }
    }
    return false;
  }

  // Check if the bullet went off canvas.
  wentOffCanvas = (): boolean => {
    return this.y < 0 || this.y > this.canvas.height || this.x < 0 || this.x > this.canvas.width;
  }

}
