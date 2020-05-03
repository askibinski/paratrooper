class Paratrooper {

  BASE_WIDTH_HEIGHT = 200;
  WHITE = "#ffffff";
  PINK = '#fe52fc';
  BLACK = '#000000';
  BLUE = '#56faf7';

  constructor() {

    // select the elements on the page - canvas, reset button
    const canvas = document.querySelector('#paratrooper');

    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // Turret base width height.
    this.twh = Math.round(this.BASE_WIDTH_HEIGHT/3);

    window.requestAnimationFrame(this.draw);
  }

  // Background color canvas.
  setupCanvas = () => {
    this.ctx.fillStyle = this.BLACK;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Clear the canvas.
  clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // Draw all the things.
  draw = () => {
    // @TODO add FPS counter.
    console.log('draw!');
    this.clearCanvas();
    this.setupCanvas();
    this.base();
    this.turretBaseBottom();
    this.turretBaseTop();
    this.barrel();

    window.requestAnimationFrame(this.draw);
  }

  // Base.
  base = () => {
    this.ctx.fillStyle = this.WHITE;
    this.ctx.beginPath();
    this.ctx.rect((this.width/2) - (this.BASE_WIDTH_HEIGHT/2), (this.height - this.BASE_WIDTH_HEIGHT), this.BASE_WIDTH_HEIGHT, this.BASE_WIDTH_HEIGHT);
    this.ctx.fill();

  }
  
  // Turret base.
  turretBaseBottom = () => {
    this.ctx.fillStyle = this.PINK;
    this.ctx.beginPath();
    this.ctx.rect((this.width/2) - (this.twh/2), (this.height - this.BASE_WIDTH_HEIGHT - this.twh), this.twh , this.twh);
    this.ctx.fill();
  }
  
  // Turret barrel.
  turretBaseTop = () => {
    this.ctx.fillStyle = this.PINK;
    this.ctx.beginPath();
    this.ctx.arc(this.width/2, (this.height - (this.BASE_WIDTH_HEIGHT + this.twh)), this.twh/2, 1 * Math.PI, 0);
    this.ctx.fill();
  }

  barrel = () => {
    // Barrel width.
    const bw = Math.round(this.twh/3);
    // Performance.now() returns milliseconds.
    const time = performance.now();
    this.ctx.save();
    this.ctx.fillStyle = this.BLUE;
    this.ctx.translate(this.width/2, (this.height - this.BASE_WIDTH_HEIGHT - this.twh));
    this.ctx.rotate(((2 * Math.PI) / 6) * (time / 1000) + ((2 * Math.PI) / 6000) * time);
    this.ctx.translate(-this.width/2, -(this.height - this.BASE_WIDTH_HEIGHT - this.twh));
    this.ctx.beginPath();
    this.ctx.rect((this.width/2 - Math.round(bw)/2), (this.height - this.BASE_WIDTH_HEIGHT - (this.twh*2)), bw, this.twh);
    this.ctx.fill();
    this.ctx.restore();

  }

}

const Game = new Paratrooper;