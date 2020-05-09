import Heli from "./heli.js";

export default class FlightController {

  HELI_HEIGHT_HIGH = 100;
  HELI_HEIGHT_LOW = 200;

  constructor(canvas) {
    this.canvas = canvas;
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
    let toggle = !!this.getRndInteger(0, 2) ? -1 : 1;
    
    if (this.helis.length < this.maxHelis && this.delay[toggle] === 0) {
      // 0,5% change each run to create a chopper.
      if (this.getRndInteger(1, 1000) <= 15) {
        let height = toggle === -1 ? this.HELI_HEIGHT_LOW : this.HELI_HEIGHT_HIGH;
        this.heli = this.helis.push(new Heli(this.canvas, toggle * 1, height));

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

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }


}