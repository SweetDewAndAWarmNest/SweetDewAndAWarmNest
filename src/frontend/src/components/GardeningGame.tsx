import { useState } from 'react';

// ── Gardening Game ─────────────────────────────────────────────────
// Cozy, low-pressure gardening game

interface Plant {
  id: string;
  name: string;
  emoji: string;
  water: number;
  sunlight: number;
  growth: number;
  type: 'flower' | 'herb' | 'vegetable' | 'tree';
}

interface GardenPlot {
  x: number;
  y: number;
  plant: Plant | null;
}

const GARDEN_PLOTS: [number, number][] = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2], [2, 2],
];

const PLANTS: Plant[] = [
  { id: 'rose', name: 'Rose', emoji: '🌹', water: 7, sunlight: 9, growth: 50, type: 'flower' },
  { id: 'tulip', name: 'Tulip', emoji: '🌷', water: 6, sunlight: 7, growth: 40, type: 'flower' },
  { id: 'lily', name: 'Lily', emoji: '🌸', water: 8, sunlight: 8, growth: 45, type: 'flower' },
  { id: 'daisy', name: 'Daisy', emoji: '🌼', water: 5, sunlight: 6, growth: 35, type: 'flower' },
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', water: 8, sunlight: 10, growth: 60, type: 'flower' },
  { id: 'basil', name: 'Basil', emoji: '🌿', water: 6, sunlight: 8, growth: 45, type: 'herb' },
  { id: 'mint', name: 'Mint', emoji: '🌿', water: 5, sunlight: 6, growth: 40, type: 'herb' },
  { id: 'rosemary', name: 'Rosemary', emoji: '🌿', water: 4, sunlight: 9, growth: 50, type: 'herb' },
  { id: 'thyme', name: 'Thyme', emoji: '🌿', water: 5, sunlight: 7, growth: 35, type: 'herb' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', water: 7, sunlight: 8, growth: 55, type: 'vegetable' },
  { id: 'carrot', name: 'Carrot', emoji: '🥕', water: 6, sunlight: 5, growth: 40, type: 'vegetable' },
  { id: 'potato', name: 'Potato', emoji: '🥔', water: 6, sunlight: 4, growth: 35, type: 'vegetable' },
  { id: 'oak', name: 'Oak Tree', emoji: '🌳', water: 9, sunlight: 10, growth: 80, type: 'tree' },
  { id: 'palm', name: 'Palm Tree', emoji: '🌴', water: 9, sunlight: 10, growth: 75, type: 'tree' },
  { id: 'pine', name: 'Pine Tree', emoji: '🌲', water: 8, sunlight: 9, growth: 70, type: 'tree' },
];

export function GardeningGame() {
  const [plots, setPlots] = useState<GardenPlot[]>(
    GARDEN_PLOTS.map(([x, y]) => ({ x, y, plant: null as Plant | null }))
  );
  const [waterLevel, setWaterLevel] = useState(50);
  const [sunlightLevel, setSunlightLevel] = useState(50);
  const [message, setMessage] = useState('');

  // Water plants
  const waterPlants = () => {
    setWaterLevel(prev => Math.min(prev + 20, 100));
    setMessage('💧 Watered the garden');
    setTimeout(() => setMessage(''), 3000);
  };

  // Increase sunlight (raise blinds)
  const increaseSunlight = () => {
    setSunlightLevel(prev => Math.min(prev + 10, 100));
    setMessage('☀️ More sunlight');
    setTimeout(() => setMessage(''), 3000);
  };

  // Plant a seed
  const plantSeed = (plant: Plant, x: number, y: number) => {
    const nextPlots = plots.map(p =>
      p.x === x && p.y === y ? { ...p, plant } : p
    );
    setPlots(nextPlots);
    setMessage(`🌱 Planted ${plant.name}`);
    setTimeout(() => setMessage(''), 3000);
  };

  // Check plant health
  const checkHealth = () => {
    const totalHealth = plots.reduce((sum, p) => {
      if (p.plant) {
        const health = (p.plant.water > 20 ? 1 : 0) + (p.plant.sunlight > 20 ? 1 : 0);
        return sum + health;
      }
      return sum;
    }, 0);
    const allHealthy = totalHealth === 10;
    setMessage(allHealthy ? '🌿 All plants are thriving!' : '🌱 Some plants need attention');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="gardening-game">
      <div className="gardening-container">
        <div className="gardening-3d">
          <div className="garden-plots">
            {plots.map(p => (
              <div
                key={`${p.x}-${p.y}`}
                className={`plot ${p.plant ? 'planted' : 'empty'}`}
              >
                {p.plant && (
                  <span
                    className="plant-emoji"
                    style={{
                      color: p.plant.type === 'tree' ? '#228B22' : undefined,
                    }}
                  >
                    {p.plant.emoji}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="gardening-content">
          <h2 className="gardening-title">The Garden</h2>
          <p className="gardening-description">
            A cozy garden where you can plant seeds and watch them grow.
            Water them and give them sunlight to thrive.
          </p>

          {/* Water Level */}
          <div className="garden-status">
            <div>
              <span className="status-label">💧 Water</span>
              <div className="status-bar">
                <div
                  className="status-fill"
                  style={{ width: `${waterLevel}%` }}
                />
              </div>
              <span className="status-value">{waterLevel}%</span>
            </div>
            <div>
              <span className="status-label">☀️ Sunlight</span>
              <div className="status-bar">
                <div
                  className="status-fill"
                  style={{ width: `${sunlightLevel}%` }}
                />
              </div>
              <span className="status-value">{sunlightLevel}%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="garden-controls">
            <button
              type="button"
              onClick={waterPlants}
              disabled={waterLevel >= 100}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: waterLevel >= 100 ? 'var(--border)' : 'var(--accent)',
                color: 'white',
                fontWeight: 600,
                cursor: waterLevel >= 100 ? 'not-allowed' : 'pointer',
              }}
            >
              💧 Water Garden
            </button>
            <button
              type="button"
              onClick={increaseSunlight}
              disabled={sunlightLevel >= 100}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: sunlightLevel >= 100 ? 'var(--border)' : 'var(--accent)',
                color: 'white',
                fontWeight: 600,
                cursor: sunlightLevel >= 100 ? 'not-allowed' : 'pointer',
              }}
            >
              ☀️ Sunlight
            </button>
            <button
              type="button"
              onClick={checkHealth}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🌿 Check Health
            </button>
          </div>

          {/* Plant Selector */}
          <div className="plant-selector">
            <h4>Choose a Plant</h4>
            <div className="plant-grid">
              {PLANTS.map((plant) => (
                <button
                  key={plant.id}
                  type="button"
                  onClick={() => {
                    const plot = plots.find(p => p.plant === null);
                    if (plot) {
                      plantSeed(plant, plot.x, plot.y);
                    }
                  }}
                  disabled={!plots.some(p => p.plant === null)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'var(--surface)',
                    cursor: plots.some(p => p.plant === null) ? 'pointer' : 'not-allowed',
                  }}
                >
                  <span className="plant-emoji-small">{plant.emoji}</span>
                  <span className="plant-name">{plant.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="garden-message">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
