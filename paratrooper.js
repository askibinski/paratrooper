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

    this.rotateLeft = false;
    this.rotateRight = false;
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
          this.rotateLeft = false;
          this.rotateRight = false;
          // @TODO shoots. Duh.
          break;

        case 'ArrowLeft':
          if (this.barrelPosition > -0.50) {
            this.rotateLeft = true;
            this.rotateRight = false;
          }
          break;   
          
        case 'ArrowRight':
          if (this.barrelPosition < 0.50) {
            this.rotateLeft = false;
            this.rotateRight = true;
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
    // Barrel width.
    const bw = Math.round(this.twh/3);
    this.ctx.save();
    this.ctx.fillStyle = this.BLUE;

    // @TODO refactor these parts below.
    if (!this.rotateLeft && !this.rotateRight) {
      this.ctx.translate(this.width/2, (this.height - this.BASE_WIDTH_HEIGHT - this.twh));
      this.ctx.rotate(this.barrelPosition * Math.PI);
      this.ctx.translate(-this.width/2, -(this.height - this.BASE_WIDTH_HEIGHT - this.twh));
    }

    // We rotate the barrel half an arc left and right: from -0.5 Pi to 0.5 Pi.
    if (this.rotateLeft) {
      this.barrelPosition = this.barrelPosition - this.BARREL_ROTATE_SPEED;
      this.ctx.translate(this.width/2, (this.height - this.BASE_WIDTH_HEIGHT - this.twh));
      this.ctx.rotate(this.barrelPosition * Math.PI);
      this.ctx.translate(-this.width/2, -(this.height - this.BASE_WIDTH_HEIGHT - this.twh));
      if (this.barrelPosition <= -0.5) {
        this.barrelPosition = -0.5;
        this.rotateLeft = false;
      }
    }

    if (this.rotateRight) {
      this.barrelPosition = this.barrelPosition + this.BARREL_ROTATE_SPEED;
      this.ctx.translate(this.width/2, (this.height - this.BASE_WIDTH_HEIGHT - this.twh));
      this.ctx.rotate(this.barrelPosition * Math.PI);
      this.ctx.translate(-this.width/2, -(this.height - this.BASE_WIDTH_HEIGHT - this.twh));
      if (this.barrelPosition >= 0.5) {
        this.barrelPosition = 0.5;
        this.rotateRight = false;
      }
    }

    this.ctx.beginPath();
    this.ctx.rect((this.width/2 - Math.round(bw)/2), (this.height - this.BASE_WIDTH_HEIGHT - (this.twh*2)), bw, this.twh);
    this.ctx.fill();
    this.ctx.restore();

  }

}

const Game = new Paratrooper;