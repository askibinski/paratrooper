import Heli from "./heli.js";
import Canvas from "./canvas.js";
import Game from "./index.js";
import TrooperController from "./trooper-controller.js";

export default class FlightController {

  HELI_HEIGHT_HIGH = 100;
  HELI_HEIGHT_LOW = 200;

  helis: Heli[];
  delay: object;
  maxHelis: number;

  constructor(readonly canvas: Canvas, protected trooperController: TrooperController) {
    this.helis = [];
    this.delay = { '-1': 0, '1': 0 };
    this.maxHelis = 3;
  }

  run() {

    for (let i in this.delay) {
      if (this.delay[i] > 0) {
        this.delay[i]--;
      }
    }

    // 50% chance from which direction.
    let toggle = !!this.canvas.getRndInteger(0, 2) ? -1 : 1;

    if (this.helis.length < this.maxHelis && this.delay[toggle] === 0) {
      // 0,5% change each run to create a chopper.
      if (this.canvas.getRndInteger(1, 1000) <= 15) {
        let height = toggle === -1 ? this.HELI_HEIGHT_LOW : this.HELI_HEIGHT_HIGH;
        this.helis.push(new Heli(this.canvas, this.trooperController, toggle * 1, height));

        // Create a delay so we don't immediately create a new heli.
        this.delay[toggle] = 30;
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