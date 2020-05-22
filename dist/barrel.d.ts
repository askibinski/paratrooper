import Canvas from "./canvas.js";
import Turret from "./turret.js";
import Bullet from "./bullet.js";
import FlightController from "./flight-controller.js";
export default class Barrel {
    readonly canvas: Canvas;
    readonly turret: Turret;
    readonly flightController: FlightController;
    static readonly ROTATE_SPEED = 0.01;
    barrelPosition: number;
    rotateDirection: number;
    bullets: Bullet[];
    constructor(canvas: Canvas, turret: Turret, flightController: FlightController);
    handleKey: (e: KeyboardEvent) => void;
    draw: () => void;
}
