import Canvas from "./canvas.js";
import Highscores from "./highscores.js";
import TrooperController from "./trooper-controller.js";
import FlightController from "./flight-controller.js";
import Score from "./score.js";
export default class Overlay {
    readonly canvas: Canvas;
    readonly trooperController: TrooperController;
    readonly flightController: FlightController;
    readonly highscores: Highscores;
    readonly score: Score;
    gameOver: boolean;
    table: HTMLTableElement;
    form: HTMLFormElement;
    wrapper: HTMLElement;
    timer: number;
    constructor(canvas: Canvas, trooperController: TrooperController, flightController: FlightController, highscores: Highscores, score: Score);
    reset: () => void;
    run: () => void;
    set gameOverStatus(status: boolean);
    restart: () => void;
    drawGrayOverlay: () => void;
    drawGameOver: () => void;
    drawHighScores: () => void;
}
