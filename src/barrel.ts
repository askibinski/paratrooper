import Canvas from "./canvas";
import Turret from "./turret";
import Bullet from "./bullet";
import GameState from "./game-state";
import Sound from "./sound";
import { isTyping } from "./utils";

export default class Barrel {

  static readonly ROTATE_SPEED = 0.01;
  // Max rotation to either side, in half turns (0.5 = horizontal).
  static readonly MAX_POSITION = 0.5;
  // Minimum time between two shots (ms), so holding the key doesn't fire a laser beam.
  static readonly FIRE_COOLDOWN = 120;

  position = 0;
  // -1 (left), 1 (right) or 0 (stop).
  rotateDirection = 0;
  bullets: Bullet[] = [];
  private lastShot = 0;
  // The key that starts the game shouldn't keep firing while it is held.
  private fireKeyArmed = true;

  constructor(readonly canvas: Canvas, readonly turret: Turret, readonly state: GameState, readonly sound: Sound) {
    window.addEventListener('keydown', this.handleKey);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.element.addEventListener('pointerdown', this.handlePointer);
  }

  // Handle aiming and shooting with the keys.
  handleKey = (e: KeyboardEvent): void => {
    if (isTyping() || this.state.paused) return;

    // On the title screen, the overlay handles the keys.
    if (this.state.phase === 'title') {
      this.fireKeyArmed = false;
      return;
    }

    switch (e.code) {
      case 'Space':
      case 'ArrowUp':
        e.preventDefault();
        if (this.fireKeyArmed) {
          this.fire();
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.rotate(-1);
        break;

      case 'ArrowRight':
        e.preventDefault();
        this.rotate(1);
        break;

      case 'ArrowDown':
        e.preventDefault();
        this.rotateDirection = 0;
        break;
    }
  }

  handleKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      this.fireKeyArmed = true;
    }
  }

  // Touch/mouse: tap the left or right third of the screen to aim,
  // the middle to shoot.
  handlePointer = (e: PointerEvent): void => {
    if (this.state.paused || this.state.phase === 'title') return;
    e.preventDefault();
    const rect = this.canvas.element.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    if (relativeX < 1 / 3) {
      this.rotate(-1);
    }
    else if (relativeX > 2 / 3) {
      this.rotate(1);
    }
    else {
      this.fire();
    }
  }

  rotate = (direction: number): void => {
    if (direction * this.position < Barrel.MAX_POSITION) {
      this.rotateDirection = direction;
    }
  }

  // Stops the barrel and shoots.
  fire = (): void => {
    this.rotateDirection = 0;
    if (!this.state.isPlaying) return;

    const now = performance.now();
    if (now - this.lastShot < Barrel.FIRE_COOLDOWN) return;
    this.lastShot = now;

    const bullet = window.game.container.get('bullet');
    bullet.aim(this.position);
    this.bullets.push(bullet);
    this.sound.shoot();
  }

  reset = (): void => {
    this.position = 0;
    this.rotateDirection = 0;
    this.bullets = [];
  }

  run = (): void => {
    // Bullets are drawn first, so they come out from under the barrel.
    this.bullets.forEach((bullet) => bullet.run());
    this.bullets = this.bullets.filter((bullet) => !bullet.isGone);

    if (this.turret.isDestroyed) return;

    this.position += this.rotateDirection * Barrel.ROTATE_SPEED;
    // Stop the barrel rotating too far left or right.
    if (Math.abs(this.position) >= Barrel.MAX_POSITION) {
      this.position = Math.sign(this.position) * Barrel.MAX_POSITION;
      this.rotateDirection = 0;
    }

    const ctx = this.canvas.ctx;
    const { pivotX, pivotY, twh } = this.turret;
    // Barrel width.
    const bw = Math.round(twh / 3);

    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(this.position * Math.PI);
    ctx.fillStyle = Canvas.BLUE;
    ctx.fillRect(-bw / 2, -twh, bw, twh);
    ctx.restore();
  }

}
