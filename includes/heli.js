export default class Heli {

  SCALE = 0.36;
  ROTOR_BLADE_MAX_LENGTH = 130;
  ROTOR_SPEED = 20;
  HELI_SPEED = 5;
  HELI_START_CANVAS_OFFSET = 100;
  HELI_TAIL_LENGTH = 180;

  // If you look at the original game, I think helis from the right always
  // fly above the helis from the left (they never use the same height).
  constructor(canvas, direction, height) {
    this.canvas = canvas;
    this.heliDirection = direction;
    this.startX = direction === -1 ? -this.HELI_START_CANVAS_OFFSET : this.canvas.width + this.HELI_START_CANVAS_OFFSET;
    this.startY = height;
    this.rotorBladeLength = 0;
    this.rotorBladeDirection = -1;
    this.tailRotation = 0;
    // Used for easier collision detecting.
    this.collionWidth = direction * Math.round(this.SCALE * this.HELI_TAIL_LENGTH);
    this.isExploding = false;
    this.frame = 0;
    this.frameSinceExplosion = 0;
    this.isGone = false;
    // "explode" multiplyers.
    this.multiplyers = [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4];
    this.multiplyers = this.canvas.shuffle(this.multiplyers);
  }

  draw = () => {
    this.frame++;

    // This is a trick to use the frames since explosion for altering the
    // positions of the exploding parts. We only use half the frames (even
    // numbers) otherwise the animation is too fast.
    if (this.isExploding && this.frame % 2 == 0) {
      this.frameSinceExplosion++;
    } 

    // Mirror the heli around the y-axis (for helis coming from the left).
    this.canvas.ctx.save();

    if (this.heliDirection === -1) {
      this.canvas.ctx.translate(this.startX, this.startY);
      this.canvas.ctx.scale(-1, 1);
      this.canvas.ctx.translate(-this.startX, -this.startY);
    }

    // Tail, long part.
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[0]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[0]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * (150 + (this.HELI_TAIL_LENGTH / 2))),  y - (this.SCALE * 15));
        this.canvas.ctx.rotate(-this.tailRotation / 2 * Math.PI);
        this.canvas.ctx.translate(-x + -(this.SCALE * (150 + (this.HELI_TAIL_LENGTH / 2))), -(y - (this.SCALE * 15)));
      }
      this.canvas.ctx.strokeStyle = this.canvas.WHITE;
      this.canvas.ctx.lineWidth = (this.SCALE * 15);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x + (this.SCALE * 150), y - (this.SCALE * 15));
      this.canvas.ctx.lineTo(x + (this.SCALE * (150 + this.HELI_TAIL_LENGTH)), y - (this.SCALE * 15));
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Tail short part below.
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[1]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[1]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 210), y);
        this.canvas.ctx.rotate(this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 210)), -y);
      }
      this.canvas.ctx.strokeStyle = this.canvas.WHITE;
      this.canvas.ctx.lineWidth = (this.SCALE * 20);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x + (this.SCALE * 150), y);
      this.canvas.ctx.lineTo(x + (this.SCALE * 270), y);
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Heli body, background color.
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[2]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[2]);
      this.canvas.ctx.fillStyle = this.canvas.BLACK;
      this.canvas.ctx.lineWidth = (this.SCALE * 10);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x, this.startY);
      this.canvas.ctx.lineTo(x + (this.SCALE * 50), y - (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 150), y - (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 200), y);
      this.canvas.ctx.lineTo(x + (this.SCALE * 150), y + (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 50), y + (this.SCALE * 50));
      this.canvas.ctx.lineTo(x, y);
      this.canvas.ctx.closePath();
      this.canvas.ctx.fill();
    }

    // Heli body, stroke.
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[2]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[2]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 100), y);
        this.canvas.ctx.rotate(this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 100)), -y);
      }
      this.canvas.ctx.strokeStyle = this.canvas.WHITE;
      this.canvas.ctx.lineWidth = (this.SCALE * 10);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x, y);
      this.canvas.ctx.lineTo(x + (this.SCALE * 50), y - (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 150), y - (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 200), y);
      this.canvas.ctx.lineTo(x + (this.SCALE * 150), y + (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 50), y + (this.SCALE * 50));
      this.canvas.ctx.lineTo(x, y);
      this.canvas.ctx.closePath();
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Heli body "window".
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[3]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[3]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 62.5), y - (this.SCALE * 25));
        this.canvas.ctx.rotate(this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 62.5)), -(y - (this.SCALE * 25)));
      }
      this.canvas.ctx.fillStyle = this.canvas.WHITE;
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x, y);
      this.canvas.ctx.lineTo(x + (this.SCALE * 50), y - (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 125), y - (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 75), y);
      this.canvas.ctx.moveTo(x, y);
      this.canvas.ctx.lineTo(x, y);
      this.canvas.ctx.closePath();
      this.canvas.ctx.fill();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Rotor connection.
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[0]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[0]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 100), y - (this.SCALE * 65));
        this.canvas.ctx.rotate(this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 100)), -(y - (this.SCALE * 65)));
      }
      this.canvas.ctx.strokeStyle = this.canvas.WHITE;
      this.canvas.ctx.lineWidth = (this.SCALE * 15);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x + (this.SCALE * 100), y - (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 100), y - (this.SCALE * 80));
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Top rotor (left).
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[5]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[5]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 100), y - (this.SCALE * 80));
        this.canvas.ctx.rotate(-this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 100)), -(y - (this.SCALE * 80)));
      }
      this.canvas.ctx.strokeStyle = this.canvas.PINK;
      this.canvas.ctx.lineWidth = (this.SCALE * 15);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x + (this.SCALE * 100), y - (this.SCALE * 80));
      this.canvas.ctx.lineTo(x + ((this.SCALE * 100) - (this.SCALE * this.rotorBladeLength)), y - (this.SCALE * 80));
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Top rotor (right).
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[5]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[5]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 100), y - (this.SCALE * 80));
        this.canvas.ctx.rotate(-this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 100)), -(y - (this.SCALE * 80)));
      }
      this.canvas.ctx.strokeStyle = this.canvas.PINK;
      this.canvas.ctx.lineWidth = (this.SCALE * 15);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x + (this.SCALE * 100), y - (this.SCALE * 80));
      this.canvas.ctx.lineTo(x + ((this.SCALE * 100) + (this.SCALE * this.rotorBladeLength)), y - (this.SCALE * 80));
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Visually, this gives the impression of rotating blades, because our brain want to believe.
    this.rotorBladeLength = this.rotorBladeLength + (this.rotorBladeDirection * this.ROTOR_SPEED);
    if (this.rotorBladeLength < 0 || this.rotorBladeLength > this.ROTOR_BLADE_MAX_LENGTH) {
      this.rotorBladeDirection = -1 * this.rotorBladeDirection;
    }

    // Landing gear left connection.
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[6]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[6]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 50), y + (this.SCALE * 67.5));
        this.canvas.ctx.rotate(-this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 50)), -(y + (this.SCALE * 67.5)));
      }
      this.canvas.ctx.strokeStyle = this.canvas.WHITE;
      this.canvas.ctx.lineWidth = (this.SCALE * 15);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x + (this.SCALE * 50), y + (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 50), y + (this.SCALE * 85));
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Landing gear right connection.
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[7]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[7]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 150), y + (this.SCALE * 76.5));
        this.canvas.ctx.rotate(this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 150)), -(y + (this.SCALE * 76.5)));
      }
      this.canvas.ctx.strokeStyle = this.canvas.WHITE;
      this.canvas.ctx.lineWidth = (this.SCALE * 15);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.lineTo(x + (this.SCALE * 150), y + (this.SCALE * 50));
      this.canvas.ctx.lineTo(x + (this.SCALE * 150), y + (this.SCALE * 85));
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Landing gear bar.
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[8]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[8]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 105), y + (this.SCALE * 85));
        this.canvas.ctx.rotate(this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 105)), -(y + (this.SCALE * 85)));
      }
      this.canvas.ctx.strokeStyle = this.canvas.BLUE;
      this.canvas.ctx.lineWidth = (this.SCALE * 10);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x - (this.SCALE * 20), y + (this.SCALE * 65));
      this.canvas.ctx.lineTo(x, y + (this.SCALE * 85));
      this.canvas.ctx.lineTo(x + (this.SCALE * 210), y + (this.SCALE * 85));
      this.canvas.ctx.stroke();
      if (this.isExploding) {
        this.canvas.ctx.restore();
      }
    }

    // Tail rotor (rotating).
    {
      let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multiplyers[4]);
      let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multiplyers[4]);
      if (this.isExploding) {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 330), y - ((this.SCALE * 15)));
        this.canvas.ctx.rotate(this.tailRotation/2 * Math.PI);
        this.canvas.ctx.translate(-(x + (this.SCALE * 330)), -(y - ((this.SCALE * 15))));
      } 
      else {
        this.canvas.ctx.save();
        this.canvas.ctx.translate(x + (this.SCALE * 330), y - (this.SCALE * 15));
        this.canvas.ctx.rotate(this.tailRotation * Math.PI);
        this.canvas.ctx.translate(-1 * (x + (this.SCALE * 330)), -1 * (y - (this.SCALE * 15)));
      }
      this.canvas.ctx.strokeStyle = this.canvas.PINK;
      this.canvas.ctx.lineWidth = (this.SCALE * 15);
      this.canvas.ctx.beginPath();
      this.canvas.ctx.moveTo(x + (this.SCALE * 330), y - ((this.SCALE * 15) - (this.SCALE * 25)));
      this.canvas.ctx.lineTo(x + (this.SCALE * 330), y - ((this.SCALE * 15) + (this.SCALE * 25)));
      this.canvas.ctx.stroke();
      this.tailRotation = this.tailRotation + 0.1;
      this.canvas.ctx.restore();

      // @TODO this is a weak way to make sure all the falling parts from the explosion
      // are off-canvas so we can remove the heli in flight controller.
      if (y > (2 * this.canvas.height)) {
        this.isGone = true;
      }
    }

    // Hit X range (debug)
    // this.canvas.ctx.strokeStyle = '#FF0000';
    // this.canvas.ctx.lineWidth = (this.SCALE * 15);
    // this.canvas.ctx.beginPath();
    // this.canvas.ctx.moveTo(this.startX, this.startY);
    // this.canvas.ctx.lineTo(this.startX + (this.SCALE * (2 * this.HELI_TAIL_LENGTH)), this.startY);
    // this.canvas.ctx.stroke();

    // The second restore for the mirroring.
    this.canvas.ctx.restore();

    // Make the whole thing fly!
    this.startX = this.startX - (this.heliDirection * this.HELI_SPEED);

    if (this.wentOffCanvas()) {
      this.isGone = true;
    }
  }

  // Check if the heli flied over and went off canvas.
  wentOffCanvas = () => {
    return ((this.startX > (this.canvas.width + this.HELI_START_CANVAS_OFFSET)) || (this.startX < (-this.HELI_START_CANVAS_OFFSET)));
  }

}