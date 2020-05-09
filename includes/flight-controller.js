import Heli from "./heli.js";

export default class FlightController {

  constructor(canvas) {
    this.canvas = canvas;
    this.helis = [];
  }

  run() {


    // @TODO for now we just make some choppers. Later on, we will 
    // create "waves" and make fine tune the amount coming from 
    // the left and the right.
    if (this.helis.length < 5) {
      // 1% change each run to create a chopper.
      // @TODO prevent choppers from overlapping.
      if (this.getRndInteger(1, 100) === 1) {

        // 50% chance from which direction.
        let toggle;
        !!this.getRndInteger(0, 2) ? toggle = -1 : toggle = 1;
        this.heli = this.helis.push(new Heli(this.canvas, toggle * 1));
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