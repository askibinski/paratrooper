import Canvas from "./canvas.js";
export default class FPS {
    readonly canvas: Canvas;
    lastUpdate: number;
    frameCounter: number;
    fps: string;
    constructor(canvas: Canvas);
    run: () => void;
}
