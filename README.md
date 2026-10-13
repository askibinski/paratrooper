# Paratrooper

A browser recreation of the classic game "Paratrooper" using TypeScript.

## Description

Paratrooper is a classic arcade game originally released in 1982 for the IBM PC. In this recreation, you control a turret to shoot down helicopters, paratroopers, jets and their bombs.

Every wave starts with helicopters dropping paratroopers, followed by an air attack of jets dropping bombs on your turret. Each wave is a little harder than the last.

You lose when:

- 4 troopers land on either side of your turret: they form a human tower and blow up the turret, or
- a bomb hits your turret.

### Scoring

| Target | Points |
| --- | --- |
| Helicopter | 10 |
| Jet | 10 |
| Bomb | 30 |
| Paratrooper | 5 |
| Every shot | -1 |

Shoot a paratrooper's chute and he falls to his death, taking any troopers he lands on with him.

Falling debris from a helicopter you shot down also kills any troopers below it.

## Getting Started

### Prerequisites

- Node.js (v18 or higher, required by Vite 5)
- npm (comes with Node.js)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/askibinski/paratrooper.git
   cd paratrooper
   ```

2. Install dependencies
   ```
   npm install
   ```

### Development

Start the development server:
```
npm run dev
```

This will open the game in your default browser with hot-reload enabled.

### Building

To build the production version:
```
npm run build
```

Then to preview the production build:
```
npm run preview
```

## Controls

- Spacebar, Enter or tap: Start the game from the title screen
- Left/Right arrow keys: Aim the turret (it keeps turning until you shoot or press Down)
- Up arrow key or Spacebar: Shoot
- Down arrow key: Stop turning
- P or Escape: Pause / instructions
- M: Sound on/off
- F: Show frames per second
- R: Play again (after game over)

On touch screens, tap the left or right third of the screen to aim and the middle to shoot.

## Local Highscores

The game saves the top 10 highscores locally in your browser's localStorage.

## Project Structure

The game is built with plain TypeScript and the Canvas API, without runtime dependencies. Components are wired together with a small dependency injection container (`src/container.ts`, configured in `src/services.ts`), and `src/index.ts` runs the game loop.

## License

ISC License - See LICENSE file for details