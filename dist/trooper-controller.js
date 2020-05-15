export default class TrooperController {
    constructor(canvas) {
        this.canvas = canvas;
        // @TODO 1: we should round the x into the nearest 'grid'
        // so they stack.
        // @TODO 2: prevent on border and above turret
        this.createTrooper = (x, y) => {
            console.log(`create trooper at ${x}, ${y}.`);
            const trooper = window.game.container.get('paratrooper');
            trooper.jumpCoordinates = { x: x, y: y };
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
