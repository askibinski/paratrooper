import Canvas from "./canvas.js";

export default class Paratrooper {

  static readonly CHUTE_RADIUS = 50;

  // @todo 1 add return types for all functions.
  // @todo 2 add readonly.
  // @todo 3 static properties.
  // @todo 4 dependency injection with typescript?

  isGone: boolean;

  constructor(readonly canvas: Canvas, readonly x: number, readonly y: number) {
    this.isGone = false;
  }

  run = (): void => {
    //this.parachute();
  }

  parachute = (): void => {
    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.beginPath();
    this.canvas.ctx.arc(this.x, this.y + 100, Paratrooper.CHUTE_RADIUS, 1 * Math.PI, 0);
    this.canvas.ctx.fill();
  }

  trooper = (): void => {

  }

}