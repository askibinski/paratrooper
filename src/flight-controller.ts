import Heli from "./heli.js";
import Aircraft from "./aircraft.js";
import Bomb from "./bomb.js";
import Canvas from "./canvas.js";
import Turret from "./turret.js";
import Score from "./score.js";

export default class FlightController {

  static readonly HELI_HEIGHT_HIGH = 100;
  static readonly HELI_HEIGHT_LOW = 200;
  static readonly AIRCRAFT_HEIGHT_HIGH = 50;
  static readonly AIRCRAFT_HEIGHT_LOW = 150;
  static readonly MAX_HELIS_START = 3;
  static readonly MAX_AIRCRAFT_START = 1;
  static readonly INCREASE_START_INTERVAL = 12;
  static readonly WAVE_THRESHOLD = 20; // After 20 helis have appeared, aircraft start appearing

  helis: Heli[];
  aircraft: Aircraft[];
  bombs: Bomb[];
  delay: { [key: string]: number };
  maxHelis: number;
  maxAircraft: number;
  newHelis: boolean;
  showAircraft: boolean;
  totalHelis: number;
  totalAircraft: number;
  difficultyInterval: number;

  constructor(readonly canvas: Canvas, readonly turret: Turret, readonly score: Score) {
    this.helis = [];
    this.aircraft = [];
    this.bombs = [];
    this.delay = { '-1': 0, '1': 0 };
    this.maxHelis = FlightController.MAX_HELIS_START;
    this.maxAircraft = FlightController.MAX_AIRCRAFT_START;
    this.newHelis = true;
    this.showAircraft = false;
    this.totalHelis = 0;
    this.totalAircraft = 0;
    this.difficultyInterval = FlightController.INCREASE_START_INTERVAL;
  }

  set showNewHelis(show: boolean) {
    this.newHelis = show;
  }

  set toggleAircraft(show: boolean) {
    this.showAircraft = show;
  }

  reset(): void {
    this.helis = [];
    this.aircraft = [];
    this.bombs = [];
    this.maxHelis = FlightController.MAX_HELIS_START;
    this.maxAircraft = FlightController.MAX_AIRCRAFT_START;
    this.newHelis = true;
    this.showAircraft = false;
    this.totalHelis = 0;
    this.totalAircraft = 0;
  }

  run(): void {

    // Check if we should start showing aircraft (after a certain number of helis destroyed)
    if (this.totalHelis >= FlightController.WAVE_THRESHOLD && !this.showAircraft) {
      this.showAircraft = true;
    }

    // Every x choppers, increase the max number of choppers by one.
    if (this.totalHelis === this.difficultyInterval) {
      this.maxHelis++;
      this.difficultyInterval = 2 * this.difficultyInterval;
    }

    // Count down delay timer.
    for (let i in this.delay) {
      if (this.delay[i] > 0) {
        this.delay[i]--;
      }
    }

    // Helicopter spawn logic
    if (this.newHelis) {
      // 50% chance from which direction.
      let toggle = !!this.canvas.getRndInteger(0, 2) ? -1 : 1;

      if (this.helis.length < this.maxHelis && this.delay[toggle] === 0) {
        // 1.5% chance each run to create a chopper.
        if (this.canvas.getRndInteger(1, 1000) <= 15) {
          const heli = window.game.container.get('heli');
          heli.height = (toggle === -1) ? FlightController.HELI_HEIGHT_LOW : FlightController.HELI_HEIGHT_HIGH;
          heli.toggle = toggle;
          this.helis.push(heli);
          this.totalHelis++;

          // Create a delay so we don't immediately create a new heli.
          this.delay[toggle] = 30;
        }
      }
    }

    // Aircraft spawn logic (only if we're showing aircraft)
    if (this.showAircraft) {
      // 50% chance from which direction.
      let toggle = !!this.canvas.getRndInteger(0, 2) ? -1 : 1;

      if (this.aircraft.length < this.maxAircraft && this.delay[toggle] === 0) {
        // 1% chance each run to create an aircraft.
        if (this.canvas.getRndInteger(1, 1000) <= 10) {
          const aircraft = window.game.container.get('aircraft');
          aircraft.height = (toggle === -1) ? FlightController.AIRCRAFT_HEIGHT_LOW : FlightController.AIRCRAFT_HEIGHT_HIGH;
          aircraft.toggle = toggle;
          this.aircraft.push(aircraft);
          this.totalAircraft++;

          // Create a delay so we don't immediately create a new aircraft.
          this.delay[toggle] = 45;
        }
      }
    }

    // Manage bomb dropping and drawing
    this.manageBombs();

    // Update and draw helis
    this.helis.forEach((heli, index) => {
      // If the heli went off canvas or was destroyed, the reference can 
      // be removed and javascript will automatically reclaim memory.
      if (heli.isGone) {
        this.helis.splice(index, 1);
        return;
      }
      heli.draw();
    });

    // Update and draw aircraft
    this.aircraft.forEach((aircraft, index) => {
      // Check if aircraft should drop a bomb
      if (aircraft.shouldDropBomb) {
        this.createBomb(aircraft.startX, aircraft.startY);
        aircraft.shouldDropBomb = false;
      }
      
      // If the aircraft went off canvas or was destroyed, remove it
      if (aircraft.isGone) {
        this.aircraft.splice(index, 1);
        return;
      }
      aircraft.draw();
    });
  }

  manageBombs(): void {
    // Update and draw bombs
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      if (this.bombs[i].isGone) {
        this.bombs.splice(i, 1);
        continue;
      }
      this.bombs[i].draw();
    }
  }

  createBomb(x: number, y: number): void {
    const bomb = window.game.container.get('bomb');
    bomb.bombX = x;
    bomb.bombY = y;
    this.bombs.push(bomb);
  }

  checkBulletHit(bulletX: number, bulletY: number): boolean {
    // Check if any bomb was hit
    for (let i = 0; i < this.bombs.length; i++) {
      if (this.bombs[i].wasHit(bulletX, bulletY)) {
        this.bombs[i].isExploding = true;
        this.score.add(Bomb.BOMB_SCORE);
        return true;
      }
    }
    return false;
  }

}