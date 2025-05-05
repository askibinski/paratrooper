import Canvas from "./canvas";
import Turret from "./turret";
import Score from "./score";

export default class Bomb {

  static readonly BOMB_WIDTH = 10;
  static readonly BOMB_HEIGHT = 15;
  static readonly BOMB_SPEED = 5;
  static readonly BOMB_SCORE = 3;
  static readonly SCALE = 3.0; // Match with aircraft scale for consistency

  bombX: number;
  bombY: number;
  isGone: boolean;
  explosionFrame: number;
  isExploding: boolean;

  constructor(readonly canvas: Canvas, readonly turret: Turret, readonly score: Score, startX: number, startY: number) {
    this.bombX = startX;
    this.bombY = startY;
    this.isGone = false;
    this.explosionFrame = 0;
    this.isExploding = false;
  }

  draw = (): void => {
    if (this.isExploding) {
      this.drawExplosion();
      return;
    }

    // Enable crisp pixel rendering
    this.canvas.ctx.imageSmoothingEnabled = false;

    // Draw pixelated bomb (2x3 pixels, scaled up)
    this.canvas.ctx.fillStyle = Canvas.RED;
    this.canvas.ctx.fillRect(
      Math.floor(this.bombX - 1 * Bomb.SCALE), 
      Math.floor(this.bombY), 
      2 * Bomb.SCALE, 
      3 * Bomb.SCALE
    );

    // Draw fuse/tail (single yellow pixel, scaled up)
    this.canvas.ctx.fillStyle = Canvas.YELLOW;
    this.canvas.ctx.fillRect(
      Math.floor(this.bombX - 1 * Bomb.SCALE), 
      Math.floor(this.bombY - 1 * Bomb.SCALE), 
      1 * Bomb.SCALE, 
      1 * Bomb.SCALE
    );

    // Make the bomb fall
    this.bombY = this.bombY + Bomb.BOMB_SPEED;

    // Check if bomb hit ground or turret
    if (this.hitTurret()) {
      this.isExploding = true;
      // Notify turret was hit
      this.turret.wasHit();
    } else if (this.bombY > this.canvas.height) {
      this.isGone = true;
    }
  }

  drawExplosion = (): void => {
    // Enable crisp pixel rendering
    this.canvas.ctx.imageSmoothingEnabled = false;
    
    // Use alternating frames for simple animation effect
    const frame = Math.floor(this.explosionFrame / 2) % 2;
    
    // Draw pixelated explosion
    if (frame === 0) {
      // First explosion frame - small + pattern (scaled up)
      this.canvas.ctx.fillStyle = Canvas.YELLOW;
      this.canvas.ctx.fillRect(
        Math.floor(this.bombX - 2 * Bomb.SCALE), 
        Math.floor(this.bombY), 
        4 * Bomb.SCALE, 
        1 * Bomb.SCALE
      );
      this.canvas.ctx.fillRect(
        Math.floor(this.bombX), 
        Math.floor(this.bombY - 2 * Bomb.SCALE), 
        1 * Bomb.SCALE, 
        4 * Bomb.SCALE
      );
      
      this.canvas.ctx.fillStyle = Canvas.ORANGE;
      this.canvas.ctx.fillRect(
        Math.floor(this.bombX - 1 * Bomb.SCALE), 
        Math.floor(this.bombY - 1 * Bomb.SCALE), 
        2 * Bomb.SCALE, 
        2 * Bomb.SCALE
      );
    } else {
      // Second explosion frame - larger + pattern (scaled up)
      this.canvas.ctx.fillStyle = Canvas.RED;
      this.canvas.ctx.fillRect(
        Math.floor(this.bombX - 3 * Bomb.SCALE), 
        Math.floor(this.bombY), 
        6 * Bomb.SCALE, 
        1 * Bomb.SCALE
      );
      this.canvas.ctx.fillRect(
        Math.floor(this.bombX), 
        Math.floor(this.bombY - 3 * Bomb.SCALE), 
        1 * Bomb.SCALE, 
        6 * Bomb.SCALE
      );
      
      this.canvas.ctx.fillStyle = Canvas.ORANGE;
      this.canvas.ctx.fillRect(
        Math.floor(this.bombX - 2 * Bomb.SCALE), 
        Math.floor(this.bombY - 1 * Bomb.SCALE), 
        4 * Bomb.SCALE, 
        2 * Bomb.SCALE
      );
      this.canvas.ctx.fillRect(
        Math.floor(this.bombX - 1 * Bomb.SCALE), 
        Math.floor(this.bombY - 2 * Bomb.SCALE), 
        2 * Bomb.SCALE, 
        4 * Bomb.SCALE
      );
    }
    
    this.explosionFrame++;
    
    // After explosion animation is complete, remove the bomb
    if (this.explosionFrame > 10) {
      this.isGone = true;
    }
  }

  hitTurret = (): boolean => {
    const turretCenterX = this.canvas.width / 2;
    const turretTopY = this.canvas.height - Turret.BASE_WIDTH_HEIGHT - Turret.SCORE_HEIGHT;
    
    return (this.bombY + (Bomb.BOMB_HEIGHT * Bomb.SCALE) >= turretTopY) && 
           (this.bombX >= turretCenterX - (Turret.BASE_WIDTH_HEIGHT / 2)) && 
           (this.bombX <= turretCenterX + (Turret.BASE_WIDTH_HEIGHT / 2));
  }

  // Check if bullet hit the bomb
  wasHit = (bulletX: number, bulletY: number): boolean => {
    return !this.isExploding && 
           (bulletX >= this.bombX - (Bomb.BOMB_WIDTH * Bomb.SCALE / 2)) && 
           (bulletX <= this.bombX + (Bomb.BOMB_WIDTH * Bomb.SCALE / 2)) && 
           (bulletY >= this.bombY - (Bomb.BOMB_HEIGHT * Bomb.SCALE / 2)) && 
           (bulletY <= this.bombY + (Bomb.BOMB_HEIGHT * Bomb.SCALE / 2));
  }
}