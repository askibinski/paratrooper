import Canvas from "./canvas";

export default class Score {

  score = 0;

  constructor(readonly canvas: Canvas) { }

  add = (amount: number): void => {
    this.score += amount;
  }

  subtract = (amount: number): void => {
    this.score = Math.max(0, this.score - amount);
  }

  reset = (): void => {
    this.score = 0;
  }

  run = (): void => {
    this.canvas.text(`SCORE:${this.score}`, 20, this.canvas.height - 60, 48);
  }

}
