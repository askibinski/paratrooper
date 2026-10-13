export default class Canvas {

  static readonly WHITE = '#ffffff';
  static readonly PINK = '#fe52fc';
  static readonly BLACK = '#000000';
  static readonly BLUE = '#56faf7';

  // The strip at the bottom of the canvas which shows the score.
  static readonly HUD_HEIGHT = 80;
  static readonly FONT = 'Courier, monospace';

  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor() {
    const element = document.querySelector<HTMLCanvasElement>('#paratrooper');
    const ctx = element?.getContext('2d');
    if (!element || !ctx) {
      throw new Error('Could not find the #paratrooper canvas.');
    }

    this.element = element;
    this.ctx = ctx;
    this.width = element.width;
    this.height = element.height;
  }

  // The y coordinate of the ground everything lands on.
  get groundY(): number {
    return this.height - Canvas.HUD_HEIGHT;
  }

  get centerX(): number {
    return this.width / 2;
  }

  // Clear the canvas with the background color.
  clear = (): void => {
    this.ctx.fillStyle = Canvas.BLACK;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  text = (text: string, x: number, y: number, size: number, align: CanvasTextAlign = 'left', color = Canvas.WHITE, baseline: CanvasTextBaseline = 'top'): void => {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px ${Canvas.FONT}`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, x, y);
  }

  // Shake the canvas element (CSS animation), e.g. for big explosions.
  shake = (): void => {
    this.element.classList.remove('shake');
    // Force a reflow so the animation restarts.
    void this.element.offsetWidth;
    this.element.classList.add('shake');
  }

  stopShake = (): void => {
    this.element.classList.remove('shake');
  }

}
