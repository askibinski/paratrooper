import Container from "./container.js";
import Canvas from "./canvas.js";
import Barrel from "./barrel.js";
import Turret from "./turret.js";
import FlightController from "./flight-controller.js";
import TrooperController from "./trooper-controller.js";
import Score from "./score.js";
import FPS from "./fps.js";
import Overlay from "./overlay.js";
export default class Game {
    readonly container: Container;
    static readonly MAX_FPS = 60;
    canvas: Canvas;
    turret: Turret;
    flightController: FlightController;
    trooperController: TrooperController;
    barrel: Barrel;
    score: Score;
    fps: FPS;
    overlay: Overlay;
    lastUpdate: number;
    fpsInterval: number;
    constructor(container: Container);
    drawLoop: () => void;
}
declare global {
    interface Window {
        game: Game;
    }
}
