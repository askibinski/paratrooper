import Canvas from "./canvas";
import Turret from "./turret";

export default class Aircraft {

  static readonly SCALE = 20.0;  // Scaling for proper visibility
  static readonly LINE_THICKNESS = 0.5;  // Thickness ratio for lines
  static readonly AIRCRAFT_SPEED = 7;
  static readonly AIRCRAFT_START_CANVAS_OFFSET = 100;
  static readonly AIRCRAFT_LENGTH = 25;  // Base length of aircraft
  static readonly AIRCRAFT_HEIGHT = 8;   // Base height of aircraft
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
    // of the falling parts in a random way, just like in the helicopter.
    // We need exactly 7 multipliers for our 7 aircraft parts
    this.multipliers = [0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.05];
    this.explodeRotateDirections = [-1, -1, -1, 1, 1, 1, 1];
    this.multipliers = this.canvas.shuffle(this.multipliers);
    this.explodeRotateDirections = this.canvas.shuffle(this.explodeRotateDirections);
  }

  set toggle(direction: number) {
    this.direction = direction;
    this.startX = (direction === -1) ? - Aircraft.AIRCRAFT_START_CANVAS_OFFSET : this.canvas.width + Aircraft.AIRCRAFT_START_CANVAS_OFFSET;
    this.collisionWidth = this.direction * Aircraft.AIRCRAFT_LENGTH;
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

  // Draw aircraft parts with separate paths and fills, similar to heli.ts
  drawItemPart = (name: string, x: number, y: number, centerX: number, centerY: number) => {
    // Enable crisp pixel rendering
    this.canvas.ctx.imageSmoothingEnabled = false;
    
    switch (name) {
      case 'aircraft-body':
        // Bottom horizontal line (cyan) - matches original pixel art
        this.canvas.ctx.fillStyle = Canvas.CYAN;
        
        // Draw the bottom horizontal line (9 pixels wide)
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 2),
          y,
          Aircraft.SCALE * 9,
          Aircraft.SCALE * Aircraft.LINE_THICKNESS
        );
        break;
        
      case 'aircraft-body-outline':
        // Upper diagonal line (cyan) from nose to middle
        this.canvas.ctx.fillStyle = Canvas.CYAN;
        
        // Diagonal line from nose to middle (3 pixels)
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 2),
          y - (Aircraft.SCALE * 1),
          Aircraft.SCALE * 1,
          Aircraft.SCALE * Aircraft.LINE_THICKNESS
        );
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 3),
          y - (Aircraft.SCALE * 2),
          Aircraft.SCALE * 1,
          Aircraft.SCALE * Aircraft.LINE_THICKNESS
        );
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 4),
          y - (Aircraft.SCALE * 2),
          Aircraft.SCALE * 1,
          Aircraft.SCALE * Aircraft.LINE_THICKNESS
        );
        break;
        
      case 'aircraft-window':
        // Cockpit/window (white pixel)
        this.canvas.ctx.fillStyle = Canvas.WHITE;
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 5),
          y - (Aircraft.SCALE * 1),
          Aircraft.SCALE * 1,
          Aircraft.SCALE * 1
        );
        break;
        
      case 'aircraft-wing':
        // Upper horizontal line (cyan) connecting to tail
        this.canvas.ctx.fillStyle = Canvas.CYAN;
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 6),
          y - (Aircraft.SCALE * 2),
          Aircraft.SCALE * 5,
          Aircraft.SCALE * Aircraft.LINE_THICKNESS
        );
        break;
        
      case 'aircraft-wing-outline':
        // Connect the nose to the bottom
        this.canvas.ctx.fillStyle = Canvas.CYAN;
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 2),
          y - (Aircraft.SCALE * 1),
          Aircraft.SCALE * Aircraft.LINE_THICKNESS,
          Aircraft.SCALE * 1
        );
        break;
        
      case 'aircraft-tail':
        // Vertical stabilizer (cyan)
        this.canvas.ctx.fillStyle = Canvas.CYAN;
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 9),
          y - (Aircraft.SCALE * 3),
          Aircraft.SCALE * 2,
          Aircraft.SCALE * Aircraft.LINE_THICKNESS
        );
        break;
        
      case 'aircraft-tail-outline':
        // Connect the tail to the body
        this.canvas.ctx.fillStyle = Canvas.CYAN;
        this.canvas.ctx.fillRect(
          x + (Aircraft.SCALE * 10),
          y - (Aircraft.SCALE * 1),
          Aircraft.SCALE * Aircraft.LINE_THICKNESS,
          Aircraft.SCALE * 1
        );
        break;
        
        }

    // Check if aircraft is off screen (for cleanup)
    if (y > (2 * this.canvas.height)) {
      this.isGone = true;
    }
  }

  // Used for the translate back and forth in case of exploding.
  // Helper method to draw scaled pixel rectangles
  drawPixelRect = (x: number, y: number, width: number, height: number): void => {
    // Scale up the pixels while maintaining pixelated look
    this.canvas.ctx.fillRect(
      Math.floor(x), 
      Math.floor(y), 
      width * Aircraft.SCALE, 
      height * Aircraft.SCALE
    );
  }

  // Used for explosion animations
  getItemPartCenter = (name: string, x: number, y: number): { centerX: number, centerY: number } => {
    switch (name) {
      case 'aircraft-body':
        return {
          centerX: x + (Aircraft.SCALE * 6),
          centerY: y + (Aircraft.SCALE * 0.5),
        };
      case 'aircraft-body-outline':
        return {
          centerX: x + (Aircraft.SCALE * 6),
          centerY: y,
        };
      case 'aircraft-window':
        return {
          centerX: x + (Aircraft.SCALE * 6),
          centerY: y - (Aircraft.SCALE * 0.5),
        };
      case 'aircraft-wing':
        return {
          centerX: x + (Aircraft.SCALE * 6),
          centerY: y - (Aircraft.SCALE * 1),
        };
      case 'aircraft-wing-outline':
        return {
          centerX: x + (Aircraft.SCALE * 6),
          centerY: y - (Aircraft.SCALE * 1),
        };
      case 'aircraft-tail':
        return {
          centerX: x + (Aircraft.SCALE * 9),
          centerY: y - (Aircraft.SCALE * 1),
        };
      case 'aircraft-tail-outline':
        return {
          centerX: x + (Aircraft.SCALE * 9),
          centerY: y - (Aircraft.SCALE * 1),
        };
      default:
        return {
          centerX: x + (Aircraft.SCALE * 6),
          centerY: y,
        };
    }
  }

  isDebugMode: boolean = false;

  draw = (): void => {
    this.frame++;

    // Each framerun, check if we should drop a bomb
    if (this.isOverTurret() && !this.bombDropped && !this.isDebugMode) {
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

    // Draw all aircraft parts (like the heli, with separate paths)
    // Even when exploding, draw the same parts - they will be transformed by the drawItem function
    this.drawItem('aircraft-body', 0);
    this.drawItem('aircraft-body-outline', 1);
    this.drawItem('aircraft-window', 2);
    this.drawItem('aircraft-wing', 3);
    this.drawItem('aircraft-wing-outline', 4);
    this.drawItem('aircraft-tail', 5);
    this.drawItem('aircraft-tail-outline', 6);

    // The second restore for the mirroring.
    this.canvas.ctx.restore();

    // Make the aircraft fly! (but not in debug mode)
    if (!this.isDebugMode) {
      this.startX = this.startX - (this.direction * Aircraft.AIRCRAFT_SPEED);

      if (this.wentOffCanvas()) {
        this.isGone = true;
      }
    }
  }

  // Check if the aircraft flew over and went off canvas.
  wentOffCanvas = (): boolean => {
    return ((this.startX > (this.canvas.width + Aircraft.AIRCRAFT_START_CANVAS_OFFSET)) || 
            (this.startX < (-Aircraft.AIRCRAFT_START_CANVAS_OFFSET)));
  }
}