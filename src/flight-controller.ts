import Heli from "./heli.js";
import Canvas from "./canvas.js";

export default class FlightController {

  static readonly HELI_HEIGHT_HIGH = 100;
  static readonly HELI_HEIGHT_LOW = 200;
  static readonly MAX_HELIS_START = 3;
  static readonly INCREASE_START_INTERVAL = 12;

  helis: Heli[];
  delay: object;
  maxHelis: number;
  newHelis: boolean;
  totalHelis: number;
  difficultyInterval: number;

  constructor(readonly canvas: Canvas) {
    this.helis = [];
    this.delay = { '-1': 0, '1': 0 };
    this.maxHelis = FlightController.MAX_HELIS_START;
    this.newHelis = true;
    this.totalHelis = 0;
    this.difficultyInterval = FlightController.INCREASE_START_INTERVAL;
  }

  set showNewHelis(show: boolean) {
    this.newHelis = show;
  }

  reset(): void {
    this.helis = [];
    this.maxHelis = FlightController.MAX_HELIS_START;
    this.newHelis = true;
    this.totalHelis = 0;
  }

  run(): void {

    // Every x choppers, increase the max number of choppers by one.
    if (this.totalHelis === this.difficultyInterval) {
      this.maxHelis++;
      this.difficultyInterval = 2 * this.difficultyInterval;
    }

    // Count down delay timer.
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
          this.totalHelis++;

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