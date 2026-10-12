import Canvas from "./canvas";
import Highscores from "./highscores";

export default class Score {

  score = 0;
  // The best score so far (from the highscores, or the current game).
  best = 0;

  constructor(readonly canvas: Canvas, readonly highscores: Highscores) {
    this.reset();
  }

  add = (amount: number): void => {
    this.score += amount;
  }

  subtract = (amount: number): void => {
    this.score = Math.max(0, this.score - amount);
  }

  reset = (): void => {
    this.score = 0;
    this.best = this.highscores.load()[0]?.score ?? 0;
  }

  run = (): void => {
    this.best = Math.max(this.best, this.score);
    this.canvas.text(`SCORE:${this.score}`, 20, this.canvas.height - 60, 48);
    this.canvas.text(`HI:${this.best}`, this.canvas.width - 20, this.canvas.height - 60, 48, 'right');
  }

}
