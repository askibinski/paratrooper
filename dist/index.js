'use strict';

class Container {
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
    }
    register(name, definition, dependencies) {
        this.services.set(name, { definition: definition, dependencies: dependencies });
    }
    singleton(name, definition, dependencies) {
        this.services.set(name, { definition: definition, dependencies: dependencies, singleton: true });
    }
    get(name) {
        const c = this.services.get(name);
        if (this.isClass(c.definition)) {
            if (c.singleton) {
                const singletonInstance = this.singletons.get(name);
                if (singletonInstance) {
                    return singletonInstance;
                }
                else {
                    const newSingletonInstance = this.createInstance(c);
                    this.singletons.set(name, newSingletonInstance);
                    return newSingletonInstance;
                }
            }
            return this.createInstance(c);
        }
        else {
            return c.definition;
        }
    }
    // @TODO any !!!!!!!!!!!!!
    getResolvedDependencies(service) {
        let classDependencies = [];
        if (service.dependencies) {
            classDependencies = service.dependencies.map((dep) => {
                return this.get(dep);
            });
        }
        return classDependencies;
    }
    // @TODO any !!!!!!!!!!!!!
    createInstance(service) {
        return new service.definition(...this.getResolvedDependencies(service));
    }
    isClass(definition) {
        return typeof definition === 'function';
    }
}

class Canvas {
    constructor() {
        // Clear the canvas.
        this.clear = () => {
            this.ctx.clearRect(0, 0, this.width, this.height);
        };
        // Background color canvas.
        this.setup = () => {
            this.ctx.fillStyle = Canvas.BLACK;
            this.ctx.fillRect(0, 0, this.width, this.height);
        };
        // Select the elements on the page - canvas, reset button.
        const canvas = document.querySelector('#paratrooper');
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        document.querySelector('#instructions').addEventListener('click', () => { alert('Use arrow keys (left, right and up).'); });
    }
    // Get a random integer in a certain range.
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // Shuffle an array.
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}
Canvas.WHITE = "#ffffff";
Canvas.PINK = '#fe52fc';
Canvas.BLACK = '#000000';
Canvas.BLUE = '#56faf7';

class Turret {
    constructor(canvas) {
        this.canvas = canvas;
        this.draw = () => {
            this.base();
            this.turretBaseTop();
            this.turretBaseBottom();
            this.turretBasePivot();
            this.floor();
        };
        this.floor = () => {
            this.canvas.ctx.fillStyle = Canvas.BLACK;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(0, (this.canvas.height - Turret.SCORE_HEIGHT), this.canvas.width, Turret.SCORE_HEIGHT);
            this.canvas.ctx.fill();
            this.canvas.ctx.strokeStyle = Canvas.BLUE;
            this.canvas.ctx.lineWidth = 3;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(0, (this.canvas.height - Turret.SCORE_HEIGHT));
            this.canvas.ctx.lineTo(this.canvas.width, (this.canvas.height - Turret.SCORE_HEIGHT));
            this.canvas.ctx.stroke();
        };
        // Base.
        this.base = () => {
            this.canvas.ctx.fillStyle = Canvas.WHITE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect((this.canvas.width / 2) - (Turret.BASE_WIDTH_HEIGHT / 2), (this.canvas.height - Turret.BASE_WIDTH_HEIGHT - Turret.SCORE_HEIGHT), Turret.BASE_WIDTH_HEIGHT, Turret.BASE_WIDTH_HEIGHT);
            this.canvas.ctx.fill();
        };
        // Turret base top (the rounded part).
        this.turretBaseTop = () => {
            this.canvas.ctx.fillStyle = Canvas.PINK;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (Turret.BASE_WIDTH_HEIGHT + this.twh + Turret.SCORE_HEIGHT)), this.twh / 2, 1 * Math.PI, 0);
            this.canvas.ctx.fill();
        };
        // Turret base (square part).
        this.turretBaseBottom = () => {
            this.canvas.ctx.fillStyle = Canvas.PINK;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect((this.canvas.width / 2) - (this.twh / 2), (this.canvas.height - Turret.BASE_WIDTH_HEIGHT - this.twh - Turret.SCORE_HEIGHT), this.twh, this.twh);
            this.canvas.ctx.fill();
        };
        // The pivot point.
        this.turretBasePivot = () => {
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (Turret.BASE_WIDTH_HEIGHT + this.twh + Turret.SCORE_HEIGHT)), this.twh / 8, 2 * Math.PI, 0);
            this.canvas.ctx.fill();
        };
        // Turret base width height. 
        this.twh = Math.round(Turret.BASE_WIDTH_HEIGHT / 3);
    }
}
Turret.BASE_WIDTH_HEIGHT = 200;
Turret.SCORE_HEIGHT = 80;

