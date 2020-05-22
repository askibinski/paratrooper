import Canvas from "./canvas.js";
export default class Score {
    readonly canvas: Canvas;
    score: number;
    constructor(canvas: Canvas);
    add: (amount: number) => void;
    subtract: (amount: number) => void;
    run: () => void;
}
