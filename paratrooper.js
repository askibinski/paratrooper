class Paratrooper {

  BASE_WIDTH_HEIGHT = 200;
  WHITE = "#ffffff";
  PINK = '#fe52fc';
  BLACK = '#000000';
  BLUE = '#56faf7';
  BARREL_ROTATE_SPEED = 0.01;

  constructor() {

    // Select the elements on the page - canvas, reset button.
    const canvas = document.querySelector('#paratrooper');

    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // FPS.
    this.lastUpdate = performance.now();
    this.frameCounter = 0;
    this.fps = 0;

    // Turret base width height.
    this.twh = Math.round(this.BASE_WIDTH_HEIGHT/3);

    window.requestAnimationFrame(this.drawLoop);

    window.addEventListener('keydown', this.handleKey);

    this.rotateDirection = 0;
    this.barrelPosition = 0;
  }

  showFPS = () => {
    this.ctx.fillStyle = this.WHITE;
    this.ctx.font = "48px sans-serif";
    this.ctx.textAlign = "left"
    this.ctx.textBaseline = "top";
    this.ctx.fillText(this.fps, 100, 100);
  }

  // Handle aiming and shooting with the keys.
  handleKey = (e) => {
    if (e.key.includes('Arrow')) {
      switch(e.key) {
        case 'ArrowUp':
          // Stops the barrel and shoots.
          this.rotateDirection = 0;
          // @TODO shoots. Duh.
          break;

        case 'ArrowLeft':
          if (this.barrelPosition > -0.50) {
            this.rotateDirection = -1;
          }
          break;   
          
        case 'ArrowRight':
          if (this.barrelPosition < 0.50) {
            this.rotateDirection = 1;
          }
          break;

        default:
          break; 

      }
      e.preventDefault();
    }
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
  drawLoop = () => {
    this.frameCounter++;

    this.clearCanvas();
    this.setupCanvas();
    this.base();
    this.barrel();
    this.turretBaseBottom();
    this.turretBaseTop();

    // Probably a very inacurate FPS counter. We'll see.
    if (performance.now() - this.lastUpdate >= 1000) {
      this.fps = this.frameCounter;
      this.frameCounter = 0;
      this.lastUpdate = performance.now();
    }
    this.showFPS();

    window.requestAnimationFrame(this.drawLoop);
  }

  // Base.
  base = () => {
    this.ctx.fillStyle = this.WHITE;
    this.ctx.beginPath();
    this.ctx.rect((this.width/2) - (this.BASE_WIDTH_HEIGHT/2), (this.height - this.BASE_WIDTH_HEIGHT), this.BASE_WIDTH_HEIGHT, this.BASE_WIDTH_HEIGHT);
    this.ctx.fill();

  }
  
  // Turret base (square part).
  turretBaseBottom = () => {
    this.ctx.fillStyle = this.PINK;
    this.ctx.beginPath();
    this.ctx.rect((this.width/2) - (this.twh/2), (this.height - this.BASE_WIDTH_HEIGHT - this.twh), this.twh , this.twh);
    this.ctx.fill();
  }
  
  // Turret base top (the rounded part).
  turretBaseTop = () => {
    this.ctx.fillStyle = this.PINK;
    this.ctx.beginPath();
    this.ctx.arc(this.width/2, (this.height - (this.BASE_WIDTH_HEIGHT + this.twh)), this.twh/2, 1 * Math.PI, 0);
    this.ctx.fill();
  }

  // The barrel itself.
  barrel = () => {

    // Rotate takes -1 (left), 1 (right) or 0 (stop) as rotating direction.
    const rotate = (dir) => {
      this.barrelPosition = this.barrelPosition + (dir * this.BARREL_ROTATE_SPEED);
      this.ctx.translate(this.width/2, (this.height - this.BASE_WIDTH_HEIGHT - this.twh));
      this.ctx.rotate(this.barrelPosition * Math.PI);
      this.ctx.translate(-this.width/2, -(this.height - this.BASE_WIDTH_HEIGHT - this.twh));
      if (dir && (this.barrelPosition <= -0.5 || this.barrelPosition >= 0.5)) {
        this.barrelPosition = (dir * 0.5);
        this.rotateDirection = 0;
      }
    }

    // Save the state, keeping it clean.
    this.ctx.save();

    rotate(this.rotateDirection);

    // This is the actual drawing of the barrel.
    this.ctx.fillStyle = this.BLUE;
    this.ctx.beginPath();
    // Barrel width.
    const bw = Math.round(this.twh/3);
    this.ctx.rect((this.width/2 - Math.round(bw)/2), (this.height - this.BASE_WIDTH_HEIGHT - (this.twh*2)), bw, this.twh);
    this.ctx.fill();
    this.ctx.restore();
  }

}

const Game = new Paratrooper;