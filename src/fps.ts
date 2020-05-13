import Canvas from "./canvas.js";

export default class FPS {

  canvas: Canvas;
  lastUpdate: number;
  frameCounter: number;
  fps: string;

  constructor(canvas: Canvas) {

    this.canvas = canvas;
    this.lastUpdate = performance.now();
    this.frameCounter = 0;
    this.fps = '';

  }

  showFPS = () => {
    // Probably a very inacurate FPS counter. We'll see.
    this.frameCounter++;
    if (performance.now() - this.lastUpdate >= 1000) {
      this.fps = <string><unknown>this.frameCounter;
      this.frameCounter = 0;
      this.lastUpdate = performance.now();
    }

    this.canvas.ctx.fillStyle = this.canvas.WHITE;
    this.canvas.ctx.font = "48px Courier";
    this.canvas.ctx.textAlign = "right"
    this.canvas.ctx.textBaseline = "top";
    this.canvas.ctx.fillText(`FPS:${this.fps}`, this.canvas.width - 10, this.canvas.height - 60);
  }

}