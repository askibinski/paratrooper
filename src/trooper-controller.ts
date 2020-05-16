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

  // We round the x to the nearest "grid" of 50, so we can actually
  // stack troopers (and the can be killed by shooting a trooper's
  // chute and letting him fall on another guy which already landed.
  createTrooper = (x: number, y: number) => {
    const gridFactor = Math.floor(x / 50);
    const trooper = window.game.container.get('paratrooper');
    trooper.jumpCoordinates = { x: gridFactor * 50, y: y };
    this.troopers.push(trooper);
  }

}