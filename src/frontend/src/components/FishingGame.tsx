import { useState } from 'react';

// ── Fishing and Gathering Game ─────────────────────────────────────
// Cozy, low-pressure fishing and gathering game

interface Item {
  id: string;
  name: string;
  emoji: string;
  type: 'fish' | 'plant' | 'mineral';
  rarity: 'common' | 'uncommon' | 'rare';
}

interface Catch {
  id: string;
  item: Item;
  time: string;
  location: string;
}

interface CatchItemProps {
  item: Catch;
  rarityColors: Record<string, string>;
}

function CatchItem({ item, rarityColors }: CatchItemProps) {
  const catchRarityColor = rarityColors['common'];
  return (
    <div
      className="fishing-catch-item"
      style={{ borderBottomColor: catchRarityColor }}
    >
      <span className="catch-emoji">{item.item.emoji}</span>
      <div className="catch-info">
        <span className="catch-name">{item.item.name}</span>
        <span className="catch-rarity" style={{ color: catchRarityColor }}>
          {item.item.rarity}
        </span>
      </div>
      <span className="catch-time">{item.time}</span>
      <span className="catch-location">{item.location}</span>
    </div>
  );
}

export function FishingGame() {
  const [caughtItems, setCaughtItems] = useState<Catch[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const FISHING_LOTS = [
    'Clear Lake', 'Calm Pond', 'Serene River', 'Hidden Cove',
    'Peaceful Marsh', 'Sunlit Stream', 'Quiet Lake', 'Shallow Creek',
  ];

  const RARITY_COLORS: Record<string, string> = {
    common: '#4a9eff',
    uncommon: '#7c5cff',
    rare: '#ff6b6b',
  };

  const handleThrow = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setLoading(true);
    setInput('');

    // Simulate casting line
    setTimeout(() => {
      const location = FISHING_LOTS[Math.floor(Math.random() * FISHING_LOTS.length)];
      const items: Item[] = [
        { id: 'trout', name: 'Trout', emoji: '🐟', type: 'fish', rarity: 'common' },
        { id: 'bass', name: 'Bass', emoji: '🐟', type: 'fish', rarity: 'common' },
        { id: 'salmon', name: 'Salmon', emoji: '🐟', type: 'fish', rarity: 'common' },
        { id: 'pike', name: 'Pike', emoji: '🐟', type: 'fish', rarity: 'uncommon' },
        { id: 'catfish', name: 'Catfish', emoji: '🐟', type: 'fish', rarity: 'common' },
        { id: 'herring', name: 'Herring', emoji: '🐟', type: 'fish', rarity: 'common' },
        { id: 'carp', name: 'Carp', emoji: '🐟', type: 'fish', rarity: 'common' },
        { id: 'goldfish', name: 'Goldfish', emoji: '🐟', type: 'fish', rarity: 'rare' },
        { id: 'mushroom', name: 'Mushroom', emoji: '🍄', type: 'plant', rarity: 'common' },
        { id: 'berry', name: 'Berry', emoji: '🍓', type: 'plant', rarity: 'common' },
        { id: 'herb', name: 'Herb', emoji: '🌿', type: 'plant', rarity: 'common' },
        { id: 'flower', name: 'Flower', emoji: '🌸', type: 'plant', rarity: 'uncommon' },
        { id: 'moss', name: 'Moss', emoji: '🌿', type: 'plant', rarity: 'common' },
        { id: 'fern', name: 'Fern', emoji: '🌿', type: 'plant', rarity: 'common' },
        { id: 'crystal', name: 'Crystal', emoji: '💎', type: 'mineral', rarity: 'rare' },
        { id: 'stone', name: 'Stone', emoji: '🪨', type: 'mineral', rarity: 'common' },
        { id: 'quartz', name: 'Quartz', emoji: '💎', type: 'mineral', rarity: 'uncommon' },
        { id: 'gem', name: 'Gem', emoji: '💎', type: 'mineral', rarity: 'rare' },
        { id: 'wood', name: 'Wood', emoji: '🪵', type: 'mineral', rarity: 'common' },
        { id: 'shell', name: 'Shell', emoji: '🐚', type: 'mineral', rarity: 'uncommon' },
      ];

      const item = items[Math.floor(Math.random() * items.length)];
      setCaughtItems(prev => [
        {
          id: `catch-${Date.now()}`,
          item,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location,
        },
        ...prev,
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fishing-game">
      <div className="fishing-container">
        <div className="fishing-3d">
          <div className="fishing-water">
            <div className="fishing-surface">
              <span className="fishing-bobber">●</span>
            </div>
          </div>
        </div>

        <div className="fishing-content">
          <h2 className="fishing-title">Fishing & Gathering</h2>
          <p className="fishing-description">
            A calm, quiet fishing spot. Cast your line, gather what you find, and relax.
            No rush, no pressure — just you and the water.
          </p>

          {/* Catch Log */}
          <div className="fishing-catch-log">
            <h3>Today's Catch</h3>
            {caughtItems.length === 0 ? (
              <p className="fishing-empty">Nothing yet. Cast your line!</p>
            ) : (
              <div className="fishing-catch-list">
                {caughtItems.map((fish) => (
                  <CatchItem key={fish.id} item={fish} rarityColors={RARITY_COLORS} />
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form className="fishing-input" onSubmit={handleThrow}>
            <label
              htmlFor="fishing-location"
              style={{
                position: 'absolute',
                clip: 'rect(0, 0, 0, 0)',
              }}
            >
              Fishing location
            </label>
            <select
              id="fishing-location"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a spot...</option>
              {FISHING_LOTS.map(spot => (
                <option key={spot} value={spot}>{spot}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--border)',
                color: 'white',
                fontWeight: 600,
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? 'Casting...' : 'Cast Line'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
