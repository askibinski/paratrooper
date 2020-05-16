import Canvas from "./canvas.js";
import Turret from "./turret.js";
import FlightController from "./flight-controller.js";
import Paratrooper from "./paratrooper.js";
export default class Bullet {
    constructor(canvas, turret, flightController, trooperController, score) {
        this.canvas = canvas;
        this.turret = turret;
        this.flightController = flightController;
        this.trooperController = trooperController;
        this.score = score;
        this.draw = () => {
            this.canvas.ctx.fillStyle = Canvas.WHITE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(this.bulletX, this.bulletY, Bullet.BULLET_WIDTH_HEIGHT, Bullet.BULLET_WIDTH_HEIGHT);
            this.canvas.ctx.fill();
            // Yay for maths!
            this.bulletX = this.bulletX + Bullet.BULLET_SPEED * Math.sin(this.barrelPosition * Math.PI);
            this.bulletY = this.bulletY - Bullet.BULLET_SPEED * Math.cos(this.barrelPosition * Math.PI);
            if (this.wentOffCanvas()) {
                this.isGone = true;
                return;
            }
            // We should check if we hit anything when the bullet is at these heights.
            if (this.bulletY >= FlightController.HELI_HEIGHT_HIGH && this.bulletY <= FlightController.HELI_HEIGHT_LOW) {
                this.checkHeliHit();
            }
            // Check if we are hitting any troopers.
            if (this.trooperController.troopers.length > 0) {
                this.checkTrooperHit();
            }
        };
        this.checkHeliHit = () => {
            this.flightController.helis.forEach((heli) => {
                if (!heli.isExploding && this.bulletY > (heli.startY - 25) && this.bulletY < (heli.startY + 25)) {
                    let heliCollisionRange = [heli.startX, heli.startX + (2 * heli.collisionWidth)];
                    heliCollisionRange.sort((a, b) => a - b);
                    if (this.bulletX >= heliCollisionRange[0] && this.bulletX <= heliCollisionRange[1]) {
                        heli.isExploding = true;
                        this.isGone = true;
                        // A heli is 10 points!
                        this.score.add(10);
                    }
                }
            });
        };
        this.checkTrooperHit = () => {
            this.trooperController.troopers.forEach((trooper) => {
                // The trooper's body.
                if (this.bulletY >= (trooper.y + (4 * Paratrooper.TROOPER_HEAD_SIZE))
                    && this.bulletY <= (trooper.y + (8 * Paratrooper.TROOPER_HEAD_SIZE))
                    && this.bulletX >= trooper.x - (2 * Paratrooper.TROOPER_HEAD_SIZE)
                    && this.bulletX <= trooper.x + (2 * Paratrooper.TROOPER_HEAD_SIZE)) {
                    trooper.isGone = true;
                    this.isGone = true;
                    this.score.add(5);
                }
                // The chute.
                if (!trooper.isGone && trooper.hasChute && trooper.deployedChute
                    && this.bulletY >= (trooper.y - (4 * Paratrooper.TROOPER_HEAD_SIZE))
                    && this.bulletY <= (trooper.y + (4 * Paratrooper.TROOPER_HEAD_SIZE))) {
                    if (this.bulletX >= trooper.x - Paratrooper.CHUTE_RADIUS
                        && this.bulletX <= trooper.x + Paratrooper.CHUTE_RADIUS) {
                        trooper.hasChute = false;
                        this.isGone = true;
                        // A chute hit doesn't actually give you points. But the inevitable death
                        // of the trooper will.
                    }
                }
            });
        };
        // Check if the bullet went off canvas.
        this.wentOffCanvas = () => {
            return ((this.bulletY < 0) || (this.bulletY > this.canvas.height) || (this.bulletX < 0) || (this.bulletX > this.canvas.width));
        };
        this.barrelPosition = 0;
        this.bulletX = this.canvas.width / 2 - Bullet.BULLET_WIDTH_HEIGHT / 2;
        this.bulletY = this.canvas.height - Turret.BASE_WIDTH_HEIGHT - this.turret.twh - (Bullet.BULLET_WIDTH_HEIGHT / 2) - Turret.SCORE_HEIGHT;
        this.isGone = false;
        // Every time we shoot, the score is subtracted by one.
        this.score.subtract(1);
    }
    set aim(position) {
        this.barrelPosition = position;
    }
}
Bullet.BULLET_WIDTH_HEIGHT = 10;
Bullet.BULLET_SPEED = 10;
