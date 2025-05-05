import Container from "./container";
import Canvas from "./canvas";
import Barrel from "./barrel";
import Bullet from "./bullet";
import Turret from "./turret";
import FlightController from "./flight-controller";
import TrooperController from "./trooper-controller";
import Score from "./score";
import FPS from "./fps";
import Heli from "./heli";
import Aircraft from "./aircraft";
import Bomb from "./bomb";
import Paratrooper from "./paratrooper";
import Overlay from "./overlay";
import Highscores from "./highscores";

export default () => {

  const container = new Container;

  container.singleton('canvas', Canvas, []);
  container.singleton('turret', Turret, ['canvas']);
  container.singleton('score', Score, ['canvas']);
  container.singleton('flightController', FlightController, ['canvas', 'turret', 'score']);
  container.singleton('trooperController', TrooperController, ['canvas', 'flightController']);
  container.singleton('barrel', Barrel, ['canvas', 'turret', 'flightController']);
  container.singleton('fps', FPS, ['canvas']);
  container.singleton('overlay', Overlay, ['canvas', 'trooperController', 'flightController', 'highscores', 'score']);
  container.register('bullet', Bullet, ['canvas', 'turret', 'flightController', 'trooperController', 'score']);
  container.register('heli', Heli, ['canvas', 'trooperController']);
  container.register('aircraft', Aircraft, ['canvas']);
  container.register('bomb', Bomb, ['canvas', 'turret', 'score']);
  container.register('paratrooper', Paratrooper, ['canvas', 'trooperController', 'score']);
  container.register('highscores', Highscores, ['score']);

  return <Container>container;

}