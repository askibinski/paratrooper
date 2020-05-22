export default class Canvas {
    static readonly WHITE = "#ffffff";
    static readonly PINK = "#fe52fc";
    static readonly BLACK = "#000000";
    static readonly BLUE = "#56faf7";
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor();
    clear: () => void;
    setup: () => void;
    getRndInteger(min: number, max: number): number;
    shuffle(a: any[]): any[];
}
