import Container from "./container";
import Canvas from "./canvas";
import GameState from "./game-state";
import Sound from "./sound";
import Effects from "./effects";
import Barrel from "./barrel";
import Bullet from "./bullet";
import Turret from "./turret";
import FlightController from "./flight-controller";
import TrooperController from "./trooper-controller";
import Score from "./score";
import FPS from "./fps";
import Heli from "./heli";
import Jet from "./jet";
import Bomb from "./bomb";
import Paratrooper from "./paratrooper";
import Overlay from "./overlay";
import Highscores from "./highscores";

export interface ServiceMap {
  canvas: Canvas;
  state: GameState;
  sound: Sound;
  effects: Effects;
  turret: Turret;
  barrel: Barrel;
  bullet: Bullet;
  flightController: FlightController;
  trooperController: TrooperController;
  score: Score;
  fps: FPS;
  heli: Heli;
  jet: Jet;
  bomb: Bomb;
  paratrooper: Paratrooper;
  overlay: Overlay;
  highscores: Highscores;
}

export default (): Container<ServiceMap> => {

  const container = new Container<ServiceMap>();

  container.singleton('canvas', Canvas);
  container.singleton('state', GameState);
  container.singleton('sound', Sound);
  container.singleton('effects', Effects, ['canvas']);
  container.singleton('highscores', Highscores);
  container.singleton('score', Score, ['canvas', 'highscores']);
  container.singleton('turret', Turret, ['canvas', 'state', 'effects', 'sound']);
  container.singleton('barrel', Barrel, ['canvas', 'turret', 'state', 'sound']);
  container.singleton('flightController', FlightController, ['canvas', 'state', 'turret', 'sound']);
  container.singleton('trooperController', TrooperController, ['canvas', 'state', 'turret', 'score', 'effects', 'sound']);
  container.singleton('fps', FPS, ['canvas']);
  container.singleton('overlay', Overlay, ['canvas', 'state', 'highscores', 'score', 'sound']);
  container.register('bullet', Bullet, ['canvas', 'turret', 'flightController', 'trooperController', 'score', 'effects', 'sound']);
  container.register('heli', Heli, ['canvas', 'trooperController', 'state']);
  container.register('jet', Jet, ['canvas', 'flightController', 'state']);
  container.register('bomb', Bomb, ['canvas']);
  container.register('paratrooper', Paratrooper, ['canvas', 'trooperController']);

  return container;

}
