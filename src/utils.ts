export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// Get a random integer in the range [min, max).
export function getRndInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Shuffle an array in place (Fisher-Yates).
export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Check if a point (with an optional margin, e.g. half a bullet) lies within bounds.
export function contains(bounds: Bounds, x: number, y: number, margin = 0): boolean {
  return x >= bounds.left - margin
    && x <= bounds.right + margin
    && y >= bounds.top - margin
    && y <= bounds.bottom + margin;
}

// Game hotkeys should be ignored while the player types in a form field
// (e.g. their name for the highscores).
export function isTyping(): boolean {
  const el = document.activeElement;
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
}
