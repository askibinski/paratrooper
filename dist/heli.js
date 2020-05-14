export default class Heli {
    // If you look at the original game, I think helis from the right always
    // fly above the helis from the left (they never use the same height).
    constructor(canvas, trooperController, direction, height) {
        this.canvas = canvas;
        this.trooperController = trooperController;
        this.SCALE = 0.36;
        this.ROTOR_BLADE_MAX_LENGTH = 130;
        this.ROTOR_SPEED = 20;
        this.HELI_SPEED = 5;
        this.HELI_START_CANVAS_OFFSET = 100;
        this.HELI_TAIL_LENGTH = 180;
        // A wrapper around every item part which needs to be drawn, containing logic
        // for the explosion.
        this.drawItem = (name, i) => {
            let x = !this.isExploding ? this.startX : this.startX + this.heliDirection * (this.HELI_SPEED * this.multipliers[i]);
            let y = !this.isExploding ? this.startY : this.startY + (this.frameSinceExplosion * this.frameSinceExplosion * this.multipliers[i]);
            const { centerX, centerY } = this.getItemPartCenter(name, x, y);
            if (this.isExploding) {
                this.canvas.ctx.save();
                this.canvas.ctx.translate(centerX, centerY);
                this.canvas.ctx.rotate(this.explodeRotateDirections[i] * this.tailRotation / 2 * Math.PI);
                this.canvas.ctx.translate(-centerX, -centerY);
            }
            this.drawItemPart(name, x, y, centerX, centerY);
            if (this.isExploding) {
                this.canvas.ctx.restore();
            }
        };
        // The core part of drawing an item part.
        this.drawItemPart = (name, x, y, centerX, centerY) => {
            switch (name) {
                case 'tail-long':
                    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
                    this.canvas.ctx.lineWidth = (this.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (this.SCALE * 150), y - (this.SCALE * 15));
                    this.canvas.ctx.lineTo(x + (this.SCALE * (150 + this.HELI_TAIL_LENGTH)), y - (this.SCALE * 15));
                    this.canvas.ctx.stroke();
                    break;
                case 'tail-short':
                    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
                    this.canvas.ctx.lineWidth = (this.SCALE * 20);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (this.SCALE * 150), y);
                    this.canvas.ctx.lineTo(x + (this.SCALE * 270), y);
                    this.canvas.ctx.stroke();
                    break;
                case 'heli-body':
                    this.canvas.ctx.fillStyle = this.canvas.BLACK;
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
                    this.canvas.ctx.fill();
                case 'heli-body-stroke':
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
                    break;
                case 'heli-body-window':
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
                    break;
                case 'rotor-connection':
                    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
                    this.canvas.ctx.lineWidth = (this.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (this.SCALE * 100), y - (this.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (this.SCALE * 100), y - (this.SCALE * 80));
                    this.canvas.ctx.stroke();
                    break;
                case 'top-rotor-left':
                    this.canvas.ctx.strokeStyle = this.canvas.PINK;
                    this.canvas.ctx.lineWidth = (this.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (this.SCALE * 100), y - (this.SCALE * 80));
                    this.canvas.ctx.lineTo(x + ((this.SCALE * 100) - (this.SCALE * this.rotorBladeLength)), y - (this.SCALE * 80));
                    this.canvas.ctx.stroke();
                    break;
                case 'top-rotor-right':
                    this.canvas.ctx.strokeStyle = this.canvas.PINK;
                    this.canvas.ctx.lineWidth = (this.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (this.SCALE * 100), y - (this.SCALE * 80));
                    this.canvas.ctx.lineTo(x + ((this.SCALE * 100) + (this.SCALE * this.rotorBladeLength)), y - (this.SCALE * 80));
                    this.canvas.ctx.stroke();
                    break;
                case 'landing-gear-left':
                    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
                    this.canvas.ctx.lineWidth = (this.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (this.SCALE * 50), y + (this.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (this.SCALE * 50), y + (this.SCALE * 85));
                    this.canvas.ctx.stroke();
                    break;
                case 'landing-gear-right':
                    this.canvas.ctx.strokeStyle = this.canvas.WHITE;
                    this.canvas.ctx.lineWidth = (this.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.lineTo(x + (this.SCALE * 150), y + (this.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (this.SCALE * 150), y + (this.SCALE * 85));
                    this.canvas.ctx.stroke();
                    break;
                case 'landing-gear-bar':
                    this.canvas.ctx.strokeStyle = this.canvas.BLUE;
                    this.canvas.ctx.lineWidth = (this.SCALE * 10);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x - (this.SCALE * 20), y + (this.SCALE * 65));
                    this.canvas.ctx.lineTo(x, y + (this.SCALE * 85));
                    this.canvas.ctx.lineTo(x + (this.SCALE * 210), y + (this.SCALE * 85));
                    this.canvas.ctx.stroke();
                    break;
                case 'tail-rotor':
                    if (!this.isExploding) {
                        this.canvas.ctx.save();
                        this.canvas.ctx.translate(centerX, centerY);
                        this.canvas.ctx.rotate(-this.tailRotation * Math.PI);
                        this.canvas.ctx.translate(-centerX, -centerY);
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
                    break;
            }
        };
        // Used for the translate back and forth in case of exploding.
        this.getItemPartCenter = (name, x, y) => {
            switch (name) {
                case 'tail-long':
                    return {
                        centerX: x + (this.SCALE * (150 + (this.HELI_TAIL_LENGTH / 2))),
                        centerY: y - (this.SCALE * 15),
                    };
                    break;
                case 'tail-short':
                    return {
                        centerX: x + (this.SCALE * 210),
                        centerY: y,
                    };
                    break;
                case 'heli-body':
                    return {
                        centerX: x + (this.SCALE * 100),
                        centerY: y,
                    };
                    break;
                case 'heli-body-stroke':
                    return {
                        centerX: x + (this.SCALE * 100),
                        centerY: y,
                    };
                    break;
                case 'heli-body-window':
                    return {
                        centerX: x + (this.SCALE * 62.5),
                        centerY: y - (this.SCALE * 25),
                    };
                    break;
                case 'rotor-connection':
                    return {
                        centerX: x + (this.SCALE * 100),
                        centerY: y - (this.SCALE * 65),
                    };
                    break;
                case 'top-rotor-left':
                    return {
                        centerX: x + (this.SCALE * 100),
                        centerY: y - (this.SCALE * 80),
                    };
                    break;
                case 'top-rotor-right':
                    return {
                        centerX: x + (this.SCALE * 100),
                        centerY: y - (this.SCALE * 80),
                    };
                    break;
                case 'landing-gear-left':
                    return {
                        centerX: x + (this.SCALE * 50),
                        centerY: y + (this.SCALE * 67.5),
                    };
                    break;
                case 'landing-gear-right':
                    return {
                        centerX: x + (this.SCALE * 150),
                        centerY: y + (this.SCALE * 76.5),
                    };
                    break;
                case 'landing-gear-bar':
                    return {
                        centerX: x + (this.SCALE * 105),
                        centerY: y + (this.SCALE * 85),
                    };
                    break;
                case 'tail-rotor':
                    return {
                        centerX: x + (this.SCALE * 330),
                        centerY: y - (this.SCALE * 15),
                    };
                    break;
            }
        };
        this.draw = () => {
            this.frame++;
            // Each frame, there is a 0,05% chance a trooper will jump.
            if (!this.paratrooper && this.canvas.getRndInteger(1, 100) === 1) {
                this.trooperController.createTrooper(this.startX, this.startY);
                this.paratrooper = true;
                console.log('jump!');
            }
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
            // Draw all the things!
            this.drawItem('tail-long', 0);
            this.drawItem('tail-short', 1);
            this.drawItem('heli-body', 2);
            this.drawItem('heli-body-stroke', 3);
            this.drawItem('heli-body-window', 4);
            this.drawItem('rotor-connection', 5);
            this.drawItem('top-rotor-left', 6);
            this.drawItem('top-rotor-right', 7);
            this.drawItem('landing-gear-left', 8);
            this.drawItem('landing-gear-right', 9);
            this.drawItem('landing-gear-bar', 10);
            this.drawItem('tail-rotor', 11);
            // Visually, this gives the impression of rotating blades, because our brain want to believe.
            this.rotorBladeLength = this.rotorBladeLength + (this.rotorBladeDirection * this.ROTOR_SPEED);
            if (this.rotorBladeLength < 0 || this.rotorBladeLength > this.ROTOR_BLADE_MAX_LENGTH) {
                this.rotorBladeDirection = -1 * this.rotorBladeDirection;
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
        };
        // Check if the heli flied over and went off canvas.
        this.wentOffCanvas = () => {
            return ((this.startX > (this.canvas.width + this.HELI_START_CANVAS_OFFSET)) || (this.startX < (-this.HELI_START_CANVAS_OFFSET)));
        };
        this.heliDirection = direction;
        this.paratrooper = false;
        this.startX = direction === -1 ? -this.HELI_START_CANVAS_OFFSET : this.canvas.width + this.HELI_START_CANVAS_OFFSET;
        this.startY = height;
        this.rotorBladeLength = 0;
        this.rotorBladeDirection = -1;
        this.tailRotation = 0;
        // Used for easier collision detecting.
        this.collisionWidth = direction * Math.round(this.SCALE * this.HELI_TAIL_LENGTH);
        this.isExploding = false;
        this.frame = 0;
        this.frameSinceExplosion = 0;
        this.isGone = false;
        // "explode" multipliers. These are used to change the direction and speed
        // of the falling parts in a random way.
        // The length of these arrays corresponds to the number of items!
        this.multipliers = [0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3];
        this.explodeRotateDirections = [-1, -1, -1, -1, -1 - 1, 1, 1, 1, 1, 1, 1];
        this.multipliers = this.canvas.shuffle(this.multipliers);
        this.explodeRotateDirections = this.canvas.shuffle(this.explodeRotateDirections);
    }
}
