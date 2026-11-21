import { useState } from 'react';

// ── Avatar Creation System ─────────────────────────────────────────
// Humanoid + non-human base forms with customization options

export type AvatarType = 'humanoid' | 'taur' | 'winged' | 'quadruped';
export type BodyColor = 'white' | 'black' | 'brown' | 'red' | 'grey' | 'rainbow';
export type HairColor = 'white' | 'black' | 'brown' | 'red' | 'blonde' | 'blue' | 'green' | 'purple' | 'rainbow';

interface AvatarConfig {
  type: AvatarType;
  bodyColor: BodyColor;
  hairColor: HairColor;
  name: string;
}

const AVATAR_NAMES = [
  'Aria', 'Boreas', 'Calypso', 'Dawn', 'Elara', 'Fenrir', 'Glynnis',
  'Hazel', 'Iris', 'Juno', 'Kai', 'Lume', 'Mira', 'Nova', 'Owen',
  'Piper', 'Quinn', 'Riven', 'Sage', 'Tess', 'Uma', 'Vale', 'Wren', 'Xan',
];

export function AvatarCreator() {
  const [config, setConfig] = useState<AvatarConfig>({
    type: 'humanoid',
    bodyColor: 'white',
    hairColor: 'brown',
    name: AVATAR_NAMES[0],
  });

  const updateConfig = (key: keyof AvatarConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value as never }));
  };

  const getAvatarDescription = () => {
    const typeDescriptions: Record<AvatarType, string> = {
      humanoid: 'A gentle human form, grounded and familiar.',
      taur: 'A being with a horse-like lower body and human upper body.',
      winged: 'A winged being with the ability to fly through the air.',
      quadruped: 'A four-legged companion, steady and loyal.',
    };
    return typeDescriptions[config.type];
  };

  const getBodyColorOptions = () => {
    const colors: BodyColor[] = ['white', 'black', 'brown', 'red', 'grey'];
    return colors.map(color => (
      <label key={color}>
        <input
          type="radio"
          name="bodyColor"
          value={color}
          checked={config.bodyColor === color}
          onChange={() => updateConfig('bodyColor', color)}
        />
        <span
          style={{
            display: 'inline-block',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: color === 'rainbow' ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' : undefined,
            border: '2px solid var(--border)',
            cursor: 'pointer',
          }}
        />
      </label>
    ));
  };

  const getHairColorOptions = () => {
    const colors: HairColor[] = ['white', 'black', 'brown', 'red', 'blonde', 'blue', 'green', 'purple'];
    return colors.map(color => (
      <label key={color}>
        <input
          type="radio"
          name="hairColor"
          value={color}
          checked={config.hairColor === color}
          onChange={() => updateConfig('hairColor', color)}
        />
        <span
          style={{
            display: 'inline-block',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: color === 'rainbow' ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' : undefined,
            border: '2px solid var(--border)',
            cursor: 'pointer',
          }}
        />
      </label>
    ));
  };

  return (
    <div className="avatar-creator">
      <div className="avatar-creator-container">
        <div className="avatar-creator-preview">
          <div className="avatar-3d">
            <div className={`avatar-body avatar-body-${config.type}`}>
              <div className={`avatar-head avatar-head-${config.type}`}>
                <div className="avatar-hair" style={{ backgroundColor: config.hairColor === 'rainbow' ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' : undefined }}>
                  <span>◈</span>
                </div>
                <div className={`avatar-eyes`}>
                  <span className="eye"></span>
                  <span className="eye"></span>
                </div>
                <div className="avatar-mouth">
                  <span>◡</span>
                </div>
              </div>
              <div className={`avatar-body-core`}>
                <div className="avatar-body-center" style={{ backgroundColor: config.bodyColor === 'rainbow' ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' : undefined }}>
                  <span>◈</span>
                </div>
              </div>
            </div>
          </div>
          <div className="avatar-name-display">
            <strong>{config.name}</strong>
            <span>{config.type} form</span>
          </div>
        </div>

        <div className="avatar-creator-settings">
          <h3>Create Your Avatar</h3>

          {/* Avatar Type */}
          <div className="avatar-setting">
            <label>Form</label>
            <div className="avatar-type-options">
              {(['humanoid', 'taur', 'winged', 'quadruped'] as AvatarType[]).map(type => (
                <label key={type}>
                  <input
                    type="radio"
                    name="avatarType"
                    value={type}
                    checked={config.type === type}
                    onChange={() => updateConfig('type', type)}
                  />
                  <span className={`avatar-type-badge avatar-type-badge-${type}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Body Color */}
          <div className="avatar-setting">
            <label>Body Color</label>
            <div className="avatar-color-options">
              {getBodyColorOptions()}
            </div>
          </div>

          {/* Hair Color */}
          <div className="avatar-setting">
            <label>Hair Color</label>
            <div className="avatar-color-options">
              {getHairColorOptions()}
            </div>
          </div>

          {/* Name */}
          <div className="avatar-setting">
            <label>Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => updateConfig('name', e.target.value)}
              placeholder="Choose a name..."
              list="avatar-names"
            />
            <datalist id="avatar-names">
              {AVATAR_NAMES.map(name => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          {/* Description */}
          <div className="avatar-setting">
            <label>Description</label>
            <p className="avatar-description">{getAvatarDescription()}</p>
          </div>

          {/* Save */}
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('sdaawn-avatar', JSON.stringify(config));
              alert(`Avatar saved! Welcome, ${config.name}.`);
            }}
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
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
