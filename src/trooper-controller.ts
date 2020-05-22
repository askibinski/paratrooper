import Canvas from "./canvas.js";
import Paratrooper from "./paratrooper.js";
import FlightController from "./flight-controller.js";

export default class TrooperController {

  troopers: Paratrooper[];
  troopersLandedLeft: Paratrooper[];
  troopersLandedRight: Paratrooper[];

  constructor(readonly canvas: Canvas, readonly flightController: FlightController) {
    this.troopers = [];
    this.troopersLandedLeft = [];
    this.troopersLandedRight = [];
  }

  reset = (): void => {
    this.troopers = [];
    this.troopersLandedLeft = [];
    this.troopersLandedRight = [];
  }

  run = (): void => {
    this.troopers.forEach((trooper, index) => {
      if (trooper.isGone) {
        this.troopers.splice(index, 1);
        return;
      }
      // If the paratrooper landed safely, mark him ready for
      // action and sort him into the area.
      if (trooper.hasLanded && !trooper.readyForAction) {
        this.landed(trooper);
        trooper.readyForAction = true;
        return;
      }
      trooper.run();
    });
  }

  landed = (trooper: Paratrooper): void => {
    if (trooper.x < this.canvas.width / 2) {
      this.troopersLandedLeft.push(trooper);
    }
    if (trooper.x > this.canvas.width / 2) {
      this.troopersLandedRight.push(trooper);
    }
  }

  // We round the x to the nearest "grid" of 50, so we can actually
  // stack troopers (and the can be killed by shooting a trooper's
  // chute and letting him fall on another guy which already landed.
  createTrooper = (x: number, y: number): void => {
    const gridFactor = Math.floor(x / 50);
    const trooper = window.game.container.get('paratrooper');
    trooper.jumpCoordinates = { x: gridFactor * 50, y: y };
    this.troopers.push(trooper);
  }

}