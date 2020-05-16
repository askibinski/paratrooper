export default class TrooperController {
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
                // console.log(this.troopers);
                // console.log(this.troopersLandedLeft);
                // console.log(this.troopersLandedRight);
            });
            if (this.troopersLandedLeft.length >= 4 || this.troopersLandedRight.length >= 4) {
                console.log('GAME OVER');
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
