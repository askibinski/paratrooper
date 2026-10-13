export interface HighscoreEntry {
  name: string;
  score: number;
}

// Highscores are stored locally in the browser.
export default class Highscores {

  static readonly STORAGE_KEY = 'paratrooper-highscores';
  static readonly MAX_ENTRIES = 10;
  static readonly MAX_NAME_LENGTH = 20;

  load = (): HighscoreEntry[] => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(Highscores.STORAGE_KEY) ?? '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((entry): entry is HighscoreEntry =>
        typeof entry?.name === 'string' && typeof entry?.score === 'number');
    } catch (e) {
      console.error('Error loading highscores', e);
      return [];
    }
  }

  // Saves the score and returns its position in the list (-1 if it didn't make it).
  save = (name: string, score: number): number => {
    const entry: HighscoreEntry = {
      name: name.trim().slice(0, Highscores.MAX_NAME_LENGTH) || 'Anonymous',
      score,
    };
    const entries = [...this.load(), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, Highscores.MAX_ENTRIES);

    try {
      localStorage.setItem(Highscores.STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Error saving highscores', e);
    }
    return entries.indexOf(entry);
  }

}
