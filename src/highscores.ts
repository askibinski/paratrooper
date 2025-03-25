import Score from "./score";

interface HighscoreEntry {
  name: string;
  score: number;
}

export default class Highscores {
  highscoreSaved: boolean;
  localStorageKey = 'paratrooper-highscores';

  constructor(readonly score: Score) {
    this.highscoreSaved = false;
  }

  uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  writeHighscore = (e: Event): void => {
    e.preventDefault();
    const button = <HTMLElement>e.target;
    const form = button.parentElement;
    const name = <HTMLInputElement>form.querySelector('input[type="text"]');
    
    // Get existing scores
    const existingScores = this.getStoredHighscores();
    
    // Add new score
    existingScores.push({
      name: name.value,
      score: this.score.score
    });
    
    // Sort and limit to top 10
    const topScores = existingScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    // Save back to localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(topScores));
    this.highscoreSaved = true;
  }

  getStoredHighscores(): HighscoreEntry[] {
    const stored = localStorage.getItem(this.localStorageKey);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing highscores', e);
      return [];
    }
  }

  getHighScores = async () => {
    // Return a mock Firebase-compatible snapshot to maintain compatibility with existing code
    const highscores = this.getStoredHighscores();
    
    return {
      forEach: (callback) => {
        highscores.forEach((score, index) => {
          callback({
            data: () => score
          });
        });
      }
    };
  }
}