# Sweet Dew And A Warm Nest — Frontend

React + TypeScript + Vite PWA for the wellness sanctuary platform.

## Architecture

- **React 18** with **TypeScript** for type-safe UI components
- **Vite** for fast dev server and production builds
- **Three.js** (via `@react-three/fiber` + `@react-three/drei`) for the 3D hub world
- **Socket.IO client** for real-time chat with the backend
- **Manifest** + **service worker** for PWA offline support

## Scripts

```bash
npm run dev     # Start dev server (port 5173)
npm run build   # Type-check + production build
npm run preview # Preview production build
npm test        # Run unit tests (Vitest)
```

## Project Structure

```
src/
├── components/     # Reusable UI components (Hub, Chat, CrisisBanner, etc.)
├── hooks/          # Custom React hooks
├── services/       # API clients, chat service, socket manager
├── styles/         # Global CSS and design tokens
├── App.tsx         # Root component
├── main.tsx        # Entry point
```

## Development

### Start both dev servers
```bash
npm run dev        # Frontend (port 5173)
npm run dev:backend  # Backend (port 3000)
```

Then open http://localhost:5173

### Build for production
```bash
npm run build
```
Output goes to `dist/`.
