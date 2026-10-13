import Heli from "./heli";
import Jet from "./jet";
import Bomb from "./bomb";
import Canvas from "./canvas";
import GameState from "./game-state";
import Turret from "./turret";
import Sound from "./sound";
import { getRndInteger } from "./utils";

// Like the original, every wave starts with helicopters dropping troopers,
// followed by an air attack of jets dropping bombs on the turret.
type AirPhase = 'helis' | 'jets';

export default class FlightController {

  static readonly HELI_HEIGHT_HIGH = 100;
  static readonly HELI_HEIGHT_LOW = 200;
  static readonly MAX_HELIS_START = 3;
  static readonly MAX_HELIS_LIMIT = 6;
  static readonly HELI_SPAWN_DELAY = 30;
  static readonly MAX_JETS_AT_ONCE = 2;
  // Pause between phases, during which the banner is shown.
  static readonly INTERMISSION = 150;

  helis: Heli[] = [];
  jets: Jet[] = [];
  bombs: Bomb[] = [];
  wave = 1;
  airPhase: AirPhase = 'helis';
  // Number of aircraft spawned in the current phase.
  spawned = 0;
  intermission = 0;
  banner = '';
  // Per direction delay, so we don't immediately create a new heli.
  private heliDelay = new Map<number, number>();
  private jetDelay = 0;

  constructor(readonly canvas: Canvas, readonly state: GameState, readonly turret: Turret, readonly sound: Sound) {
    this.reset();
  }

  // Difficulty settings, increasing every wave.
  get helisPerWave(): number {
    return 8 + 4 * this.wave;
  }

  get maxHelis(): number {
    return Math.min(FlightController.MAX_HELIS_LIMIT, FlightController.MAX_HELIS_START + Math.floor((this.wave - 1) / 2));
  }

  get heliSpeed(): number {
    return Math.min(8, 4.5 + 0.5 * this.wave);
  }

  get troopersPerHeli(): number {
    return Math.min(3, 1 + Math.floor((this.wave - 1) / 2));
  }

  get jetsPerWave(): number {
    return Math.min(10, 2 + this.wave);
  }

  get bombSpeed(): number {
    return Math.min(6, 3 + 0.4 * this.wave);
  }

  reset = (): void => {
    this.helis = [];
    this.jets = [];
    this.bombs = [];
    this.wave = 1;
    this.startPhase('helis', 'WAVE 1');
  }

  startPhase = (phase: AirPhase, banner: string): void => {
    this.airPhase = phase;
    this.spawned = 0;
    this.intermission = FlightController.INTERMISSION;
    this.banner = banner;
    this.heliDelay.set(-1, 0).set(1, 0);
    this.jetDelay = 0;
  }

  run = (): void => {
    if (this.state.isPlaying) {
      this.spawn();
    }

    this.helis.forEach((heli) => heli.run());
    this.jets.forEach((jet) => jet.run());
    this.runBombs();

    this.helis = this.helis.filter((heli) => !heli.isGone);
    this.jets = this.jets.filter((jet) => !jet.isGone);
    this.bombs = this.bombs.filter((bomb) => !bomb.isGone);

    this.drawBanner();
  }

  // Shown in the score bar.
  drawHud = (): void => {
    this.canvas.text(`WAVE:${this.wave}`, this.canvas.centerX, this.canvas.height - 60, 48, 'center');
  }

  spawn = (): void => {
    if (this.intermission > 0) {
      this.intermission--;
      if (this.intermission === FlightController.INTERMISSION - 1) {
        this.sound.newWave();
      }
      return;
    }

    if (this.airPhase === 'helis') {
      if (this.spawned < this.helisPerWave) {
        this.spawnHeli();
      }
      else if (this.helis.length === 0) {
        this.startPhase('jets', 'AIR ATTACK!');
      }
    }
    else {
      if (this.spawned < this.jetsPerWave) {
        this.spawnJet();
      }
      else if (this.jets.length === 0 && this.bombs.length === 0) {
        this.wave++;
        this.startPhase('helis', `WAVE ${this.wave}`);
      }
    }
  }

  spawnHeli = (): void => {
    this.heliDelay.forEach((delay, direction) => this.heliDelay.set(direction, Math.max(0, delay - 1)));

    // 50% chance from which direction.
    const direction = getRndInteger(0, 2) ? -1 : 1;
    if (this.helis.length >= this.maxHelis || this.heliDelay.get(direction)) return;

    // 1.5% chance each run to create a chopper.
    if (getRndInteger(0, 1000) >= 15) return;

    const heli = window.game.container.get('heli');
    heli.launch(direction, direction === -1 ? FlightController.HELI_HEIGHT_LOW : FlightController.HELI_HEIGHT_HIGH);
    heli.speed = this.heliSpeed;
    heli.maxTroopers = this.troopersPerHeli;
    this.helis.push(heli);
    this.spawned++;
    this.heliDelay.set(direction, FlightController.HELI_SPAWN_DELAY);
  }

  spawnJet = (): void => {
    if (this.jetDelay > 0) {
      this.jetDelay--;
      return;
    }
    if (this.jets.length >= FlightController.MAX_JETS_AT_ONCE) return;

    const jet = window.game.container.get('jet');
    jet.launch(getRndInteger(0, 2) ? -1 : 1);
    this.jets.push(jet);
    this.spawned++;
    this.jetDelay = getRndInteger(60, 150);
  }

  dropBomb = (x: number, y: number): void => {
    const bomb = window.game.container.get('bomb');
    bomb.launch(x, y, this.turret.pivotX, this.turret.pivotY, this.bombSpeed);
    this.bombs.push(bomb);
    this.sound.bombDrop();
  }

  runBombs = (): void => {
    this.bombs.forEach((bomb) => {
      bomb.run();
      if (bomb.hasReachedTarget) {
        bomb.isGone = true;
        this.turret.destroy();
      }
    });
  }

  drawBanner = (): void => {
    if (this.intermission <= 0 || !this.state.isPlaying) return;

    const ctx = this.canvas.ctx;
    ctx.save();
    // Fade out during the last part of the intermission.
    ctx.globalAlpha = Math.min(1, this.intermission / 30);
    this.canvas.text(this.banner, this.canvas.centerX, this.canvas.height * 0.4, 128, 'center', Canvas.BLUE, 'middle');
    ctx.restore();
  }

}
