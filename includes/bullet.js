export default class Bullet {

  BULLET_WIDTH_HEIGHT = 10;
  BULLET_SPEED = 10;

  constructor(canvas, turret, barrelPosition, flightController) {
    this.canvas = canvas;
    this.turret = turret;
    this.flightController = flightController;
    this.barrelPosition = barrelPosition;
    this.bulletX = this.canvas.width/2 - this.BULLET_WIDTH_HEIGHT/2;
    this.bulletY = this.canvas.height - this.canvas.BASE_WIDTH_HEIGHT - this.turret.twh - this.BULLET_WIDTH_HEIGHT/2;
    this.isGone = false;
  }

  draw = () => {
    this.canvas.ctx.fillStyle = this.canvas.WHITE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.rect(this.bulletX, this.bulletY, this.BULLET_WIDTH_HEIGHT, this.BULLET_WIDTH_HEIGHT);
    this.canvas.ctx.fill();
    
    // Yay for maths!
    this.bulletX = this.bulletX + this.BULLET_SPEED * Math.sin(this.barrelPosition * Math.PI);
    this.bulletY = this.bulletY - this.BULLET_SPEED * Math.cos(this.barrelPosition * Math.PI);

    if (this.wentOffCanvas()) {
      this.isGone = true;
      return;
    }

    // We should check if we hit anything when the bullet is at these heights.
    if (this.bulletY >= this.flightController.HELI_HEIGHT_HIGH && this.bulletY <= this.flightController.HELI_HEIGHT_LOW) {
      this.checkHeliHit();
    }

  }

  checkHeliHit = () => {
    this.flightController.helis.forEach((heli, index) => {
      if (!heli.isExploding && this.bulletY > (heli.startY - 25) && this.bulletY < (heli.startY + 25)) {
        let heliCollisionRange = [heli.startX, heli.startX + (2 * heli.collionWidth)];
        heliCollisionRange.sort((a, b) => a - b);
        if (this.bulletX >= heliCollisionRange[0] && this.bulletX <= heliCollisionRange[1]) {
          heli.isExploding = true;
          this.isGone = true;
        }
      }
    });
  }

  // Check if the bullet went off canvas.
  wentOffCanvas = () => {
    return ((this.bulletY < 0) || (this.bulletY > this.canvas.height) || (this.bulletX < 0) || (this.bulletX > this.canvas.width));
  }

}