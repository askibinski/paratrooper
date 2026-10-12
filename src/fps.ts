import Canvas from "./canvas";
import { isTyping } from "./utils";

// Frames per second counter, toggled with the F key.
export default class FPS {

  visible = false;
  private lastUpdate = performance.now();
  private frameCounter = 0;
  private fps = 0;

  constructor(readonly canvas: Canvas) {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyF' && !isTyping()) {
        this.visible = !this.visible;
      }
    });
  }

  run = (): void => {
    this.frameCounter++;
    if (performance.now() - this.lastUpdate >= 1000) {
      this.fps = this.frameCounter;
      this.frameCounter = 0;
      this.lastUpdate = performance.now();
    }

    if (this.visible) {
      this.canvas.text(`FPS:${this.fps}`, this.canvas.width - 20, 20, 40, 'right');
    }
  }

}
