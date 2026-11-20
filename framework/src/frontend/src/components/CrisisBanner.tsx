export function CrisisBanner() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        background: 'rgba(46, 213, 115, 0.2)',
        border: '1px solid rgba(74, 222, 128, 0.5)',
        borderRadius: '8px',
        padding: '12px 16px',
        maxWidth: '320px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '13px',
        color: '#4ade80',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
        🌿 You're safe here
      </div>
      <div>
        If you're in crisis, reach out to a trained professional. You don't have to face this alone.
      </div>
      <div style={{ marginTop: '6px', fontSize: '12px', color: '#a0a0b8' }}>
        US: Call or text <a href="tel:+1988">988</a> · Text HOME to 741741
      </div>
    </div>
  );
}

export function PanicButton() {
  return (
    <button
      onClick={() => {
        // Route to a safe page (crisis resources)
        window.location.hash = '#crisis';
      }}
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        background: 'rgba(248, 113, 113, 0.2)',
        border: '1px solid rgba(248, 113, 113, 0.5)',
        borderRadius: '8px',
        padding: '10px 16px',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '13px',
        color: '#f87171',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 100,
      }}
    >
      🛑 Crisis Help
    </button>
  );
}