class Barrel {
    constructor(canvas, turret, flightController) {
        this.canvas = canvas;
        this.turret = turret;
        this.flightController = flightController;
        // Handle aiming and shooting with the keys.
        this.handleKey = (e) => {
            if (e.key.includes('Arrow')) {
                switch (e.key) {
                    case 'ArrowUp':
                        // Stops the barrel and shoots.
                        this.rotateDirection = 0;
                        // Create a bullet (shoot).
                        const bullet = window.game.container.get('bullet');
                        bullet.aim = this.barrelPosition;
                        this.bullets.push(bullet);
                        break;
                    case 'ArrowLeft':
                        if (this.barrelPosition > -0.50) {
                            this.rotateDirection = -1;
                        }
                        break;
                    case 'ArrowRight':
                        if (this.barrelPosition < 0.50) {
                            this.rotateDirection = 1;
                        }
                        break;
                }
                e.preventDefault();
            }
        };
        this.draw = () => {
            // Animate the bullets.
            this.bullets.forEach((bullet, index) => {
                // If the bullet went off canvas the reference can  be removed and 
                // javascript will automatically reclaim memory.
                if (bullet.isGone) {
                    this.bullets.splice(index, 1);
                    return;
                }
                bullet.draw();
            });
            // Save the state, keeping it clean.
            this.canvas.ctx.save();
            // Rotate takes -1 (left), 1 (right) or 0 (stop) as rotating direction.
            this.barrelPosition = this.barrelPosition + (this.rotateDirection * Barrel.ROTATE_SPEED);
            this.canvas.ctx.translate(this.canvas.width / 2, (this.canvas.height - Turret.BASE_WIDTH_HEIGHT - this.turret.twh - Turret.SCORE_HEIGHT));
            this.canvas.ctx.rotate(this.barrelPosition * Math.PI);
            this.canvas.ctx.translate(-this.canvas.width / 2, -(this.canvas.height - Turret.BASE_WIDTH_HEIGHT - this.turret.twh - Turret.SCORE_HEIGHT));
            // Stop the barrel rotating too far left or right.
            if (this.rotateDirection && (this.barrelPosition <= -0.5 || this.barrelPosition >= 0.5)) {
                this.barrelPosition = (this.rotateDirection * 0.5);
                this.rotateDirection = 0;
            }
            // This is the actual drawing of the barrel.
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            // Barrel width.
            const bw = Math.round(this.turret.twh / 3);
            this.canvas.ctx.rect((this.canvas.width / 2 - Math.round(bw) / 2), (this.canvas.height - Turret.BASE_WIDTH_HEIGHT - (this.turret.twh * 2) - Turret.SCORE_HEIGHT), bw, this.turret.twh);
            this.canvas.ctx.fill();
            this.canvas.ctx.restore();
        };
        this.barrelPosition = 0;
        this.rotateDirection = 0;
        this.bullets = [];
        window.addEventListener('keydown', this.handleKey);
    }
}
Barrel.ROTATE_SPEED = 0.01;

