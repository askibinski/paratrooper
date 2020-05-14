import Canvas from "./canvas.js";
import Barrel from "./barrel.js";
import Turret from "./turret.js";
import FlightController from "./flight-controller.js";
import TrooperController from "./trooper-controller.js";
import Score from "./score.js";
import FPS from "./fps.js";

export default class Game {

  MAX_FPS = 60;

  canvas: Canvas;
  turret: Turret;
  flightController: FlightController;
  trooperController: TrooperController;
  barrel: Barrel;
  score: Score;
  fps: FPS;
  lastUpdate: number;
  fpsInterval: number;

  constructor() {
    this.canvas = new Canvas;
    // Simple dependency injection will do for now.
    // Might do proper DI later with a container or something.
    // Example: https://dev.to/azure/dependency-injection-in-javascript-101-2b1e
    // Ooh better!! http://nicholasjohnson.com/blog/how-angular2-di-works-with-typescript/
    this.turret = new Turret(this.canvas);
    this.trooperController = new TrooperController(this.canvas);
    this.flightController = new FlightController(this.canvas, this.trooperController);
    this.score = new Score(this.canvas);
    this.barrel = new Barrel(this.canvas, this.turret, this.flightController, this.score);

    // This shows the FPS on screen.
    this.fps = new FPS(this.canvas);

    this.lastUpdate = performance.now();
    this.fpsInterval = Math.round(1000 / this.MAX_FPS);
    window.requestAnimationFrame(this.drawLoop);
  }

  get getCanvas() {
    return this.canvas;
  }

  // Draw all the things.
  // TODO: later on, we will probably just loop through all our objects 
  // and call the draw() function.
  drawLoop = () => {
    let now = performance.now();
    let elapsed = now - this.lastUpdate;
    // We want to set a max FPS otherwise the game will run faster on 
    // superfast computers. It still will run (a bit) slower on machines 
    // which can't handle the desired FPS.
    if (elapsed > this.fpsInterval) {
      this.canvas.clear();
      this.canvas.setup();
      this.barrel.draw();
      this.flightController.run();
      this.trooperController.run();
      this.turret.draw();
      this.score.run();
      this.fps.showFPS();
      this.lastUpdate = now - (elapsed % this.fpsInterval);
    }

    window.requestAnimationFrame(this.drawLoop);
  }

}

new Game;