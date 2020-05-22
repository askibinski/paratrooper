import Heli from "./heli.js";
import Canvas from "./canvas.js";
export default class FlightController {
    readonly canvas: Canvas;
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
    constructor(canvas: Canvas);
    set showNewHelis(show: boolean);
    reset(): void;
    run(): void;
}
