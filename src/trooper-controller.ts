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

  // @TODO 1: we should round the x into the nearest 'grid'
  // so they stack.
  createTrooper = (x: number, y: number) => {
    const gridFactor = Math.floor(x / 50);
    const trooper = window.game.container.get('paratrooper');
    trooper.jumpCoordinates = { x: gridFactor * 50, y: y };
    this.troopers.push(trooper);
  }

}