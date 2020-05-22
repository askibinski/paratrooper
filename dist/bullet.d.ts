import Canvas from "./canvas.js";
import Turret from "./turret.js";
import FlightController from "./flight-controller.js";
import TrooperController from "./trooper-controller.js";
import Score from "./score.js";
export default class Bullet {
    readonly canvas: Canvas;
    readonly turret: Turret;
    readonly flightController: FlightController;
    readonly trooperController: TrooperController;
    readonly score: Score;
    static readonly BULLET_WIDTH_HEIGHT = 10;
    static readonly BULLET_SPEED = 10;
    barrelPosition: number;
    bulletX: number;
    bulletY: number;
    isGone: boolean;
    constructor(canvas: Canvas, turret: Turret, flightController: FlightController, trooperController: TrooperController, score: Score);
    set aim(position: number);
    draw: () => void;
    checkHeliHit: () => void;
    checkTrooperHit: () => void;
    wentOffCanvas: () => boolean;
}
