import { Hub } from './components/Hub';
import type { ChatMessage } from './components/Hub';

export default function App() {
  const roomId = `nest-${Date.now()}`;
  const chat: ChatMessage[] = [];
  const handleSendMessage = () => {};

  return (
    <div className="app">
      {/* Skip link for keyboard users (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          top: -40,
          left: 0,
          background: 'var(--accent)',
          color: '#fff',
          padding: '8px 16px',
          zIndex: 100,
          fontSize: '14px',
        }}
      >
        Skip to main content
      </a>
      <Hub roomId={roomId} chat={chat} onSendMessage={handleSendMessage} />
    </div>
  );
}
