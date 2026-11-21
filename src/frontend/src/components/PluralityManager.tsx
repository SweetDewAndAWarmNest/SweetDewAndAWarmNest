import React, { useState } from 'react';

// ── Plurality Support ──────────────────────────────────────────────
// Multiple forms in one account, private kintype notes

interface FormRecord {
  id: string;
  name: string;
  form: 'humanoid' | 'taur' | 'winged' | 'quadruped';
  bodyColor: string;
  hairColor: string;
  isDefault: boolean;
}

type FormType = 'humanoid' | 'taur' | 'winged' | 'quadruped';

interface PluralityManagerProps {
  forms: FormRecord[];
  onAddForm: (name: string, form: FormRecord) => void;
  onRemoveForm: (id: string) => void;
  onSwitchForm: (id: string) => void;
  onKintypeNote: (note: string) => void;
}

export function PluralityManager({
  forms,
  onAddForm,
  onRemoveForm,
  onSwitchForm,
  onKintypeNote,
}: PluralityManagerProps) {
  const [kintypeNote, setKintypeNote] = useState('');

  const handleSaveKintypeNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (kintypeNote.trim()) {
      onKintypeNote(kintypeNote);
      setKintypeNote('');
    }
  };

  return (
    <div className="plurality-manager">
      <h3>Your Forms ({forms.length})</h3>

      {/* Form List */}
      <div className="form-list">
        {forms.map((form) => (
          <div
            key={form.id}
            className={`form-item ${form.isDefault ? 'default' : ''}`}
          >
            <div className="form-item-header">
              <span className={`form-badge form-badge-${form.form}`}>
                {form.form.charAt(0).toUpperCase() + form.form.slice(1)}
              </span>
              <div className="form-item-actions">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => onSwitchForm(form.id)}
                >
                  Activate
                </button>
                <button
                  type="button"
                  className="btn-link btn-danger"
                  onClick={() => onRemoveForm(form.id)}
                  disabled={forms.length <= 1}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="form-item-details">
              <strong>{form.name}</strong>
              <p>{form.form} form • Body: {form.bodyColor} • Hair: {form.hairColor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Form */}
      <div className="form-add">
        <form
          className="form-add-form"
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const name = (formData.get('name') as string).trim() || 'New Form';
            const form = (formData.get('form') as FormType) || 'humanoid';
            onAddForm(name, {
              id: `form-${Date.now()}`,
              name,
              form,
              bodyColor: 'white',
              hairColor: 'black',
              isDefault: false,
            });
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Form name"
            required
          />
          <select name="form">
            <option value="humanoid">Humanoid</option>
            <option value="taur">Taur</option>
            <option value="winged">Winged</option>
            <option value="quadruped">Quadruped</option>
          </select>
          <button type="submit">Add Form</button>
        </form>
      </div>

      {/* Kintype Notes (Private) */}
      <div className="kintype-notes">
        <h4>Private Kintype Notes</h4>
        <p className="kintype-note-description">
          These notes are private and never shared with others.
          Use them to record your identity, preferences, or anything
          you want to remember.
        </p>
        <form
          className="kintype-note-form"
          onSubmit={handleSaveKintypeNote}
        >
          <textarea
            name="kintypeNote"
            placeholder="Write your kintype notes here..."
            rows={4}
            value={kintypeNote}
            onChange={(e) => setKintypeNote(e.target.value)}
          />
          <button type="submit">Save Notes</button>
        </form>
        {kintypeNote && (
          <div className="kintype-note-saved">
            <span>Notes saved ✓</span>
          </div>
        )}
      </div>
    </div>
  );
}
