import Canvas from "./canvas";
import GameState from "./game-state";
import Highscores from "./highscores";
import Score from "./score";
import Sound from "./sound";
import { isTyping } from "./utils";

// Pause screen, game over screen and highscores.
export default class Overlay {

  // Frames the explosion plays before the game over screen.
  static readonly EXPLOSION_FRAMES = 150;
  // Frames "GAME OVER" is shown before the highscore form.
  static readonly GAME_OVER_FRAMES = 120;

  static readonly INSTRUCTIONS = [
    'LEFT/RIGHT  aim',
    'UP/SPACE    shoot (costs 1 point)',
    'DOWN        stop turning',
    'P/ESC       pause    M  sound',
    '',
    'Helicopter 10 · Jet 10 · Bomb 30',
    'Trooper 5 · Shoot a chute and he falls,',
    'taking anyone below him along.',
    '',
    'If 4 troopers land on one side,',
    'they storm the turret. Bombs too.',
    '',
    'Touch: tap left/right to aim,',
    'the middle to shoot.',
  ];

  private wrapper: HTMLElement;
  private form: HTMLFormElement | null = null;
  private table: HTMLElement | null = null;

  constructor(readonly canvas: Canvas, readonly state: GameState, readonly highscores: Highscores, readonly score: Score, readonly sound: Sound) {
    this.wrapper = document.getElementById('highscores') ?? document.body;

    this.bindButton('#instructions', this.togglePause);
    this.bindButton('#restart', () => window.game.restart());

    window.addEventListener('keydown', this.handleKey);
    this.canvas.element.addEventListener('pointerdown', this.start);
    // Pause when the player switches tabs.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.canPause) {
        this.state.paused = true;
      }
    });
  }

  bindButton = (selector: string, callback: () => void): void => {
    const button = document.querySelector<HTMLButtonElement>(selector);
    button?.addEventListener('click', () => {
      callback();
      // Otherwise the space bar would "click" the button again.
      button.blur();
    });
  }

  handleKey = (e: KeyboardEvent): void => {
    if (isTyping()) return;

    switch (e.code) {
      case 'Space':
      case 'Enter':
      case 'ArrowUp':
        if (this.state.phase === 'title') {
          e.preventDefault();
          this.start();
        }
        break;
      case 'KeyP':
      case 'Escape':
        this.togglePause();
        break;
      case 'KeyR':
        if (this.state.phase === 'over') {
          window.game.restart();
        }
        break;
    }
  }

  togglePause = (): void => {
    if (!this.state.canPause) return;
    this.state.paused = !this.state.paused;
  }

  // Leave the title screen.
  start = (): void => {
    if (this.state.phase === 'title') {
      this.state.setPhase('playing');
    }
  }

  reset = (): void => {
    this.form = null;
    this.table = null;
    this.wrapper.replaceChildren();
  }

  run = (): void => {
    if (this.state.phase === 'destroyed' && this.state.phaseFrames >= Overlay.EXPLOSION_FRAMES) {
      this.state.setPhase('over');
      this.sound.gameOver();
    }

    if (this.state.phase === 'title') {
      this.drawTitle();
    }

    if (this.state.phase === 'over') {
      this.drawGameOver();
    }
  }

  dim = (alpha: number): void => {
    const ctx = this.canvas.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = Canvas.BLACK;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
  }

  // Drawn once on top of the frozen game.
  drawPause = (): void => {
    this.drawInstructions('PAUSED', 'Press P to continue');
  }

  drawTitle = (): void => {
    // Blinking "press start", like it's 1982.
    const blink = Math.floor(this.state.phaseFrames / 30) % 2 === 0;
    this.drawInstructions('PARATROOPER', blink ? 'Press SPACE or tap to start' : '');
  }

  drawInstructions = (title: string, footer: string): void => {
    this.dim(0.8);
    const { centerX } = this.canvas;
    this.canvas.text(title, centerX, 80, 128, 'center', Canvas.PINK);
    // Left aligned, so the (monospace) columns line up.
    Overlay.INSTRUCTIONS.forEach((line, i) => {
      this.canvas.text(line, 340, 260 + i * 56, 44);
    });
    this.canvas.text(footer, centerX, this.canvas.height - 130, 48, 'center', Canvas.BLUE);
  }

  drawGameOver = (): void => {
    const showHighscores = this.state.phaseFrames >= Overlay.GAME_OVER_FRAMES;
    if (showHighscores) {
      this.dim(0.65);
    }
    else {
      this.canvas.text('GAME OVER', this.canvas.centerX, this.canvas.height / 2, 256, 'center', Canvas.WHITE, 'middle');
    }

    if (showHighscores && !this.form && !this.table) {
      this.showForm();
    }
  }

  showForm = (): void => {
    this.form = document.createElement('form');

    const label = document.createElement('p');
    label.textContent = `GAME OVER - SCORE: ${this.score.score}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Your name';
    input.maxLength = Highscores.MAX_NAME_LENGTH;
    input.setAttribute('aria-label', 'Your name');

    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Save';

    this.form.append(label, input, submit);
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const position = this.highscores.save(input.value, this.score.score);
      this.form?.remove();
      this.showHighscores(position);
    });

    this.wrapper.appendChild(this.form);
    input.focus();
  }

  showHighscores = (highlight: number): void => {
    const container = document.createElement('div');
    container.className = 'highscoreTable';

    const table = document.createElement('table');
    const caption = table.createCaption();
    caption.textContent = 'HIGHSCORES';

    this.highscores.load().forEach((entry, i) => {
      const row = table.insertRow();
      if (i === highlight) {
        row.className = 'highlight';
      }
      [`${i + 1}`, entry.name, `${entry.score}`].forEach((value) => {
        // textContent, so names can't inject HTML.
        row.insertCell().textContent = value;
      });
    });

    const hint = document.createElement('p');
    hint.textContent = 'Press R to play again';

    container.append(table, hint);
    this.table = container;
    this.wrapper.appendChild(container);
  }

}
