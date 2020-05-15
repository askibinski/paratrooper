import Heli from "./heli.js";
import Canvas from "./canvas.js";

export default class FlightController {

  static readonly HELI_HEIGHT_HIGH = 100;
  static readonly HELI_HEIGHT_LOW = 200;

  helis: Heli[];
  delay: object;
  maxHelis: number;

  constructor(readonly canvas: Canvas) {
    this.helis = [];
    this.delay = { '-1': 0, '1': 0 };
    this.maxHelis = 3;
  }

  run(): void {

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
        const heli = window.game.container.get('heli');
        heli.height = (toggle === -1) ? FlightController.HELI_HEIGHT_LOW : FlightController.HELI_HEIGHT_HIGH;
        heli.toggle = toggle;
        this.helis.push(heli);

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