import Canvas from "./canvas.js";
export default class Turret {
    constructor(canvas) {
        this.canvas = canvas;
        this.draw = () => {
            this.base();
            this.turretBaseTop();
            this.turretBaseBottom();
            this.turretBasePivot();
            this.floor();
        };
        this.floor = () => {
            this.canvas.ctx.fillStyle = Canvas.BLACK;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect(0, (this.canvas.height - Turret.SCORE_HEIGHT), this.canvas.width, Turret.SCORE_HEIGHT);
            this.canvas.ctx.fill();
            this.canvas.ctx.strokeStyle = Canvas.BLUE;
            this.canvas.ctx.lineWidth = 3;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(0, (this.canvas.height - Turret.SCORE_HEIGHT));
            this.canvas.ctx.lineTo(this.canvas.width, (this.canvas.height - Turret.SCORE_HEIGHT));
            this.canvas.ctx.stroke();
        };
        // Base.
        this.base = () => {
            this.canvas.ctx.fillStyle = Canvas.WHITE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect((this.canvas.width / 2) - (Turret.BASE_WIDTH_HEIGHT / 2), (this.canvas.height - Turret.BASE_WIDTH_HEIGHT - Turret.SCORE_HEIGHT), Turret.BASE_WIDTH_HEIGHT, Turret.BASE_WIDTH_HEIGHT);
            this.canvas.ctx.fill();
        };
        // Turret base top (the rounded part).
        this.turretBaseTop = () => {
            this.canvas.ctx.fillStyle = Canvas.PINK;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (Turret.BASE_WIDTH_HEIGHT + this.twh + Turret.SCORE_HEIGHT)), this.twh / 2, 1 * Math.PI, 0);
            this.canvas.ctx.fill();
        };
        // Turret base (square part).
        this.turretBaseBottom = () => {
            this.canvas.ctx.fillStyle = Canvas.PINK;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect((this.canvas.width / 2) - (this.twh / 2), (this.canvas.height - Turret.BASE_WIDTH_HEIGHT - this.twh - Turret.SCORE_HEIGHT), this.twh, this.twh);
            this.canvas.ctx.fill();
        };
        // The pivot point.
        this.turretBasePivot = () => {
            this.canvas.ctx.fillStyle = Canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (Turret.BASE_WIDTH_HEIGHT + this.twh + Turret.SCORE_HEIGHT)), this.twh / 8, 2 * Math.PI, 0);
            this.canvas.ctx.fill();
        };
        // Turret base width height. 
        this.twh = Math.round(Turret.BASE_WIDTH_HEIGHT / 3);
    }
}
Turret.BASE_WIDTH_HEIGHT = 200;
Turret.SCORE_HEIGHT = 80;
