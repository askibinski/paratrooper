import Canvas from "./canvas";
import Turret from "./turret";
import Score from "./score";

export default class Bomb {

  static readonly BOMB_WIDTH = 10;
  static readonly BOMB_HEIGHT = 15;
  static readonly BOMB_SPEED = 5;
  static readonly BOMB_SCORE = 3;

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

    // Draw bomb
    this.canvas.ctx.fillStyle = Canvas.RED;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(this.bombX - (Bomb.BOMB_WIDTH / 2), this.bombY, Bomb.BOMB_WIDTH, Bomb.BOMB_HEIGHT);
    this.canvas.ctx.fill();

    // Draw fuse/tail
    this.canvas.ctx.strokeStyle = Canvas.YELLOW;
    this.canvas.ctx.lineWidth = 2;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.bombX, this.bombY);
    this.canvas.ctx.lineTo(this.bombX, this.bombY - 10);
    this.canvas.ctx.stroke();

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
    const explosionRadius = this.explosionFrame * 3;
    
    // Draw explosion circle
    this.canvas.ctx.fillStyle = Canvas.ORANGE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.bombX, this.bombY, explosionRadius, 0, 2 * Math.PI);
    this.canvas.ctx.fill();
    
    // Draw explosion outline
    this.canvas.ctx.strokeStyle = Canvas.RED;
    this.canvas.ctx.lineWidth = 2;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.bombX, this.bombY, explosionRadius, 0, 2 * Math.PI);
    this.canvas.ctx.stroke();
    
    this.explosionFrame++;
    
    // After explosion animation is complete, remove the bomb
    if (this.explosionFrame > 10) {
      this.isGone = true;
    }
  }

  hitTurret = (): boolean => {
    const turretCenterX = this.canvas.width / 2;
    const turretTopY = this.canvas.height - Turret.BASE_WIDTH_HEIGHT - Turret.SCORE_HEIGHT;
    
    return (this.bombY + Bomb.BOMB_HEIGHT >= turretTopY) && 
           (this.bombX >= turretCenterX - (Turret.BASE_WIDTH_HEIGHT / 2)) && 
           (this.bombX <= turretCenterX + (Turret.BASE_WIDTH_HEIGHT / 2));
  }

  // Check if bullet hit the bomb
  wasHit = (bulletX: number, bulletY: number): boolean => {
    return !this.isExploding && 
           (bulletX >= this.bombX - Bomb.BOMB_WIDTH) && 
           (bulletX <= this.bombX + Bomb.BOMB_WIDTH) && 
           (bulletY >= this.bombY - Bomb.BOMB_HEIGHT) && 
           (bulletY <= this.bombY + Bomb.BOMB_HEIGHT);
  }
}