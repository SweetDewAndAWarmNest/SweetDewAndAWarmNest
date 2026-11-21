import { useState } from 'react';

// ── Emote Picker ────────────────────────────────────────────────────
// Gallery of species-appropriate emotes

type FormType = 'humanoid' | 'taur' | 'winged' | 'quadruped';

interface Emote {
  id: string;
  form: FormType[];
  name: string;
  description: string;
}

export const EMOTES: Emote[] = [
  // Humanoid
  { id: 'humanoid-wave', form: ['humanoid'], name: 'Wave', description: 'Friendly greeting' },
  { id: 'humanoid-dance', form: ['humanoid'], name: 'Dance', description: 'Joyful celebration' },
  { id: 'humanoid-thumbsup', form: ['humanoid'], name: 'Thumbs Up', description: 'Great job!' },
  { id: 'humanoid-hug', form: ['humanoid'], name: 'Hug', description: 'Warm embrace' },
  { id: 'humanoid-bow', form: ['humanoid'], name: 'Bow', description: 'Gracious greeting' },
  // Taur
  { id: 'taur-ears-up', form: ['taur'], name: 'Ears Up', description: 'Attentive and happy' },
  { id: 'taur-tail-swish', form: ['taur'], name: 'Tail Swish', description: 'Light and happy' },
  { id: 'taur-happy', form: ['taur'], name: 'Happy', description: 'Content and joyful' },
  { id: 'taur-proud', form: ['taur'], name: 'Proud', description: 'Confident and proud' },
  { id: 'taur-sleepy', form: ['taur'], name: 'Sleepy', description: 'Tired and relaxed' },
  // Winged
  { id: 'winged-flap', form: ['winged'], name: 'Wing Flap', description: 'Excited and happy' },
  { id: 'winged-glide', form: ['winged'], name: 'Gentle Glide', description: 'Calm and peaceful' },
  { id: 'winged-spread', form: ['winged'], name: 'Happy Spread', description: 'Happy and free' },
  // Quadruped
  { id: 'quad-sniff', form: ['quadruped'], name: 'Sniff', description: 'Curious and exploring' },
  { id: 'quad-stretch', form: ['quadruped'], name: 'Stretch', description: 'Good morning stretch' },
  { id: 'quad-wag', form: ['quadruped'], name: 'Wag', description: 'Happy and friendly' },
  { id: 'quad-lie-down', form: ['quadruped'], name: 'Lie Down', description: 'Relaxing' },
];

export function EmotePicker() {
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);

  return (
    <div className="emote-picker">
      <h3 className="emote-title">Species-Appropriate Emotes</h3>

      {/* Form Selector */}
      <div className="emote-form-selector">
        <label htmlFor="form-selector">Choose your form:</label>
        <select
          id="form-selector"
          value={selectedForm || ''}
          onChange={(e) => setSelectedForm(e.target.value as FormType)}
        >
          <option value="">All forms</option>
          <option value="humanoid">Humanoid</option>
          <option value="taur">Taur</option>
          <option value="winged">Winged</option>
          <option value="quadruped">Quadruped</option>
        </select>
      </div>

      {/* Emote Grid */}
      <div className="emote-grid">
        {EMOTES
          .filter(e => !selectedForm || e.form.includes(selectedForm!))
          .map((emote) => {
            const currentForm = selectedForm || 'humanoid';
            return (
              <div
                key={emote.id}
                className={`emote-card ${emote.form.includes(currentForm as FormType) ? 'selected' : ''}`}
              >
                <div className="emote-icon">
                  <span>✨</span>
                </div>
                <div className="emote-info">
                  <h4>{emote.name}</h4>
                  <p>{emote.description}</p>
                </div>
                <div className="emote-forms">
                  {emote.form.map(form => (
                    <span key={form} className={`form-badge form-badge-${form}`}>
                      {form.charAt(0).toUpperCase() + form.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