class FlightController {
    constructor(canvas) {
        this.canvas = canvas;
        this.helis = [];
        this.delay = { '-1': 0, '1': 0 };
        this.maxHelis = 3;
        this.newHelis = true;
    }
    set showNewHelis(show) {
        this.newHelis = show;
    }
    run() {
        for (let i in this.delay) {
            if (this.delay[i] > 0) {
                this.delay[i]--;
            }
        }
        if (this.newHelis) {
            // 50% chance from which direction.
            let toggle = !!this.canvas.getRndInteger(0, 2) ? -1 : 1;
            if (this.helis.length < this.maxHelis && this.delay[toggle] === 0) {
                // 0,5% change each run to create a chopper.
                if (this.canvas.getRndInteger(1, 1000) <= 15) {
                    const heli = window.game.container.get('heli');
                    heli.height = (toggle === -1) ? FlightController.HELI_HEIGHT_LOW : FlightController.HELI_HEIGHT_HIGH;
                    heli.toggle = toggle;
                    this.helis.push(heli);
                    // Create a delay so we don't immediately create a new heli.
                    this.delay[toggle] = 30;
                }
            }
        }
        this.helis.forEach((heli, index) => {
            // If the heli went off canvas or was detroyed, the reference can 
            // be removed and javascript will automatically reclaim memory.
            if (heli.isGone) {
                this.helis.splice(index, 1);
                return;
            }
            heli.draw();
        });
    }
}
FlightController.HELI_HEIGHT_HIGH = 100;
FlightController.HELI_HEIGHT_LOW = 200;

