import Container from "./container.js";
import Services from "./services.js";
import Canvas from "./canvas.js";
import Barrel from "./barrel.js";
import Turret from "./turret.js";
import FlightController from "./flight-controller.js";
import TrooperController from "./trooper-controller.js";
import Score from "./score.js";
import FPS from "./fps.js";
import Overlay from "./overlay.js";

export default class Game {

  static readonly MAX_FPS = 60;

  canvas: Canvas;
  turret: Turret;
  flightController: FlightController;
  trooperController: TrooperController;
  barrel: Barrel;
  score: Score;
  fps: FPS;
  overlay: Overlay;
  lastUpdate: number;
  fpsInterval: number;

  constructor(readonly container: Container) {
    this.canvas = container.get('canvas');
    this.turret = container.get('turret');
    this.trooperController = container.get('trooperController');
    this.flightController = container.get('flightController');
    this.score = container.get('score');
    this.barrel = container.get('barrel');
    this.overlay = container.get('overlay');

    // This shows the FPS on screen.
    this.fps = container.get('fps');

    this.lastUpdate = performance.now();
    this.fpsInterval = Math.round(1000 / Game.MAX_FPS);
    window.requestAnimationFrame(this.drawLoop);
  }

  // Draw all the things.
  // TODO: later on, we will probably just loop through all our objects 
  // and call the draw() function.
  drawLoop = (): void => {
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
      this.fps.run();
      this.overlay.run();
      this.lastUpdate = now - (elapsed % this.fpsInterval);
    }

    window.requestAnimationFrame(this.drawLoop);
  }

}

// Putting the game in the global namespace so we can access the
// container from anywhere.
declare global {
  interface Window {
    game: Game;
  }
}

// Dependency injection with a simple services container 
// inspired by: https://medium.com/@ismayilkhayredinov/building-a-scoped-ioc-container-for-node-express-8bf082d9887
// @TODO Might look into the "typescript way" to do this: 
// http://nicholasjohnson.com/blog/how-angular2-di-works-with-typescript/
window.game = new Game(Services());