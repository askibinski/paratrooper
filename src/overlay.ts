import Canvas from "./canvas.js";

export default class Overlay {

  gameOver: boolean;

  constructor(readonly canvas: Canvas) {
    this.gameOver = false;
  }

  run = (): void => {
    if (this.gameOver) {
      this.drawGameOver();
    }
  }

  set gameOverStatus(status: boolean) {
    this.gameOver = status;
  }

  drawGameOver = (): void => {
    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.font = "256px Courier";
    this.canvas.ctx.textAlign = "center"
    this.canvas.ctx.textBaseline = "middle";
    this.canvas.ctx.fillText(`GAME OVER`, this.canvas.width / 2, this.canvas.height / 2);
  }

}