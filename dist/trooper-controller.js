import Paratrooper from "./paratrooper.js";
export default class TrooperController {
    constructor(canvas) {
        this.canvas = canvas;
        this.createTrooper = (x, y) => {
            console.log(`create trooper at ${x}, ${y}.`);
            this.troopers.push(new Paratrooper(this.canvas, x, y));
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
