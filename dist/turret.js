export default class Turret {
    constructor(canvas) {
        this.draw = () => {
            this.base();
            this.turretBaseTop();
            this.turretBaseBottom();
            this.turretBasePivot();
        };
        // Base.
        this.base = () => {
            this.canvas.ctx.fillStyle = this.canvas.WHITE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect((this.canvas.width / 2) - (this.canvas.BASE_WIDTH_HEIGHT / 2), (this.canvas.height - this.canvas.BASE_WIDTH_HEIGHT), this.canvas.BASE_WIDTH_HEIGHT, this.canvas.BASE_WIDTH_HEIGHT);
            this.canvas.ctx.fill();
        };
        // Turret base top (the rounded part).
        this.turretBaseTop = () => {
            this.canvas.ctx.fillStyle = this.canvas.PINK;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (this.canvas.BASE_WIDTH_HEIGHT + this.twh)), this.twh / 2, 1 * Math.PI, 0);
            this.canvas.ctx.fill();
        };
        // Turret base (square part).
        this.turretBaseBottom = () => {
            this.canvas.ctx.fillStyle = this.canvas.PINK;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.rect((this.canvas.width / 2) - (this.twh / 2), (this.canvas.height - this.canvas.BASE_WIDTH_HEIGHT - this.twh), this.twh, this.twh);
            this.canvas.ctx.fill();
        };
        // The pivot point.
        this.turretBasePivot = () => {
            this.canvas.ctx.fillStyle = this.canvas.BLUE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(this.canvas.width / 2, (this.canvas.height - (this.canvas.BASE_WIDTH_HEIGHT + this.twh)), this.twh / 8, 2 * Math.PI, 0);
            this.canvas.ctx.fill();
        };
        this.canvas = canvas;
        // Turret base width height. 
        this.twh = Math.round(this.canvas.BASE_WIDTH_HEIGHT / 3);
    }
}
