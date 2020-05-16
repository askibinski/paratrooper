import Container from "./container.js";
import Canvas from "./canvas.js";
import Barrel from "./barrel.js";
import Bullet from "./bullet.js";
import Turret from "./turret.js";
import FlightController from "./flight-controller.js";
import TrooperController from "./trooper-controller.js";
import Score from "./score.js";
import FPS from "./fps.js";
import Heli from "./heli.js";
import Paratrooper from "./paratrooper.js";

export default () => {

  const container = new Container;

  container.singleton('canvas', Canvas, []);
  container.singleton('turret', Turret, ['canvas']);
  container.singleton('flightController', FlightController, ['canvas']);
  container.singleton('trooperController', TrooperController, ['canvas']);
  container.singleton('score', Score, ['canvas']);
  container.singleton('barrel', Barrel, ['canvas', 'turret', 'flightController']);
  container.singleton('fps', FPS, ['canvas']);
  container.register('bullet', Bullet, ['canvas', 'turret', 'flightController', 'score']);
  container.register('heli', Heli, ['canvas', 'trooperController']);
  container.register('paratrooper', Paratrooper, ['canvas', 'trooperController']);

  return <Container>container;

}