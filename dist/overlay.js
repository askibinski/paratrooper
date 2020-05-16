import Canvas from "./canvas.js";
export default class Overlay {
    constructor(canvas) {
        this.canvas = canvas;
        this.run = () => {
            if (this.gameOver) {
                this.drawGameOver();
            }
        };
        this.drawGameOver = () => {
            this.canvas.ctx.fillStyle = Canvas.WHITE;
            this.canvas.ctx.font = "256px Courier";
            this.canvas.ctx.textAlign = "center";
            this.canvas.ctx.textBaseline = "middle";
            this.canvas.ctx.fillText(`GAME OVER`, this.canvas.width / 2, this.canvas.height / 2);
        };
        this.gameOver = false;
    }
    set gameOverStatus(status) {
        this.gameOver = status;
    }
}
