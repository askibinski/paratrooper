import Canvas from "./canvas.js";
import Paratrooper from "./paratrooper.js";
import FlightController from "./flight-controller.js";
export default class TrooperController {
    readonly canvas: Canvas;
    readonly flightController: FlightController;
    troopers: Paratrooper[];
    troopersLandedLeft: Paratrooper[];
    troopersLandedRight: Paratrooper[];
    constructor(canvas: Canvas, flightController: FlightController);
    reset: () => void;
    run: () => void;
    landed: (trooper: Paratrooper) => void;
    createTrooper: (x: number, y: number) => void;
}
