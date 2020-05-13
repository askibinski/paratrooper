import Canvas from "./canvas.js";
import Turret from "./turret.js";
import Bullet from "./bullet.js";
import FlightController from "./flight-controller.js";
import Score from "./score.js";

export default class Barrel {

  ROTATE_SPEED = 0.01;

  canvas: Canvas;
  turret: Turret;
  flightController: FlightController;
  score: Score;
  barrelPosition: number;
  rotateDirection: number;
  bullets: Bullet[];

  constructor(canvas: Canvas, turret: Turret, flightController: FlightController, score: Score) {
    this.canvas = canvas;
    this.turret = turret;
    this.flightController = flightController;
    this.score = score;
    this.barrelPosition = 0;
    this.rotateDirection = 0;
    this.bullets = [];

    window.addEventListener('keydown', this.handleKey);
  }

  // Handle aiming and shooting with the keys.
  handleKey = (e: KeyboardEvent) => {
    if (e.key.includes('Arrow')) {
      switch (e.key) {
        case 'ArrowUp':
          // Stops the barrel and shoots.
          this.rotateDirection = 0;
          // Create a bullet (shoot).
          this.bullets.push(new Bullet(this.canvas, this.turret, this.barrelPosition, this.flightController, this.score));
          break;

        case 'ArrowLeft':
          if (this.barrelPosition > -0.50) {
            this.rotateDirection = -1;
          }
          break;

        case 'ArrowRight':
          if (this.barrelPosition < 0.50) {
            this.rotateDirection = 1;
          }
          break;

        default:
          break;

      }
      e.preventDefault();
    }
  }

  draw = () => {
    // Animate the bullets.
    this.bullets.forEach((bullet, index) => {
      // If the bullet went off canvas the reference can  be removed and 
      // javascript will automatically reclaim memory.
      if (bullet.isGone) {
        this.bullets.splice(index, 1);
        return;
      }
      bullet.draw();
    });

    // Save the state, keeping it clean.
    this.canvas.ctx.save();
    // Rotate takes -1 (left), 1 (right) or 0 (stop) as rotating direction.
    this.barrelPosition = this.barrelPosition + (this.rotateDirection * this.ROTATE_SPEED);
    this.canvas.ctx.translate(this.canvas.width / 2, (this.canvas.height - this.turret.BASE_WIDTH_HEIGHT - this.turret.twh - this.turret.SCORE_HEIGHT));
    this.canvas.ctx.rotate(this.barrelPosition * Math.PI);
    this.canvas.ctx.translate(-this.canvas.width / 2, -(this.canvas.height - this.turret.BASE_WIDTH_HEIGHT - this.turret.twh - this.turret.SCORE_HEIGHT));
    // Stop the barrel rotating too far left or right.
    if (this.rotateDirection && (this.barrelPosition <= -0.5 || this.barrelPosition >= 0.5)) {
      this.barrelPosition = (this.rotateDirection * 0.5);
      this.rotateDirection = 0;
    }
    // This is the actual drawing of the barrel.
    this.canvas.ctx.fillStyle = this.canvas.BLUE;
    this.canvas.ctx.beginPath();
    // Barrel width.
    const bw = Math.round(this.turret.twh / 3);
    this.canvas.ctx.rect((this.canvas.width / 2 - Math.round(bw) / 2), (this.canvas.height - this.turret.BASE_WIDTH_HEIGHT - (this.turret.twh * 2) - this.turret.SCORE_HEIGHT), bw, this.turret.twh);
    this.canvas.ctx.fill();
    this.canvas.ctx.restore();
  }

}