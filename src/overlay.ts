import Canvas from "./canvas.js";
import Highscores from "./highscores.js";
import TrooperController from "./trooper-controller.js";
import FlightController from "./flight-controller.js";
import Score from "./score.js";

export default class Overlay {

  gameOver: boolean;
  table: HTMLTableElement;
  form: HTMLFormElement;
  wrapper: HTMLElement;
  timer: number;

  constructor(readonly canvas: Canvas, readonly trooperController: TrooperController, readonly flightController: FlightController, readonly highscores: Highscores, readonly score: Score) {
    this.gameOver = false;
    this.timer = 0;
    this.wrapper = document.getElementById("highscores");

    document.querySelector('#instructions').addEventListener('click', () => { alert("Use keyboard arrow keys (left, right and up).\n\nYou lose when 4 troopers land on either side of the turret.\n\nThis game does not work on mobile. We didn't have mobiles in 1989.") });

    document.querySelector('#restart').addEventListener('click', this.restart);

    // if (!this.showHighScores) {
    //   this.drawHighScores();
    //   this.showHighScores = true;
    // }
  }

  reset = (): void => {
    this.form = undefined;
    this.table = undefined;
    this.gameOver = false;
    this.timer = 0;
    this.wrapper.innerHTML = '';
    this.canvas.ctx.globalAlpha = 1;
    this.highscores.highscoreSaved = false;
  }

  run = (): void => {
    if (this.gameOver) {
      this.drawGameOver();
    }

    // If 4 troopers land on either side of the turret, it's game over!
    // @TODO make the troopers walk to the turret, climb it and explode.
    if (this.trooperController.troopersLandedLeft.length >= 4 || this.trooperController.troopersLandedRight.length >= 4) {
      this.flightController.showNewHelis = false;
      this.gameOverStatus = true;
    }
  }

  set gameOverStatus(status: boolean) {
    this.gameOver = status;
  }

  restart = (): void => {
    this.reset();
    // Clear all troopers.
    this.trooperController.reset();
    // Let the helis fly again.
    this.flightController.reset();
    // Clear score.
    this.score.score = 0;
  }

  drawGrayOverlay = (): void => {
    this.canvas.ctx.fillStyle = Canvas.BLACK;
    this.canvas.ctx.globalAlpha = 0.65;
    this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGameOver = (): void => {
    this.canvas.ctx.fillStyle = Canvas.WHITE;
    this.canvas.ctx.font = "256px Courier";
    this.canvas.ctx.textAlign = "center"
    this.canvas.ctx.textBaseline = "middle";
    this.canvas.ctx.fillText(`GAME OVER`, this.canvas.width / 2, this.canvas.height / 2);

    this.timer++;

    if (this.timer >= 180) {
      this.drawGrayOverlay();
    }

    if (!this.form && !this.table && this.timer >= 180) {
      this.form = document.createElement('form');
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', 'Your Name');
      const submit = document.createElement('input');
      submit.setAttribute('type', 'submit');
      this.form.appendChild(input);
      input.insertAdjacentElement("afterend", submit);
      this.wrapper.appendChild(this.form);
      input.focus();
      submit.addEventListener('click', this.highscores.writeHighscore);
    }

    if (this.highscores.highscoreSaved && !this.table && this.form) {
      this.form.remove();
      this.drawHighScores();
    }
  }

  drawHighScores = (): void => {
    this.highscores.getHighScores()
      .then(snapshot => {
        this.table = document.createElement('table');
        let i = 1;
        snapshot.forEach(doc => {
          let tr = document.createElement('tr');
          let td1 = document.createElement('td');
          let td2 = document.createElement('td');
          let td3 = document.createElement('td');
          td1.innerHTML = <string><any>i;
          td2.innerHTML = doc.data().name;
          td3.innerHTML = doc.data().score;
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          this.table.appendChild(tr);
          i++;
        });
        this.wrapper.appendChild(this.table);
      })
      .catch(
        err => {
          console.log('Error getting documents', err);
        }
      );
  }

}