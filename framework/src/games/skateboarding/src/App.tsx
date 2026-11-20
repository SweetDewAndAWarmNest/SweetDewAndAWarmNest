import React from 'react';
import { Canvas } from '@react-three/fiber';
import { SkateboardScene } from './components/SkateboardScene';

export default function App() {
  return (
    <div className="skateboarding-app">
      <header className="skateboarding-header">
        <h1>Skateboarding</h1>
        <p>A calm, mindful skateboarding experience — no pressure, no fail state.</p>
      </header>
      <main className="skateboarding-main">
        <Canvas camera={{ position: [0, 5, 15], fov: 50 }}>
          <SkateboardScene />
        </Canvas>
      </main>
    </div>
  );
}
