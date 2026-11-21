import React, { useState, useEffect, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────
export interface NPCMessage {
  id: string;
  roomId: string;
  text: string;
  timestamp: string;
  isAI: boolean;
  sender: 'user' | 'ai' | 'system';
  isEmoji?: boolean;
}

export interface NPCMessageWithMemory extends NPCMessage {
  memoryId?: string;
  isOwn?: boolean;
}

// ── NPC Companion Component ────────────────────────────────────────
export function NPCCompanion({ roomId, userId }: { roomId: string; userId: string }) {
  const [messages, setMessages] = useState<NPCMessage[]>([
    {
      id: 'welcome',
      roomId,
      text: 'Welcome to the Nest. I\'m your companion. You can always return here.',
      timestamp: new Date().toISOString(),
      isAI: true,
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [memories, setMemories] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://${window.location.hostname}:3000`);
    setSocket(ws);

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({
        action: 'join-room',
        roomId,
      }));

      // Join NPC room
      ws.send(JSON.stringify({
        action: 'join-npc',
        roomId,
        userId,
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'npc-action':
          setMessages(prev => [...prev, {
            id: data.id,
            roomId,
            text: data.response,
            timestamp: data.timestamp,
            isAI: true,
            sender: 'ai',
          }]);
          break;
        case 'npc-memories':
          setMemories(data.memories || []);
          break;
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      ws.close();
    };
  }, [roomId, userId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !socket || !connected) return;

    socket.send(JSON.stringify({
      action: 'message',
      content: text,
      roomId,
      userId,
    }));

    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      roomId,
      text,
      timestamp: new Date().toISOString(),
      isAI: false,
      sender: 'user',
    }]);
    setInput('');
  };

  const handleGreeting = () => {
    if (!socket || !connected) return;
    socket.send(JSON.stringify({
      action: 'greeting',
      roomId,
      userId,
    }));
  };

  const handleState = () => {
    if (!socket || !connected) return;
    socket.send(JSON.stringify({
      action: 'state',
      roomId,
      userId,
    }));
  };

  return (
    <div className="npc-companion">
      {/* NPC Avatar */}
      <div className="npc-avatar">
        <div className="npc-avatar-image">
          <span>♡</span>
        </div>
        <div className="npc-label">
          <strong>Companion</strong>
          <span>AI friend</span>
        </div>
        <div className="npc-status">
          <span className="status-dot" />
          <span>Listening...</span>
        </div>
      </div>

      {/* Message List */}
      <div className="npc-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`npc-message ${msg.sender === 'user' ? 'user' : 'ai'}`}
          >
            <div className="npc-message-header">
              <span className={`npc-avatar-sm ${msg.sender === 'user' ? 'you' : 'ai'}`}>
                {msg.sender === 'ai' ? 'AI' : 'You'}
              </span>
              <span className="npc-message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div
              className="npc-message-text"
              style={{
                backgroundColor: msg.sender === 'user' ? '#7c5cff' : 'transparent',
                color: msg.sender === 'user' ? '#fff' : '#f5f5f5',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="npc-input" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a kind message..."
          disabled={!connected}
        />
        <button
          type="submit"
          disabled={!input.trim() || !connected}
          aria-label="Send message"
        >
          Send
        </button>
      </form>

      {/* Quick Actions */}
      <div className="npc-quick-actions">
        <button
          type="button"
          onClick={handleGreeting}
          disabled={!connected}
        >
          Say Hello
        </button>
        <button
          type="button"
          onClick={handleState}
          disabled={!connected}
        >
          Check State
        </button>
        <button
          type="button"
          onClick={() => {
            if (!socket || !connected) return;
            socket.send(JSON.stringify({
              action: 'npc-memories',
              userId,
            }));
          }}
          disabled={!connected}
        >
          Show Memories ({memories.length})
        </button>
      </div>
    </div>
  );
}
