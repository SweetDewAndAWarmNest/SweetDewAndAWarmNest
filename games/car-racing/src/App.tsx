import React from 'react';
import { CarRacingScene } from './components/CarRacingScene';

export default function App() {
  return (
    <div className="car-racing-app">
      <header className="car-racing-header">
        <h1>Car Racing</h1>
        <p>A calm, mindful car racing experience — no pressure, no fail state.</p>
      </header>
      <main className="car-racing-main">
        <CarRacingScene />
      </main>
    </div>
  );
}
