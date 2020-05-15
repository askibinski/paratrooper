export default class Canvas {

  static readonly WHITE = "#ffffff";
  static readonly PINK = '#fe52fc';
  static readonly BLACK = '#000000';
  static readonly BLUE = '#56faf7';

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor() {
    // Select the elements on the page - canvas, reset button.
    const canvas = <HTMLCanvasElement>document.querySelector('#paratrooper');

    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    document.querySelector('#instructions').addEventListener('click', () => { alert('Use arrow keys (left, right and up).') });
  }

  // Clear the canvas.
  clear = (): void => {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // Background color canvas.
  setup = (): void => {
    this.ctx.fillStyle = Canvas.BLACK;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Get a random integer in a certain range.
  getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Shuffle an array.
  shuffle(a: any[]): any[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

}