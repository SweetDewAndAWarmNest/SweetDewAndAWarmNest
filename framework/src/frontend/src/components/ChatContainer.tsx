import { useState, useEffect, Suspense } from 'react';
import { Hub } from './Hub';

interface ChatMessage {
  id: string;
  roomId: string;
  text: string;
  timestamp: string;
  validated: boolean;
  isOwn?: boolean;
}

// ═══════════════════════════════════════════════════════
// Backend API client (CORS: http://localhost:3000)
// ═══════════════════════════════════════════════════════
const API_BASE = 'http://localhost:3000';

async function apiGet(path: string) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPost(path: string, body: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

// ── Phrase library loader ──────────────────────────────
async function loadPhraseLibrary(): Promise<{ phrases: Record<string, string> }> {
  return apiGet('/api/chat/library');
}

// ── Chat service ───────────────────────────────────────
const chatService = {
  async validateMessage(text: string): Promise<{ valid: boolean; reasons?: string[]; text: string; isEmoji?: boolean }> {
    return apiPost('/api/chat/validate', { text });
  },

  async loadLibrary(): Promise<Record<string, string>> {
    const data = await loadPhraseLibrary();
    return data.phrases || {};
  },
};

// ── Socket.IO client (for real-time chat) ─────────────
let socket: WebSocket | null = null;

function connectSocket(roomId: string) {
  if (socket) return;
  socket = new WebSocket(`ws://localhost:3000?roomId=${roomId}`);
  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'chat-message') {
        console.log('[socket]', msg);
      }
    } catch {
      // binary or non-JSON
    }
  };
}

// ═══════════════════════════════════════════════════════
// Hub container
// ═══════════════════════════════════════════════════════
export function HubContainer() {
  const [roomId] = useState(`nest-${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Load phrase library
    chatService.loadLibrary().then(() => {
      // Library loaded but not rendered in this simplified UI
    }).finally(() => {
      // Connection established
    });

    // Connect to backend WebSocket
    connectSocket(roomId);

    // Subscribe to chat messages
    const handleMessage = (msg: unknown) => {
      setMessages((prev) => [...prev, msg as ChatMessage]);
    };
    window.addEventListener('chat-message', handleMessage as unknown as EventListener);
    return () => window.removeEventListener('chat-message', handleMessage as unknown as EventListener);
  }, [roomId]);

  const handleSendMessage = async (text: string, roomId: string) => {
    // Validate locally first (positive-only)
    const result = await chatService.validateMessage(text);
    if (result.valid) {
      const msg: ChatMessage = {
        id: `local-${Date.now()}`,
        roomId,
        text: result.text,
        timestamp: new Date().toISOString(),
        validated: true,
        isOwn: true,
      };
      setMessages((prev) => [...prev, msg]);
      // Broadcast to backend
      if (socket) {
        socket.send(JSON.stringify({ type: 'chat-message', text: result.text, roomId }));
      }
    }
  };

  return (
    <Suspense fallback={<div>Loading sanctuary...</div>}>
      <Hub roomId={roomId} chat={messages} onSendMessage={handleSendMessage} />
    </Suspense>
  );
}
