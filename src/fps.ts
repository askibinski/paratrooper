import Canvas from "./canvas.js";

export default class FPS {

  lastUpdate: number;
  frameCounter: number;
  fps: string;

  constructor(readonly canvas: Canvas) {
    this.lastUpdate = performance.now();
    this.frameCounter = 0;
    this.fps = '';
  }

  run = (): void => {
    // Probably a very inacurate FPS counter. We'll see.
    this.frameCounter++;
    if (performance.now() - this.lastUpdate >= 1000) {
      this.fps = <string><unknown>this.frameCounter;
      this.frameCounter = 0;
      this.lastUpdate = performance.now();
    }

    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.font = "48px Courier";
    this.canvas.ctx.textAlign = "right"
    this.canvas.ctx.textBaseline = "top";
    this.canvas.ctx.fillText(`FPS:${this.fps}`, this.canvas.width - 10, this.canvas.height - 60);
  }

}