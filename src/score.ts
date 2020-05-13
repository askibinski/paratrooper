import Canvas from "./canvas.js";

export default class Score {

  canvas: Canvas;
  score: number;

  constructor(canvas: Canvas) {

    this.canvas = canvas;
    this.score = 0;

  }

  add = (amount: number) => {
    this.score = this.score + amount;
  }

  subtract = (amount: number) => {
    this.score = this.score - amount;
    if (this.score < 0) {
      this.score = 0;
    }
  }

  run = () => {
    let score = <string><unknown>this.score;
    this.canvas.ctx.fillStyle = this.canvas.WHITE;
    this.canvas.ctx.font = "48px Courier";
    this.canvas.ctx.textAlign = "left"
    this.canvas.ctx.textBaseline = "top";
    this.canvas.ctx.fillText(`SCORE:${score}`, 20, this.canvas.height - 60);
  }

}