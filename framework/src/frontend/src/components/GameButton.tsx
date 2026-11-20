export function GameButton({ roomId, label }: { roomId: string; label: string }) {
  return (
    <button
      onClick={() => {
        // Join a game room
        const socket = new WebSocket(`ws://localhost:3000?roomId=${roomId}`);
        socket.onopen = () => {
          socket.send(JSON.stringify({ type: 'join-game', gameId: roomId }));
        };
      }}
      style={{
        padding: '12px 20px',
        borderRadius: '8px',
        border: 'none',
        background: '#7c5cff',
        color: 'white',
        fontWeight: 600,
        fontSize: '15px',
        cursor: 'pointer',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'background 0.2s',
        boxShadow: '0 4px 12px rgba(124, 92, 255, 0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#8f6cff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#7c5cff';
      }}
    >
      {label}
    </button>
  );
}
