import Container from "./container";
import Services, { ServiceMap } from "./services";
import Canvas from "./canvas";
import GameState from "./game-state";
import Effects from "./effects";
import Barrel from "./barrel";
import Turret from "./turret";
import FlightController from "./flight-controller";
import TrooperController from "./trooper-controller";
import Score from "./score";
import FPS from "./fps";
import Overlay from "./overlay";

export default class Game {

  static readonly MAX_FPS = 60;

  canvas: Canvas;
  state: GameState;
  effects: Effects;
  turret: Turret;
  barrel: Barrel;
  flightController: FlightController;
  trooperController: TrooperController;
  score: Score;
  fps: FPS;
  overlay: Overlay;
  private lastUpdate = performance.now();
  private readonly fpsInterval = 1000 / Game.MAX_FPS;
  private pauseDrawn = false;

  constructor(readonly container: Container<ServiceMap>) {
    this.canvas = container.get('canvas');
    this.state = container.get('state');
    this.effects = container.get('effects');
    this.turret = container.get('turret');
    this.barrel = container.get('barrel');
    this.flightController = container.get('flightController');
    this.trooperController = container.get('trooperController');
    this.score = container.get('score');
    this.fps = container.get('fps');
    this.overlay = container.get('overlay');

    window.requestAnimationFrame(this.loop);
  }

  // We want to set a max FPS otherwise the game will run faster on screens
  // with a high refresh rate. It still will run (a bit) slower on machines
  // which can't handle the desired FPS.
  loop = (now: number): void => {
    window.requestAnimationFrame(this.loop);

    // Allow a little jitter, so a 60Hz screen doesn't skip frames.
    if (now - this.lastUpdate < this.fpsInterval - 2) return;
    this.lastUpdate += this.fpsInterval;
    // Don't try to catch up after a hiccup (or a background tab).
    if (now - this.lastUpdate > this.fpsInterval) {
      this.lastUpdate = now;
    }

    if (this.state.paused) {
      if (!this.pauseDrawn) {
        this.overlay.drawPause();
        this.pauseDrawn = true;
      }
      return;
    }
    this.pauseDrawn = false;

    try {
      this.frame();
    } catch (e) {
      console.error('Error while drawing a frame', e);
    }
  }

  // Update and draw all the things, back to front.
  frame = (): void => {
    this.state.tick();
    this.canvas.clear();
    this.barrel.run();
    this.flightController.run();
    this.trooperController.run();
    this.turret.draw();
    this.effects.run();
    this.score.run();
    this.flightController.drawHud();
    this.fps.run();
    this.overlay.run();
  }

  restart = (): void => {
    this.state.reset();
    this.score.reset();
    this.barrel.reset();
    this.flightController.reset();
    this.trooperController.reset();
    this.effects.reset();
    this.overlay.reset();
    this.canvas.stopShake();
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
window.game = new Game(Services());
