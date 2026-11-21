import React, { useState } from 'react';

// ── Bench (Consensual Conversation) ────────────────────────────────
// A dedicated space for quiet, consensual conversation with the AI NPC

export function Bench() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ id: string; text: string; timestamp: string; sender: MessageSender }[]>([
    {
      id: 'bench-welcome',
      text: 'Welcome to the Bench. This is a quiet place for conversation. You can sit here whenever you need.',
      timestamp: new Date().toISOString(),
      sender: 'system',
    },
  ]);

  type MessageSender = 'system' | 'user' | 'ai';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, {
      id: `bench-${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      sender: 'user' as MessageSender,
    }]);
    setInput('');
  };

  return (
    <div className="bench">
      <div className="bench-container">
        <div className="bench-3d">
          <div className="bench-sphere">
            <span>◉</span>
          </div>
        </div>
        <div className="bench-content">
          <h2 className="bench-title">The Bench</h2>
          <p className="bench-description">
            A quiet place for conversation. Sit here when you need to talk, think, or rest.
            You can always come back.
          </p>

          {/* Message Log */}
          <div className="bench-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bench-message ${msg.sender}`}
                style={{
                  backgroundColor: msg.sender === 'user' ? 'var(--accent)' : 'var(--surface)',
                  color: msg.sender === 'user' ? 'white' : 'var(--text)',
                }}
              >
                <div className="bench-message-header">
                  <span className={`bench-avatar ${msg.sender}`}>
                    {msg.sender === 'user' ? 'You' : 'Bench'}
                  </span>
                  <span className="bench-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="bench-message-text">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <form className="bench-input" onSubmit={handleSend}>
            <label htmlFor="bench-input" style={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}>
              Type a message...
            </label>
            <input
              id="bench-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share something with the Bench..."
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: input.trim() ? 'var(--accent)' : 'var(--border)',
                color: 'white',
                fontWeight: 600,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
