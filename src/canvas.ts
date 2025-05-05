export default class Canvas {

  static readonly WHITE = "#ffffff";
  static readonly PINK = '#fe52fc';
  static readonly BLACK = '#000000';
  static readonly BLUE = '#56faf7';
  static readonly RED = '#ff0000';
  static readonly ORANGE = '#ffa500';
  static readonly YELLOW = '#ffff00';
  static readonly GREEN = '#00ff00';
  static readonly CYAN = '#00ffff';

  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor() {
    // Select the elements on the page - canvas, reset button.
    const canvas = <HTMLCanvasElement>document.querySelector('#paratrooper');

    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  // Clear the canvas.
  clear = (): void => {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // Background color canvas.
  setup = (): void => {
    // Log canvas dimensions once
    if (!this._dimensionsLogged) {
      console.log("Canvas dimensions:", this.width, this.height);
      this._dimensionsLogged = true;
    }
    
    this.ctx.fillStyle = Canvas.BLACK;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  
  private _dimensionsLogged: boolean = false;

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