class Paratrooper {
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

class Bullet {
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

class TrooperController {
    constructor(canvas, flightController, overlay) {
        this.canvas = canvas;
        this.flightController = flightController;
        this.overlay = overlay;
        this.run = () => {
            this.troopers.forEach((trooper, index) => {
                if (trooper.isGone) {
                    this.troopers.splice(index, 1);
                    return;
                }
                // If the paratrooper landed safely, mark him ready for
                // action and sort him into the area.
                if (trooper.hasLanded && !trooper.readyForAction) {
                    this.landed(trooper);
                    trooper.readyForAction = true;
                    return;
                }
                trooper.run();
            });
            if (this.troopersLandedLeft.length >= 4 || this.troopersLandedRight.length >= 4) {
                this.flightController.showNewHelis = false;
                this.overlay.gameOverStatus = true;
            }
        };
        this.landed = (trooper) => {
            if (trooper.x < this.canvas.width / 2) {
                this.troopersLandedLeft.push(trooper);
            }
            if (trooper.x > this.canvas.width / 2) {
                this.troopersLandedRight.push(trooper);
            }
        };
        // We round the x to the nearest "grid" of 50, so we can actually
        // stack troopers (and the can be killed by shooting a trooper's
        // chute and letting him fall on another guy which already landed.
        this.createTrooper = (x, y) => {
            const gridFactor = Math.floor(x / 50);
            const trooper = window.game.container.get('paratrooper');
            trooper.jumpCoordinates = { x: gridFactor * 50, y: y };
            this.troopers.push(trooper);
        };
        this.troopers = [];
        this.troopersLandedLeft = [];
        this.troopersLandedRight = [];
    }
}

class Score {
    constructor(canvas) {
        this.canvas = canvas;
        this.add = (amount) => {
            this.score = this.score + amount;
        };
        this.subtract = (amount) => {
            this.score = this.score - amount;
            if (this.score < 0) {
                this.score = 0;
            }
        };
        this.run = () => {
            let score = this.score;
            this.canvas.ctx.fillStyle = Canvas.WHITE;
            this.canvas.ctx.font = "48px Courier";
            this.canvas.ctx.textAlign = "left";
            this.canvas.ctx.textBaseline = "top";
            this.canvas.ctx.fillText(`SCORE:${score}`, 20, this.canvas.height - 60);
        };
        this.score = 0;
    }
}

class FPS {
    constructor(canvas) {
        this.canvas = canvas;
        this.run = () => {
            // Probably a very inacurate FPS counter. We'll see.
            this.frameCounter++;
            if (performance.now() - this.lastUpdate >= 1000) {
                this.fps = this.frameCounter;
                this.frameCounter = 0;
                this.lastUpdate = performance.now();
            }
            this.canvas.ctx.fillStyle = Canvas.WHITE;
            this.canvas.ctx.font = "48px Courier";
            this.canvas.ctx.textAlign = "right";
            this.canvas.ctx.textBaseline = "top";
            this.canvas.ctx.fillText(`FPS:${this.fps}`, this.canvas.width - 10, this.canvas.height - 60);
        };
        this.lastUpdate = performance.now();
        this.frameCounter = 0;
        this.fps = '';
    }
}

class Heli {
    // If you look at the original game, I think helis from the right always
    // fly above the helis from the left (they never use the same height).
    constructor(canvas, trooperController) {
        this.canvas = canvas;
        this.trooperController = trooperController;
        // A wrapper around every item part which needs to be drawn, containing logic
        // for the explosion.
        this.drawItem = (name, i) => {
            let x = !this.isExploding ? this.startX : this.startX + this.direction * (Heli.HELI_SPEED * this.multipliers[i]);
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
                    this.canvas.ctx.strokeStyle = Canvas.WHITE;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (Heli.SCALE * 150), y - (Heli.SCALE * 15));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * (150 + Heli.HELI_TAIL_LENGTH)), y - (Heli.SCALE * 15));
                    this.canvas.ctx.stroke();
                    break;
                case 'tail-short':
                    this.canvas.ctx.strokeStyle = Canvas.WHITE;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 20);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (Heli.SCALE * 150), y);
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 270), y);
                    this.canvas.ctx.stroke();
                    break;
                case 'heli-body':
                    this.canvas.ctx.fillStyle = Canvas.BLACK;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 10);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x, y);
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y - (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y - (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 200), y);
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y + (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y + (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x, y);
                    this.canvas.ctx.closePath();
                    this.canvas.ctx.fill();
                case 'heli-body-stroke':
                    this.canvas.ctx.strokeStyle = Canvas.WHITE;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 10);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x, y);
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y - (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y - (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 200), y);
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y + (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y + (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x, y);
                    this.canvas.ctx.closePath();
                    this.canvas.ctx.stroke();
                    break;
                case 'heli-body-window':
                    this.canvas.ctx.fillStyle = Canvas.WHITE;
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x, y);
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y - (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 125), y - (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 75), y);
                    this.canvas.ctx.moveTo(x, y);
                    this.canvas.ctx.lineTo(x, y);
                    this.canvas.ctx.closePath();
                    this.canvas.ctx.fill();
                    break;
                case 'rotor-connection':
                    this.canvas.ctx.strokeStyle = Canvas.WHITE;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (Heli.SCALE * 100), y - (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 100), y - (Heli.SCALE * 80));
                    this.canvas.ctx.stroke();
                    break;
                case 'top-rotor-left':
                    this.canvas.ctx.strokeStyle = Canvas.PINK;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (Heli.SCALE * 100), y - (Heli.SCALE * 80));
                    this.canvas.ctx.lineTo(x + ((Heli.SCALE * 100) - (Heli.SCALE * this.rotorBladeLength)), y - (Heli.SCALE * 80));
                    this.canvas.ctx.stroke();
                    break;
                case 'top-rotor-right':
                    this.canvas.ctx.strokeStyle = Canvas.PINK;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (Heli.SCALE * 100), y - (Heli.SCALE * 80));
                    this.canvas.ctx.lineTo(x + ((Heli.SCALE * 100) + (Heli.SCALE * this.rotorBladeLength)), y - (Heli.SCALE * 80));
                    this.canvas.ctx.stroke();
                    break;
                case 'landing-gear-left':
                    this.canvas.ctx.strokeStyle = Canvas.WHITE;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (Heli.SCALE * 50), y + (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 50), y + (Heli.SCALE * 85));
                    this.canvas.ctx.stroke();
                    break;
                case 'landing-gear-right':
                    this.canvas.ctx.strokeStyle = Canvas.WHITE;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y + (Heli.SCALE * 50));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 150), y + (Heli.SCALE * 85));
                    this.canvas.ctx.stroke();
                    break;
                case 'landing-gear-bar':
                    this.canvas.ctx.strokeStyle = Canvas.BLUE;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 10);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x - (Heli.SCALE * 20), y + (Heli.SCALE * 65));
                    this.canvas.ctx.lineTo(x, y + (Heli.SCALE * 85));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 210), y + (Heli.SCALE * 85));
                    this.canvas.ctx.stroke();
                    break;
                case 'tail-rotor':
                    if (!this.isExploding) {
                        this.canvas.ctx.save();
                        this.canvas.ctx.translate(centerX, centerY);
                        this.canvas.ctx.rotate(-this.tailRotation * Math.PI);
                        this.canvas.ctx.translate(-centerX, -centerY);
                    }
                    this.canvas.ctx.strokeStyle = Canvas.PINK;
                    this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
                    this.canvas.ctx.beginPath();
                    this.canvas.ctx.moveTo(x + (Heli.SCALE * 330), y - ((Heli.SCALE * 15) - (Heli.SCALE * 25)));
                    this.canvas.ctx.lineTo(x + (Heli.SCALE * 330), y - ((Heli.SCALE * 15) + (Heli.SCALE * 25)));
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
                        centerX: x + (Heli.SCALE * (150 + (Heli.HELI_TAIL_LENGTH / 2))),
                        centerY: y - (Heli.SCALE * 15),
                    };
                case 'tail-short':
                    return {
                        centerX: x + (Heli.SCALE * 210),
                        centerY: y,
                    };
                case 'heli-body':
                    return {
                        centerX: x + (Heli.SCALE * 100),
                        centerY: y,
                    };
                case 'heli-body-stroke':
                    return {
                        centerX: x + (Heli.SCALE * 100),
                        centerY: y,
                    };
                case 'heli-body-window':
                    return {
                        centerX: x + (Heli.SCALE * 62.5),
                        centerY: y - (Heli.SCALE * 25),
                    };
                case 'rotor-connection':
                    return {
                        centerX: x + (Heli.SCALE * 100),
                        centerY: y - (Heli.SCALE * 65),
                    };
                case 'top-rotor-left':
                    return {
                        centerX: x + (Heli.SCALE * 100),
                        centerY: y - (Heli.SCALE * 80),
                    };
                case 'top-rotor-right':
                    return {
                        centerX: x + (Heli.SCALE * 100),
                        centerY: y - (Heli.SCALE * 80),
                    };
                case 'landing-gear-left':
                    return {
                        centerX: x + (Heli.SCALE * 50),
                        centerY: y + (Heli.SCALE * 67.5),
                    };
                case 'landing-gear-right':
                    return {
                        centerX: x + (Heli.SCALE * 150),
                        centerY: y + (Heli.SCALE * 76.5),
                    };
                case 'landing-gear-bar':
                    return {
                        centerX: x + (Heli.SCALE * 105),
                        centerY: y + (Heli.SCALE * 85),
                    };
                case 'tail-rotor':
                    return {
                        centerX: x + (Heli.SCALE * 330),
                        centerY: y - (Heli.SCALE * 15),
                    };
            }
        };
        this.draw = () => {
            this.frame++;
            // Each framerun, there is a 1% chance a trooper will jump, but not near
            // the canvas border or above the turret.
            if (this.dropParatrooper
                && this.startX > Heli.JUMP_MARGIN
                && this.startX < (this.canvas.width)
                && (this.startX < ((this.canvas.width / 2) - (Turret.BASE_WIDTH_HEIGHT / 2)) || this.startX > ((this.canvas.width / 2) + (Turret.BASE_WIDTH_HEIGHT / 2) + Heli.JUMP_MARGIN))
                && !this.paratrooper && this.canvas.getRndInteger(1, 100) === 1) {
                this.trooperController.createTrooper(this.startX, this.startY);
                this.paratrooper = true;
            }
            // This is a trick to use the frames since explosion for altering the
            // positions of the exploding parts. We only use half the frames (even
            // numbers) otherwise the animation is too fast.
            if (this.isExploding && this.frame % 2 == 0) {
                this.frameSinceExplosion++;
            }
            // Mirror the heli around the y-axis (for helis coming from the left).
            this.canvas.ctx.save();
            if (this.direction === -1) {
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
            this.rotorBladeLength = this.rotorBladeLength + (this.rotorBladeDirection * Heli.ROTOR_SPEED);
            if (this.rotorBladeLength < 0 || this.rotorBladeLength > Heli.ROTOR_BLADE_MAX_LENGTH) {
                this.rotorBladeDirection = -1 * this.rotorBladeDirection;
            }
            // Hit X range (debug)
            // this.canvas.ctx.strokeStyle = '#FF0000';
            // this.canvas.ctx.lineWidth = (Heli.SCALE * 15);
            // this.canvas.ctx.beginPath();
            // this.canvas.ctx.moveTo(this.startX, this.startY);
            // this.canvas.ctx.lineTo(this.startX + (Heli.SCALE * (2 * Heli.HELI_TAIL_LENGTH)), this.startY);
            // this.canvas.ctx.stroke();
            // The second restore for the mirroring.
            this.canvas.ctx.restore();
            // Make the whole thing fly!
            this.startX = this.startX - (this.direction * Heli.HELI_SPEED);
            if (this.wentOffCanvas()) {
                this.isGone = true;
            }
        };
        // Check if the heli flied over and went off canvas.
        this.wentOffCanvas = () => {
            return ((this.startX > (this.canvas.width + Heli.HELI_START_CANVAS_OFFSET)) || (this.startX < (-Heli.HELI_START_CANVAS_OFFSET)));
        };
        this.paratrooper = false;
        this.dropParatrooper = true;
        this.rotorBladeLength = 0;
        this.rotorBladeDirection = -1;
        this.tailRotation = 0;
        this.direction = 1;
        this.startX = 0;
        this.startY = 0;
        this.collisionWidth = 0;
        // Used for easier collision detecting.
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
    set dropNewTrooper(status) {
        this.dropParatrooper = status;
    }
    set toggle(direction) {
        this.direction = direction;
        this.startX = (direction === -1) ? -Heli.HELI_START_CANVAS_OFFSET : this.canvas.width + Heli.HELI_START_CANVAS_OFFSET;
        this.collisionWidth = this.direction * Math.round(Heli.SCALE * Heli.HELI_TAIL_LENGTH);
    }
    set height(height) {
        this.startY = height;
    }
}
Heli.SCALE = 0.36;
Heli.ROTOR_BLADE_MAX_LENGTH = 130;
Heli.ROTOR_SPEED = 20;
Heli.HELI_SPEED = 5;
Heli.HELI_START_CANVAS_OFFSET = 100;
Heli.HELI_TAIL_LENGTH = 180;
Heli.JUMP_MARGIN = 50;

