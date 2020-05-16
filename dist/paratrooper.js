import Canvas from "./canvas.js";
import Turret from "./turret.js";
export default class Paratrooper {
    constructor(canvas, trooperController, score) {
        this.canvas = canvas;
        this.trooperController = trooperController;
        this.score = score;
        this.run = () => {
            // Each framerun, there is a 2% chance a trooper will deploy his chute.
            // The higher this is, the more likely a chute will be deployed, making
            // it easier to shoot them down.
            if (this.canvas.getRndInteger(1, 50) === 1) {
                this.deployedChute = true;
            }
            this.trooper();
            if (this.deployedChute && this.hasChute) {
                this.parachute();
            }
            let fallSpeed = Paratrooper.FALL_SPEED;
            // Obviously, because of Newton, a trooper falls faster without a chute.
            // There are 2 scenarios: he didn't deloy yet, or the poor bastard got
            // his chute shot down (which by the way is not against the convention
            // of Geneva apparantly: https://en.wikipedia.org/wiki/Attacks_on_parachutists
            if ((this.hasChute && !this.deployedChute) || (!this.hasChute && this.deployedChute)) {
                fallSpeed = 4 * Paratrooper.FALL_SPEED;
            }
            // They *can* stack!
            if (this.y < this.canvas.height - Turret.SCORE_HEIGHT - (4 * Paratrooper.TROOPER_HEAD_SIZE) - ((this.troopersLandedHere.length + 1) * (4 * Paratrooper.TROOPER_HEAD_SIZE))) {
                this.y = this.y + fallSpeed;
            }
            else {
                // Hitting the ground. Again we gave 2 options:
                if (this.hasChute || this.hasLanded) {
                    // Phew. Safely landed.
                    this.hasChute = false;
                    this.hasLanded = true;
                }
                else {
                    // Oops...Let 'm sink into to the ground.
                    // @TODO death animation.
                    this.y = this.y + fallSpeed;
                    if (this.y > this.canvas.height - Turret.SCORE_HEIGHT - (4 * Paratrooper.TROOPER_HEAD_SIZE)) {
                        this.isGone = true;
                        this.score.add(5);
                    }
                    // The fall will also kill any other troopers at this spot.
                    if (this.troopersLandedHere.length > 0) {
                        this.troopersLandedHere.forEach((trooper) => {
                            trooper.isGone = true;
                        });
                    }
                }
            }
        };
        this.parachute = () => {
            // Left line.
            this.canvas.ctx.strokeStyle = Canvas.PINK;
            this.canvas.ctx.lineWidth = Paratrooper.CHUTE_LINE_WIDTH;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(this.x - (Paratrooper.CHUTE_RADIUS) + (Paratrooper.CHUTE_LINE_WIDTH / 2), this.y + Paratrooper.JUMP_Y_OFFSET - (4 * Paratrooper.TROOPER_HEAD_SIZE));
            this.canvas.ctx.lineTo(this.x, this.y + Paratrooper.JUMP_Y_OFFSET + 50 - (4 * Paratrooper.TROOPER_HEAD_SIZE));
            this.canvas.ctx.closePath();
            this.canvas.ctx.stroke();
            // Right line.
            this.canvas.ctx.strokeStyle = Canvas.PINK;
            this.canvas.ctx.lineWidth = Paratrooper.CHUTE_LINE_WIDTH;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(this.x + (Paratrooper.CHUTE_RADIUS) - (Paratrooper.CHUTE_LINE_WIDTH / 2), this.y + Paratrooper.JUMP_Y_OFFSET - (4 * Paratrooper.TROOPER_HEAD_SIZE));
            this.canvas.ctx.lineTo(this.x, this.y + Paratrooper.JUMP_Y_OFFSET + 50 - (4 * Paratrooper.TROOPER_HEAD_SIZE));
            this.canvas.ctx.closePath();
            this.canvas.ctx.stroke();
            // The chute.
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(this.x, this.y + Paratrooper.JUMP_Y_OFFSET - (4 * Paratrooper.TROOPER_HEAD_SIZE), Paratrooper.CHUTE_RADIUS, 1 * Math.PI, 0);
            this.canvas.ctx.fill();
        };
        this.trooper = () => {
            // Head.
            this.canvas.ctx.fillStyle = Canvas.WHITE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(this.x - (Paratrooper.TROOPER_HEAD_SIZE / 2), this.y + Paratrooper.JUMP_Y_OFFSET, Paratrooper.TROOPER_HEAD_SIZE, Paratrooper.TROOPER_HEAD_SIZE);
            this.canvas.ctx.fill();
            // Body.
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(this.x - (Paratrooper.TROOPER_HEAD_SIZE / 2), this.y + Paratrooper.JUMP_Y_OFFSET + Paratrooper.TROOPER_HEAD_SIZE, Paratrooper.TROOPER_HEAD_SIZE, 1.5 * Paratrooper.TROOPER_HEAD_SIZE);
            this.canvas.ctx.fill();
            // Right arm (left for the viewer).
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(this.x - (Paratrooper.TROOPER_HEAD_SIZE), this.y + Paratrooper.JUMP_Y_OFFSET + Paratrooper.TROOPER_HEAD_SIZE, (Paratrooper.TROOPER_HEAD_SIZE / 2), (Paratrooper.TROOPER_HEAD_SIZE / 2));
            this.canvas.ctx.fill();
            // Left arm.
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(this.x + (Paratrooper.TROOPER_HEAD_SIZE / 2), this.y + Paratrooper.JUMP_Y_OFFSET + Paratrooper.TROOPER_HEAD_SIZE, (Paratrooper.TROOPER_HEAD_SIZE / 2), (Paratrooper.TROOPER_HEAD_SIZE / 2));
            this.canvas.ctx.fill();
            // Right leg (left for the viewer).
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(this.x - (Paratrooper.TROOPER_HEAD_SIZE), this.y + Paratrooper.JUMP_Y_OFFSET + (2.5 * Paratrooper.TROOPER_HEAD_SIZE), (Paratrooper.TROOPER_HEAD_SIZE / 2), (1.5 * Paratrooper.TROOPER_HEAD_SIZE));
            this.canvas.ctx.fill();
            // Left leg.
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(this.x + (Paratrooper.TROOPER_HEAD_SIZE / 2), this.y + Paratrooper.JUMP_Y_OFFSET + (2.5 * Paratrooper.TROOPER_HEAD_SIZE), (Paratrooper.TROOPER_HEAD_SIZE / 2), (1.5 * Paratrooper.TROOPER_HEAD_SIZE));
            this.canvas.ctx.fill();
        };
        this.isGone = false;
        this.deployedChute = false;
        this.hasChute = true;
        this.hasLanded = false;
        this.readyForAction = false;
        this.x = 0;
        this.y = 0;
        this.troopersLandedHere = [];
    }
    set jumpCoordinates(coordinates) {
        const { x, y } = coordinates;
        this.x = x;
        this.y = y;
        // We need to stack troopers if they land on the same spot.
        this.trooperController.troopers.forEach((trooper) => {
            if (trooper.x == this.x) {
                this.troopersLandedHere.push(trooper);
            }
        });
    }
}
Paratrooper.CHUTE_RADIUS = 30;
Paratrooper.CHUTE_LINE_WIDTH = 5;
Paratrooper.TROOPER_HEAD_SIZE = 12;
Paratrooper.JUMP_Y_OFFSET = 50;
Paratrooper.FALL_SPEED = 1;
