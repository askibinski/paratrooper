# Paratrooper Project Guide

## Build Commands
- Dev server: `npm run dev` - Starts Vite development server
- Build: `npm run build` - Compiles TypeScript and builds with Vite
- Preview: `npm run preview` - Serves the production build locally
- TypeScript check: `npm run typecheck` - Runs TypeScript compiler without emitting files

## Style Guidelines
- **Imports**: Use module imports without file extensions (`import X from "./x"`)
- **Types**: Use TypeScript interfaces and type annotations
- **Classes**: Use class-based architecture with dependency injection
- **Naming**: 
  - Classes: PascalCase
  - Methods/properties: camelCase
  - Constants: UPPER_SNAKE_CASE
- **Module Pattern**: Service container for dependency injection
- **Error Handling**: Implement try/catch blocks for critical operations
- **Comments**: Add comments for complex logic and TODOs
- **Performance**: Use requestAnimationFrame with max FPS limiting

## Project Structure
- `src/`: TypeScript source files
- `dist/`: Compiled JS output (generated)
- `styles/`: CSS files
- `.env.example`: Example environment variables (copy to .env.local for local settings)
- Classes are organized by game component (canvas, barrel, turret, heli, jet, bomb, etc.)
- `src/services.ts`: registers every component in the DI container (typed by `ServiceMap`)
- `src/game-state.ts`: game phase (playing, assault, destroyed, over) and pause state

## Code Organization
- Game is structured as a component-based system with dependency injection
- State management is handled within each component; the global game phase lives in `GameState`
- Entities (helis, jets, bombs, troopers, bullets) are kept in arrays and filtered on `isGone` after each frame (never splice during iteration)
- Sounds are synthesized with the Web Audio API (`src/sound.ts`), no audio files
- Highscores are stored in localStorage (previously used Firebase)