class Overlay {
    constructor(canvas) {
        this.canvas = canvas;
        this.run = () => {
            if (this.gameOver) {
                this.drawGameOver();
            }
        };
        this.drawGameOver = () => {
            this.canvas.ctx.fillStyle = Canvas.WHITE;
            this.canvas.ctx.font = "256px Courier";
            this.canvas.ctx.textAlign = "center";
            this.canvas.ctx.textBaseline = "middle";
            this.canvas.ctx.fillText(`GAME OVER`, this.canvas.width / 2, this.canvas.height / 2);
        };
        this.gameOver = false;
    }
    set gameOverStatus(status) {
        this.gameOver = status;
    }
}

var Services = () => {
    const container = new Container;
    container.singleton('canvas', Canvas, []);
    container.singleton('turret', Turret, ['canvas']);
    container.singleton('flightController', FlightController, ['canvas']);
    container.singleton('trooperController', TrooperController, ['canvas', 'flightController', 'overlay']);
    container.singleton('score', Score, ['canvas']);
    container.singleton('barrel', Barrel, ['canvas', 'turret', 'flightController']);
    container.singleton('fps', FPS, ['canvas']);
    container.singleton('overlay', Overlay, ['canvas']);
    container.register('bullet', Bullet, ['canvas', 'turret', 'flightController', 'trooperController', 'score']);
    container.register('heli', Heli, ['canvas', 'trooperController']);
    container.register('paratrooper', Paratrooper, ['canvas', 'trooperController', 'score']);
    return container;
};

