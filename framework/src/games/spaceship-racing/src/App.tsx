import React from 'react';
import { SpaceshipRacingScene } from './components/SpaceshipRacingScene';

export default function App() {
  return (
    <div className="spaceship-racing-app">
      <header className="spaceship-racing-header">
        <h1>Spaceship Racing</h1>
        <p>A calm, mindful spaceship racing experience — no pressure, no fail state.</p>
      </header>
      <main className="spaceship-racing-main">
        <SpaceshipRacingScene />
      </main>
    </div>
  );
}
