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
    this.canvas.ctx.font = "48px sans-serif";
    this.canvas.ctx.textAlign = "left"
    this.canvas.ctx.textBaseline = "top";
    this.canvas.ctx.fillText(this.fps, 1500, 1100);
  }

}