import React from 'react';
import { CheckersGame } from './components/CheckersGame';

export default function App() {
  return (
    <div className="checkers-app">
      <header className="checkers-header">
        <h1>Checkers</h1>
        <p>A calm, mindful checkers experience — no pressure, no fail state.</p>
      </header>
      <main className="checkers-main">
        <CheckersGame />
      </main>
    </div>
  );
}
