# Sweet Dew And A Warm Nest — Games

This directory contains the game implementations for the wellness sanctuary platform.

## Games

| Game | Description | Engine | Status |
|------|-------------|--------|--------|
| **Chess** | Strategic board game | Canvas 2D (no dependencies) | TODO |
| **Checkers** | Strategic board game | Canvas 2D (no dependencies) | TODO |
| **Skateboarding** | 3D skateboarding sim | Three.js | TODO |
| **Car Racing** | 3D car racing | Three.js | TODO |
| **Spaceship Racing** | 3D spaceship racing/battles | Three.js | TODO |

## Design Principles

- **No fail state**: Games have no win/lose conditions — they're for calm, mindful play
- **No time pressure**: No timers, no countdowns, no speed requirements
- **No negative feedback**: No scores, no rankings, no punishments
- **PWA-ready**: Games work offline and in standalone mode

## Structure

```
src/games/
├── chess/          # Chess game (Canvas 2D)
├── checkers/       # Checkers game (Canvas 2D)
├── skateboarding/  # Skateboarding game (Three.js)
├── car-racing/     # Car racing game (Three.js)
├── spaceship/      # Spaceship racing/battles (Three.js)
└── README.md       # This file
```

## Development

Each game has its own package.json if it needs dependencies. For games with no dependencies, use plain TypeScript/JavaScript.

```bash
# Start dev server
npm run dev

# Play chess
npm run dev:chess

# Play checkers
npm run dev:checkers
```
