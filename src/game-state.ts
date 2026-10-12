// playing: normal gameplay.
// assault: four troopers landed on one side and are storming the turret.
// destroyed: the turret just blew up (explosion animation).
// over: game over screen and highscores.
export type Phase = 'playing' | 'assault' | 'destroyed' | 'over';

export default class GameState {

  phase: Phase = 'playing';
  // Number of frames since the current phase started.
  phaseFrames = 0;
  paused = false;

  get isPlaying(): boolean {
    return this.phase === 'playing';
  }

  setPhase = (phase: Phase): void => {
    this.phase = phase;
    this.phaseFrames = 0;
  }

  tick = (): void => {
    this.phaseFrames++;
  }

  reset = (): void => {
    this.setPhase('playing');
    this.paused = false;
  }

}
