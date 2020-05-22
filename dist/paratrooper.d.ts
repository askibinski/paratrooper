import Canvas from "./canvas.js";
import TrooperController from "./trooper-controller.js";
import Score from "./score.js";
export default class Paratrooper {
    readonly canvas: Canvas;
    readonly trooperController: TrooperController;
    readonly score: Score;
    static readonly CHUTE_RADIUS = 30;
    static readonly CHUTE_LINE_WIDTH = 5;
    static readonly TROOPER_HEAD_SIZE = 12;
    static readonly JUMP_Y_OFFSET = 50;
    static readonly FALL_SPEED = 1;
    isGone: boolean;
    deployedChute: boolean;
    hasChute: boolean;
    hasLanded: boolean;
    readyForAction: boolean;
    troopersLandedHere: Paratrooper[];
    x: number;
    y: number;
    constructor(canvas: Canvas, trooperController: TrooperController, score: Score);
    set jumpCoordinates(coordinates: {
        x: number;
        y: number;
    });
    run: () => void;
    parachute: () => void;
    trooper: () => void;
}
