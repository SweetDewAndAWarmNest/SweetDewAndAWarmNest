import React from 'react';
import { ChessGame } from './components/ChessGame';

export default function App() {
  return (
    <div className="chess-app">
      <header className="chess-header">
        <h1>Chess</h1>
        <p>A calm, mindful chess experience — no pressure, no fail state.</p>
      </header>
      <main className="chess-main">
        <ChessGame />
      </main>
    </div>
  );
}
