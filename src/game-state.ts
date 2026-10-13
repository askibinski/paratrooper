// title: the title screen, before the first game.
// playing: normal gameplay.
// assault: four troopers landed on one side and are storming the turret.
// destroyed: the turret just blew up (explosion animation).
// over: game over screen and highscores.
export type Phase = 'title' | 'playing' | 'assault' | 'destroyed' | 'over';

export default class GameState {

  phase: Phase = 'title';
  // Number of frames since the current phase started.
  phaseFrames = 0;
  paused = false;

  get isPlaying(): boolean {
    return this.phase === 'playing';
  }

  // Pausing only makes sense while the game is running.
  get canPause(): boolean {
    return this.phase !== 'title' && this.phase !== 'over';
  }

  setPhase = (phase: Phase): void => {
    this.phase = phase;
    this.phaseFrames = 0;
  }

  tick = (): void => {
    this.phaseFrames++;
  }

  // Restarting skips the title screen.
  reset = (): void => {
    this.setPhase('playing');
    this.paused = false;
  }

}
