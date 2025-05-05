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
  static readonly WAVE_THRESHOLD = 1; // After 1 helis have appeared, aircraft start appearing

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
  waveModeActive: boolean;

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
    this.waveModeActive = false;
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
    this.waveModeActive = false;
  }

  run(): void {

    // Check if threshold is reached and we should enter wave transition mode
    if (this.totalHelis >= FlightController.WAVE_THRESHOLD && !this.waveModeActive && !this.showAircraft) {
      this.waveModeActive = true;
      this.newHelis = false; // Stop spawning new helicopters
    }
    
    // Check if all helicopters are gone and we can start aircraft wave
    if (this.waveModeActive && this.helis.length === 0 && !this.showAircraft) {
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
    for (let i = this.aircraft.length - 1; i >= 0; i--) {
      const aircraft = this.aircraft[i];
      
      // First draw the aircraft (this updates its frame count)
      aircraft.draw();
      
      // Check if it's time to drop a bomb
      if (aircraft.shouldDropBomb) {
        console.log("Aircraft " + i + " wants to drop a bomb at position", aircraft.startX, aircraft.startY);
        this.createBomb(aircraft.startX, aircraft.startY, aircraft);
        aircraft.shouldDropBomb = false;
      }
      
      // If the aircraft went off canvas or was destroyed, remove it
      if (aircraft.isGone) {
        console.log("Aircraft gone, removing");
        this.aircraft.splice(i, 1);
      }
    }
  }

  manageBombs(): void {
    console.log("Managing bombs, count:", this.bombs.length);
    
    // Update and draw bombs
    for (let i = this.bombs.length - 1; i >= 0; i--) {
      if (this.bombs[i].isGone) {
        console.log("Removing gone bomb");
        this.bombs.splice(i, 1);
        continue;
      }
      console.log("Drawing bomb", i);
      this.bombs[i].draw();
    }
  }

  createBomb(x: number, y: number, sourceAircraft?: Aircraft): void {
    console.log("Creating bomb at", x, y);
    
    // Get a new bomb instance
    const bomb = window.game.container.get('bomb');
    
    if (sourceAircraft) {
      // Use the specific aircraft that triggered the bomb drop
      const direction = sourceAircraft.direction;
      console.log("Using source aircraft for bomb drop, direction:", direction);
      
      // Initialize the bomb with the aircraft's current position and speed
      bomb.initialize(
        sourceAircraft.startX, 
        sourceAircraft.startY, 
        direction, 
        Aircraft.AIRCRAFT_SPEED
      );
      
      // Add to the bombs array
      this.bombs.push(bomb);
      console.log("Bomb created from aircraft at", sourceAircraft.startX, sourceAircraft.startY);
    } else {
      // Should never happen with the new logic, but keep as fallback
      console.log("No source aircraft provided for bomb drop");
    }
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