// Firebase App (the core Firebase SDK) is always required and must be listed first
// import * as firebase from "firebase/app";
// import "firebase/firestore";
class Game {
    constructor(container) {
        this.container = container;
        // Draw all the things.
        // TODO: later on, we will probably just loop through all our objects 
        // and call the draw() function.
        this.drawLoop = () => {
            let now = performance.now();
            let elapsed = now - this.lastUpdate;
            // We want to set a max FPS otherwise the game will run faster on 
            // superfast computers. It still will run (a bit) slower on machines 
            // which can't handle the desired FPS.
            if (elapsed > this.fpsInterval) {
                this.canvas.clear();
                this.canvas.setup();
                this.barrel.draw();
                this.flightController.run();
                this.trooperController.run();
                this.turret.draw();
                this.score.run();
                this.fps.run();
                this.overlay.run();
                this.lastUpdate = now - (elapsed % this.fpsInterval);
            }
            window.requestAnimationFrame(this.drawLoop);
        };
        this.canvas = container.get('canvas');
        this.turret = container.get('turret');
        this.trooperController = container.get('trooperController');
        this.flightController = container.get('flightController');
        this.score = container.get('score');
        this.barrel = container.get('barrel');
        this.overlay = container.get('overlay');
        // This shows the FPS on screen.
        this.fps = container.get('fps');
        this.lastUpdate = performance.now();
        this.fpsInterval = Math.round(1000 / Game.MAX_FPS);
        window.requestAnimationFrame(this.drawLoop);
    }
}
Game.MAX_FPS = 60;
// Dependency injection with a simple services container 
// inspired by: https://medium.com/@ismayilkhayredinov/building-a-scoped-ioc-container-for-node-express-8bf082d9887
// @TODO Might look into the "typescript way" to do this: 
// http://nicholasjohnson.com/blog/how-angular2-di-works-with-typescript/
window.game = new Game(Services());
// // Your web app's Firebase configuration.
// const firebaseConfig = {
//   apiKey: "AIzaSyADcpqiJ-igwgFdDJsuArjjrUY179TfEv4",
//   authDomain: "paratrooper-leaderboard.firebaseapp.com",
//   databaseURL: "https://paratrooper-leaderboard.firebaseio.com",
//   projectId: "paratrooper-leaderboard",
//   storageBucket: "paratrooper-leaderboard.appspot.com",
//   messagingSenderId: "831739944011",
//   appId: "1:831739944011:web:61cc3f577e1e5d418601ce"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
// // console.log(db);
// // Add a new document in collection "highscores"
// // db.collection("highscores").doc("score-2").set({
// //   name: "Karolien",
// //   score: 333
// // })
// //   .then(function () {
// //     console.log("Document successfully written!");
// //   })
// //   .catch(function (error) {
// //     console.error("Error writing document: ", error);
// //   });
// let citiesRef = db.collection('highscores');
// let query = citiesRef.orderBy('score', 'desc').limit(10).get()
//   .then(snapshot => {
//     if (snapshot.empty) {
//       console.log('No matching documents.');
//       return;
//     }
//     snapshot.forEach(doc => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch(err => {
//     console.log('Error getting documents', err);
//   });

module.exports = Game;
