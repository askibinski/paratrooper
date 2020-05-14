export default class Paratrooper {
    constructor(canvas, x, y) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.CHUTE_RADIUS = 50;
        this.run = () => {
            this.parachute();
        };
        this.parachute = () => {
            this.canvas.ctx.fillStyle = this.canvas.WHITE;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.arc(this.x, this.y + 100, this.CHUTE_RADIUS, 1 * Math.PI, 0);
            this.canvas.ctx.fill();
        };
        this.trooper = () => {
        };
        this.isGone = false;
    }
}
