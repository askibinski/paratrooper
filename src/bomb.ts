import Canvas from "./canvas";
import Turret from "./turret";
import Score from "./score";

export default class Bomb {
  static readonly BOMB_SCORE = 3;
  static readonly BOMB_SIZE = 15; // Large enough to be visible but not too big
  static readonly GRAVITY = 0.15;  // Gravity acceleration
  static readonly DRAG = 0.01;    // Air resistance
  
  // Position
  bombX: number;
  bombY: number;
  
  // Velocity
  velocityX: number;
  velocityY: number;
  
  // State
  isGone: boolean;
  isExploding: boolean;
  explosionFrame: number;
  
  // For debugging
  frameCount: number;

  constructor(readonly canvas: Canvas, readonly turret: Turret, readonly score: Score) {
    console.log("Bomb constructor called");
    this.bombX = 0;
    this.bombY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isGone = false;
    this.isExploding = false;
    this.explosionFrame = 0;
    this.frameCount = 0;
  }

  initialize(x: number, y: number, direction: number, speed: number): void {
    console.log("Initializing bomb with", x, y, direction, speed);
    
    // Initial position (just below the aircraft)
    this.bombX = x;
    this.bombY = y + 10;
    
    // Initial velocity - same horizontal speed as aircraft
    this.velocityX = direction * speed;
    
    // No initial vertical velocity
    this.velocityY = 0;
    
    // Reset states
    this.isGone = false;
    this.isExploding = false;
    this.explosionFrame = 0;
    this.frameCount = 0;
    
    console.log("Bomb initialized at", this.bombX, this.bombY, "with velocityX:", this.velocityX);
  }

  draw = (): void => {
    // Increment frame counter
    this.frameCount++;
    
    if (this.isExploding) {
      this.drawExplosion();
      return;
    }

    // Draw a white circle for the bomb
    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(
      this.bombX, 
      this.bombY,
      Bomb.BOMB_SIZE,
      0, 
      2 * Math.PI
    );
    this.canvas.ctx.fill();
    
    // Apply gravity to increase vertical velocity
    this.velocityY += Bomb.GRAVITY;
    
    // Apply drag to reduce horizontal velocity
    this.velocityX = this.velocityX * (1 - Bomb.DRAG);
    
    // Update position based on velocity
    this.bombX += this.velocityX;
    this.bombY += this.velocityY;
    
    // Log position every 10 frames
    if (this.frameCount % 10 === 0) {
      console.log("Bomb position:", this.bombX.toFixed(1), this.bombY.toFixed(1), 
                 "Velocity:", this.velocityX.toFixed(1), this.velocityY.toFixed(1));
    }

    // Get turret position
    const targetY = this.canvas.height - Turret.BASE_WIDTH_HEIGHT - Turret.SCORE_HEIGHT;
    const centerX = this.canvas.width / 2;
    
    // Check if bomb hit turret (very generous bounds)
    if (this.bombY >= targetY - 40 && 
        Math.abs(this.bombX - centerX) < Turret.BASE_WIDTH_HEIGHT) {
      console.log("BOMB HIT TURRET!");
      this.isExploding = true;
      this.turret.wasHit();
    } 
    // Check if off screen - only remove if it's far off screen
    else if (this.bombY > this.canvas.height + 100 || 
             this.bombX < -100 || 
             this.bombX > this.canvas.width + 100) {
      console.log("Bomb went far offscreen");
      this.isGone = true;
    }
  }

  drawExplosion = (): void => {
    console.log("Drawing explosion at", this.bombX, this.bombY);
    
    // Alternate between two explosion frames
    const size = (this.explosionFrame % 2 === 0) ? 30 : 40;
    
    // Draw a large orange/yellow explosion
    this.canvas.ctx.fillStyle = (this.explosionFrame % 2 === 0) ? '#FFA500' : '#FFFF00';
    this.canvas.ctx.fillRect(
      this.bombX - size/2,
      this.bombY - size/2,
      size,
      size
    );
    
    this.explosionFrame++;
    
    // After explosion animation is complete, remove the bomb
    if (this.explosionFrame > 10) {
      this.isGone = true;
    }
  }
  
  // Check if bullet hit the bomb
  wasHit = (bulletX: number, bulletY: number): boolean => {
    // Simple square collision detection
    return !this.isExploding && 
           Math.abs(bulletX - this.bombX) < Bomb.BOMB_SIZE/2 &&
           Math.abs(bulletY - this.bombY) < Bomb.BOMB_SIZE/2;
  }

  hitTurret = (): boolean => {
    const turretCenterX = this.canvas.width / 2;
    const turretTopY = this.canvas.height - Turret.BASE_WIDTH_HEIGHT - Turret.SCORE_HEIGHT;
    
    // Wider collision check to ensure bombs hit the turret base
    return (this.bombY + Bomb.BOMB_SIZE/2 >= turretTopY) && 
           Math.abs(this.bombX - turretCenterX) < Turret.BASE_WIDTH_HEIGHT * 0.9;
  }
}