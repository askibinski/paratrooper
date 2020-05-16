export default class TrooperController {
    constructor(canvas) {
        this.canvas = canvas;
        // @TODO 1: we should round the x into the nearest 'grid'
        // so they stack.
        this.createTrooper = (x, y) => {
            const gridFactor = Math.floor(x / 50);
            const trooper = window.game.container.get('paratrooper');
            trooper.jumpCoordinates = { x: gridFactor * 50, y: y };
            this.troopers.push(trooper);
        };
        this.troopers = [];
    }
    run() {
        this.troopers.forEach((trooper, index) => {
            if (trooper.isGone) {
                this.troopers.splice(index, 1);
                return;
            }
            trooper.run();
        });
    }
}
