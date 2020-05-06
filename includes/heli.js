export default class Heli {

  SCALE = 0.36;
  ROTOR_BLADE_MAX_LENGTH = 130;
  ROTOR_SPEED = 20;

  constructor(canvas) {
    this.canvas = canvas;
    this.startX = 200;
    this.startY = 1167;
    this.rotorBladeLength = 0;
    this.rotorBladeDirection = -1;
    this.tailRotation = 0;
  }

  draw = () => {
    // Tail, long part.
    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
    this.canvas.ctx.lineWidth = (this.SCALE * 15);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX + (this.SCALE * 150), this.startY - (this.SCALE * 15));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 330), this.startY - (this.SCALE * 15));
    this.canvas.ctx.stroke();

    // Tail short part below.
    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
    this.canvas.ctx.lineWidth = (this.SCALE * 20);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX + (this.SCALE * 150), this.startY);
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 270), this.startY);
    this.canvas.ctx.stroke();

    // Heli body, background color.
    this.canvas.ctx.fillStyle = this.canvas.BLACK;
    this.canvas.ctx.lineWidth = (this.SCALE * 10);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX, this.startY);
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 50), this.startY - (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 150), this.startY - (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 200), this.startY);
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 150), this.startY + (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 50), this.startY + (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX, this.startY);
    this.canvas.ctx.closePath();
    this.canvas.ctx.fill();

    // Heli body, stroke.
    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
    this.canvas.ctx.lineWidth = (this.SCALE * 10);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX, this.startY);
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 50), this.startY - (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 150), this.startY - (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 200), this.startY);
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 150), this.startY + (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 50), this.startY + (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX, this.startY);
    this.canvas.ctx.closePath();
    this.canvas.ctx.stroke();

    // Heli body "window".
    this.canvas.ctx.fillStyle = this.canvas.WHITE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX, this.startY);
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 50), this.startY - (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 125), this.startY - (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 75), this.startY);
    this.canvas.ctx.moveTo(this.startX, this.startY);
    this.canvas.ctx.lineTo(this.startX, this.startY);
    this.canvas.ctx.closePath();
    this.canvas.ctx.fill();

    // Rotor connection.
    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
    this.canvas.ctx.lineWidth = (this.SCALE * 15);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX + (this.SCALE * 100), this.startY - (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 100), this.startY - (this.SCALE * 80));
    this.canvas.ctx.stroke();

    // Top rotor (left).
    this.canvas.ctx.strokeStyle = this.canvas.PINK;
    this.canvas.ctx.lineWidth = (this.SCALE * 15);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX + (this.SCALE * 100), this.startY - (this.SCALE * 80));
    this.canvas.ctx.lineTo(this.startX + ((this.SCALE * 100) - (this.SCALE * this.rotorBladeLength)), this.startY - (this.SCALE * 80));
    this.canvas.ctx.stroke();

    // Top rotor (right).
    this.canvas.ctx.strokeStyle = this.canvas.PINK;
    this.canvas.ctx.lineWidth = (this.SCALE * 15);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX + (this.SCALE * 100), this.startY - (this.SCALE * 80));
    this.canvas.ctx.lineTo(this.startX + ((this.SCALE * 100) + (this.SCALE * this.rotorBladeLength)), this.startY - (this.SCALE * 80));
    this.canvas.ctx.stroke();

    // Visually, this gives the impression of rotating blades, because our brain want to believe.
    this.rotorBladeLength = this.rotorBladeLength + (this.rotorBladeDirection * this.ROTOR_SPEED);
    if (this.rotorBladeLength < 0 || this.rotorBladeLength > this.ROTOR_BLADE_MAX_LENGTH) {
      this.rotorBladeDirection = -1 * this.rotorBladeDirection;
    }

    // Landing gear left connection.
    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
    this.canvas.ctx.lineWidth = (this.SCALE * 15);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX + (this.SCALE * 50), this.startY + (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 50), this.startY + (this.SCALE * 85));
    this.canvas.ctx.stroke();

    // Landing gear right connection.
    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
    this.canvas.ctx.lineWidth = (this.SCALE * 15);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 150), this.startY + (this.SCALE * 50));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 150), this.startY + (this.SCALE * 85));
    this.canvas.ctx.stroke();

    // Landing gear bar.
    this.canvas.ctx.strokeStyle = this.canvas.BLUE;
    this.canvas.ctx.lineWidth = (this.SCALE * 10);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX - (this.SCALE * 20), this.startY + (this.SCALE * 65));
    this.canvas.ctx.lineTo(this.startX, this.startY + (this.SCALE * 85));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 210), this.startY + (this.SCALE * 85));
    this.canvas.ctx.stroke();

    // Tail rotor (rotating).
    this.canvas.ctx.save();
    this.canvas.ctx.translate(this.startX + (this.SCALE * 330), this.startY - (this.SCALE * 15));
    this.canvas.ctx.rotate(this.tailRotation * Math.PI);
    this.canvas.ctx.translate(-1 * (this.startX + (this.SCALE * 330)), -1 * (this.startY - (this.SCALE * 15)));
    this.canvas.ctx.strokeStyle = this.canvas.PINK;
    this.canvas.ctx.lineWidth = (this.SCALE * 15);
    this.canvas.ctx.beginPath();
    this.canvas.ctx.moveTo(this.startX + (this.SCALE * 330), this.startY - ((this.SCALE * 15) - (this.SCALE * 25)));
    this.canvas.ctx.lineTo(this.startX + (this.SCALE * 330), this.startY - ((this.SCALE * 15) + (this.SCALE * 25)));
    this.canvas.ctx.stroke();
    this.tailRotation = this.tailRotation + 0.1;
    this.canvas.ctx.restore();
  }

}