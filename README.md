# Paratrooper

A browser recreation of the classic game "Paratrooper" using TypeScript.

## Description

Paratrooper is a classic arcade game originally released in 1982. In this recreation, you control a turret to shoot down helicopters and paratroopers. You lose when 4 troopers land on either side of your turret.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

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

- Left/Right arrow keys: Aim the turret
- Up arrow key or Spacebar: Shoot
- "Pause / Instructions" button: View game instructions
- "Restart" button: Restart the game

## Local Highscores

The game saves your highscores locally in your browser's localStorage.

## License

ISC License - See LICENSE file for details