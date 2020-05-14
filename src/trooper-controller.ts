import Canvas from "./canvas.js";
import Paratrooper from "./paratrooper.js";

export default class TrooperController {

  troopers: Paratrooper[];

  constructor(readonly canvas: Canvas) {
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

  createTrooper = (x: number, y: number) => {
    console.log(`create trooper at ${x}, ${y}.`);
    this.troopers.push(new Paratrooper(this.canvas, x, y));
  }

}