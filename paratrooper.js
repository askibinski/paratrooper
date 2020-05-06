import Canvas from "./includes/canvas.js";
import Barrel from "./includes/barrel.js";
import Turret from "./includes/turret.js";
import FPS from "./includes/fps.js";
import Heli from "./includes/heli.js";

export default class Paratrooper {

  constructor() {
    this.canvas = new Canvas;
    // Simple dependency injection will do for now.
    // Might do proper DI later with a container.
    // Example: https://dev.to/azure/dependency-injection-in-javascript-101-2b1e
    this.turret = new Turret(this.canvas);
    this.barrel = new Barrel(this.canvas, this.turret);
    this.heli = new Heli(this.canvas);

    
    this.fps = new FPS(this.canvas);

    window.requestAnimationFrame(this.drawLoop);
  }

  // Draw all the things.
  // TODO: later on, we will probably just loop through all our objects 
  // and call the draw() function.
  drawLoop = () => {
    this.canvas.clear();
    this.canvas.setup();
    this.barrel.draw();
    this.turret.draw();

    this.heli.draw();

    this.fps.showFPS();

    window.requestAnimationFrame(this.drawLoop);
  }
  
}

new Paratrooper;