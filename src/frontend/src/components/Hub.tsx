import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Center, Float } from '@react-three/drei';

// ── Types ──────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  roomId: string;
  text: string;
  timestamp: string;
  validated: boolean;
  isOwn?: boolean;
  isAI?: boolean;
  sender?: 'user' | 'ai' | 'system';
  isEmoji?: boolean;
}

interface HubProps {
  roomId: string;
  chat: ChatMessage[];
  onSendMessage: (text: string, roomId: string) => void;
  library?: Record<string, string>;
}

// ── Theme helpers ──────────────────────────────────────
const theme = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  surfaceHover: '#252545',
  accent: '#7c5cff',
  text: '#f5f5f5',
  textSecondary: '#a0a0b8',
  border: '#2a2a42',
};

// ── 3D Hub ─────────────────────────────────────────────
function HubScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <Environment preset="sunset" />
      <Center>
        <Float speed={1.5}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.3}
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </Float>
      </Center>
      <ContactShadows
        position={[0, -0.05, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        color="rgba(0,0,0,0.4)"
      />
    </>
  );
}

// ── Chat bubble ────────────────────────────────────────
function ChatBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  const isAI = message.isAI || (message.sender === 'ai');
  const isSystem = message.sender === 'system';
  const displayName = isAI ? 'AI Companion' : isSystem ? 'System' : (isOwn ? 'You' : 'Companion');
  const bubbleClass = isOwn ? 'own' : isAI ? 'ai-bubble' : isSystem ? 'system-bubble' : 'guest';
  const bubbleColor = isOwn ? theme.accent : isAI ? '#4a9eff' : isSystem ? '#888' : theme.text;

  return (
    <div
      className={`chat-bubble ${bubbleClass}`}
      style={{
        maxWidth: '80%',
        animation: `fadeIn 0.3s ease-out`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: bubbleColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {isAI ? 'AI' : isSystem ? '·' : (isOwn ? 'Y' : '♡')}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: bubbleColor,
              }}
            >
              {displayName}
            </p>
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '10px',
                color: theme.textSecondary,
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p
            className="chat-text"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              lineHeight: '1.5',
              color: bubbleColor,
              fontStyle: isSystem ? 'italic' : 'normal',
            }}
          >
            {message.text}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Hub ────────────────────────────────────────────────
export function Hub({ roomId, chat, onSendMessage, library = {} }: HubProps) {
  const [messages, setMessages] = useState(chat);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chat);
  }, [chat]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSendMessage(text, roomId);
    setInput('');
  };

  return (
    <div className="hub">
      <header className="hub-header">
      <h1 style={{ fontSize: '2rem', fontFamily: 'Playfair Display, serif' }}>
        Sweet Dew And A Warm Nest
      </h1>
      <p style={{ color: theme.textSecondary }}>
        A calm sanctuary — take your time, breathe, and be here.
      </p>
    </header>

    <main id="main-content" className="hub-main">
      <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isOwn={msg.isOwn || false}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <label htmlFor="chat-input" style={{ position: 'absolute', clip: 'rect(0, 0, 0, 0)', fontSize: '1px' }}>
              Type a kind message, then press Enter
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a kind message, or choose a phrase from the library..."
              disabled={!chat}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                background: theme.surface,
                color: theme.text,
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label={input.trim() ? `Send message: ${input.trim()}` : 'Send'}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: input.trim() ? theme.accent : 'var(--border)',
                color: 'white',
                fontWeight: 600,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Send
            </button>
          </form>

          {/* Phrase library selector */}
          <div className="phrase-library">
            <details style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
              <summary style={{ padding: '8px 12px', cursor: 'pointer', color: theme.textSecondary, fontWeight: 600, fontSize: '13px' }}>
                Phrase Library
              </summary>
              <div style={{ padding: '8px 12px' }}>
                {library && Object.entries(library).length > 0 ? (
                  Object.entries(library).map(([id, text]) => (
                    <button
                      key={id}
                      onClick={() => onSendMessage(text, roomId)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '6px 10px',
                        margin: '4px 0',
                        borderRadius: '6px',
                        border: `1px solid ${theme.border}`,
                        background: theme.surface,
                        color: theme.text,
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontFamily: 'Inter, system-ui, sans-serif',
                      }}
                    >
                      {id}: {text}
                    </button>
                  ))
                ) : (
                  <p style={{ fontSize: '12px', color: theme.textSecondary }}>Loading phrase library...</p>
                )}
              </div>
            </details>
          </div>
        </div>
      </main>

      <footer className="hub-footer">
        <p>
          Tip: Everything here is positive-only. If you're in crisis, reach out to a
          trained professional.
        </p>
        <a
          href="/"
          style={{
            color: theme.accent,
            textDecoration: 'underline',
            fontSize: '12px',
          }}
        >
          Crisis resources
        </a>
      </footer>

      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <HubScene />
      </Canvas>
    </div>
  );
}
