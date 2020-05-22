import Canvas from "./canvas.js";
export default class Turret {
    readonly canvas: Canvas;
    static readonly BASE_WIDTH_HEIGHT = 200;
    static readonly SCORE_HEIGHT = 80;
    static readonly canvas: Canvas;
    twh: number;
    constructor(canvas: Canvas);
    draw: () => void;
    floor: () => void;
    base: () => void;
    turretBaseTop: () => void;
    turretBaseBottom: () => void;
    turretBasePivot: () => void;
}
