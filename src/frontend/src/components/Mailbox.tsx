import React, { useState } from 'react';

// ── Mailbox (Asynchronous Kindness) ────────────────────────────────
// Leave messages for other users or times

export function Mailbox() {
  type MessageType = 'system' | 'outgoing';

  const [messages, setMessages] = useState<{ id: string; from: string; text: string; timestamp: string; type: MessageType }[]>([
    {
      id: 'mail-welcome',
      from: 'System',
      text: 'Welcome to the Nest. Leave a message for someone who needs kindness.',
      timestamp: new Date().toISOString(),
      type: 'system',
    },
  ]);
  const [input, setInput] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !recipient) return;

    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [
        {
          id: `mail-${Date.now()}`,
          from: recipient,
          text,
          timestamp: new Date().toISOString(),
          type: 'outgoing' as MessageType,
        },
        ...prev,
      ]);
      setInput('');
      setRecipient('');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="mailbox">
      <div className="mailbox-container">
        <div className="mailbox-3d">
          <div className="mailbox-envelope">
            <span>✉</span>
            <div className="mailbox-lid"></div>
          </div>
        </div>
        <div className="mailbox-content">
          <h2 className="mailbox-title">The Mailbox</h2>
          <p className="mailbox-description">
            Leave a message of kindness for someone. It can be for now, or for later.
            You can also check messages left by others.
          </p>

          {/* Send Message */}
          <div className="mailbox-send">
            <form className="mailbox-form" onSubmit={handleSend}>
              <label htmlFor="mailbox-recipient" style={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}>
                Recipient
              </label>
              <input
                id="mailbox-recipient"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Who is this for? (name or handle)"
              />
              <label htmlFor="mailbox-message" style={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)' }}>
                Your message
              </label>
              <textarea
                id="mailbox-message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write something kind..."
                rows={4}
              />
              <button
                type="submit"
                disabled={!input.trim() || !recipient || loading}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: (input.trim() && recipient) ? 'var(--accent)' : 'var(--border)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: (input.trim() && recipient) ? 'pointer' : 'not-allowed',
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Messages */}
          <div className="mailbox-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mailbox-message ${msg.type}`}
                style={{
                  backgroundColor: msg.type === 'outgoing' ? 'var(--accent)' : 'var(--surface)',
                  color: msg.type === 'outgoing' ? 'white' : 'var(--text)',
                }}
              >
                <div className="mailbox-message-header">
                  <span className={`mailbox-avatar ${msg.type}`}>
                    {msg.type === 'outgoing' ? 'You' : 'From'}
                  </span>
                  <span className="mailbox-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="mailbox-message-text">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
