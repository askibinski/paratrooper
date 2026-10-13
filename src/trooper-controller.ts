import Canvas from "./canvas";
import Paratrooper from "./paratrooper";
import GameState from "./game-state";
import Turret from "./turret";
import Score from "./score";
import Effects from "./effects";
import Sound from "./sound";

interface Assault {
  squad: Paratrooper[];
  // Index of the squad member currently on the move.
  step: number;
}

export default class TrooperController {

  // Troopers land on a grid, so they can stack.
  static readonly GRID_SIZE = 50;
  static readonly POINTS = 5;
  // Number of landed troopers on one side needed to storm the turret.
  static readonly ASSAULT_SQUAD_SIZE = 4;

  troopers: Paratrooper[] = [];
  assault: Assault | null = null;
  private landCounter = 0;

  constructor(
    readonly canvas: Canvas,
    readonly state: GameState,
    readonly turret: Turret,
    readonly score: Score,
    readonly effects: Effects,
    readonly sound: Sound,
  ) { }

  static snapToGrid(x: number): number {
    return Math.floor(x / TrooperController.GRID_SIZE) * TrooperController.GRID_SIZE;
  }

  get landed(): Paratrooper[] {
    return this.troopers.filter((trooper) => trooper.state === 'landed' && !trooper.isGone);
  }

  get landedLeft(): Paratrooper[] {
    return this.landed.filter((trooper) => trooper.x < this.canvas.centerX);
  }

  get landedRight(): Paratrooper[] {
    return this.landed.filter((trooper) => trooper.x > this.canvas.centerX);
  }

  reset = (): void => {
    this.troopers = [];
    this.assault = null;
    this.landCounter = 0;
  }

  run = (): void => {
    this.troopers.forEach((trooper) => {
      if (!trooper.isGone) {
        trooper.update();
      }
    });

    if (this.assault) {
      this.advanceAssault(this.assault);
    }
    else if (this.state.isPlaying) {
      this.checkAssault();
    }

    this.troopers = this.troopers.filter((trooper) => !trooper.isGone);
    this.troopers.forEach((trooper) => trooper.draw());
  }

  createTrooper = (x: number, y: number): void => {
    const trooper = window.game.container.get('paratrooper');
    trooper.x = x;
    trooper.y = y;
    this.troopers.push(trooper);
  }

  // The y coordinate of whatever a falling trooper at x would land on.
  surfaceAt = (x: number): number => {
    const stack = this.landed.filter((trooper) => trooper.x === x).length;
    return this.canvas.groundY - stack * Paratrooper.HEIGHT;
  }

  // Where a landed trooper should be, given the troopers below him.
  restingY = (trooper: Paratrooper): number => {
    const below = this.landed.filter((other) => other.x === trooper.x && other.landOrder < trooper.landOrder).length;
    return this.canvas.groundY - (below + 1) * Paratrooper.HEIGHT;
  }

  // Phew. Safely landed.
  land = (trooper: Paratrooper): void => {
    trooper.state = 'landed';
    trooper.landOrder = ++this.landCounter;
    this.sound.land();
  }

  // Oops... A trooper without chute hit the ground (or his comrades, who
  // won't survive that either).
  crash = (trooper: Paratrooper): void => {
    this.landed
      .filter((other) => other.x === trooper.x)
      .forEach((other) => this.kill(other, false));
    this.kill(trooper, false);
    this.sound.splat();
  }

  kill = (trooper: Paratrooper, playSound = true): void => {
    trooper.isGone = true;
    this.score.add(TrooperController.POINTS);
    this.effects.splat(trooper.x, trooper.y + Paratrooper.HEIGHT / 2);
    this.effects.popup(trooper.x, trooper.y - 20, `+${TrooperController.POINTS}`);
    if (playSound) {
      this.sound.splat();
    }
  }

  // If 4 troopers land on either side of the turret, they storm it!
  checkAssault = (): void => {
    const side = [this.landedLeft, this.landedRight].find((troopers) => troopers.length >= TrooperController.ASSAULT_SQUAD_SIZE);
    if (side) {
      this.startAssault(side);
    }
  }

  startAssault = (troopers: Paratrooper[]): void => {
    const center = this.canvas.centerX;
    const direction = Math.sign(troopers[0].x - center);
    // Right next to the turret base.
    const edgeX = center + direction * (Turret.BASE_SIZE / 2 + Paratrooper.WIDTH / 2 + 2);
    const ground = this.canvas.groundY;
    const baseTop = this.turret.baseTop;

    // The ones closest to the turret go first. They form a human tower
    // against the base, and the last one climbs over them onto the turret.
    const squad = [...troopers]
      .sort((a, b) => Math.abs(a.x - center) - Math.abs(b.x - center))
      .slice(0, TrooperController.ASSAULT_SQUAD_SIZE);

    squad.forEach((trooper, i) => {
      trooper.state = 'assault';
      const isLast = i === squad.length - 1;
      // Get off the stack (if standing on someone) and walk to the turret.
      const groundLevel = ground - Paratrooper.HEIGHT;
      trooper.waypoints = [{ x: trooper.x, y: groundLevel }, { x: edgeX, y: groundLevel }];
      trooper.waypoints.push(...(isLast
        ? [{ x: edgeX, y: baseTop - Paratrooper.HEIGHT }, { x: center + direction * 40, y: baseTop - Paratrooper.HEIGHT }]
        : [{ x: edgeX, y: ground - (i + 1) * Paratrooper.HEIGHT }]));
    });

    this.assault = { squad, step: 0 };
    this.state.setPhase('assault');
  }

  advanceAssault = (assault: Assault): void => {
    if (this.turret.isDestroyed) return;

    const trooper = assault.squad[assault.step];
    if (trooper.march()) {
      assault.step++;
    }

    // The last one made it onto the turret. Kaboom.
    if (assault.step >= assault.squad.length) {
      assault.squad.forEach((member) => (member.isGone = true));
      this.turret.destroy();
    }
  }

}
