import { useState, useEffect, Suspense } from 'react';
import { Hub } from './Hub';

interface ChatMessage {
  id: string;
  roomId: string;
  text: string;
  timestamp: string;
  validated: boolean;
  isOwn?: boolean;
  isAI?: boolean;
  sender?: 'user' | 'ai' | 'system';
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
      window.dispatchEvent(new CustomEvent('chat-message', { detail: msg }));
    } catch {
      // binary or non-JSON
    }
  };
  socket.onclose = () => {
    socket = null;
    setIsConnected(false);
  };
}

// ── AI NPC service ─────────────────────────────────────
const aiNpcService = {
  // Generate a response using server-side Gemma (or retrieval fallback)
  async generateResponse(prompt: string, intent: string = 'default-npc'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected to server'));
        return;
      }
      socket.send(JSON.stringify({ type: 'ai-response', prompt, intent }));
      // The response will arrive via the onmessage handler (see above)
    });
  },
};

// ═══════════════════════════════════════════════════════
// Hub container
// ═══════════════════════════════════════════════════════
export function HubContainer() {
  const [roomId] = useState(`nest-${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [library, setLibrary] = useState<Record<string, string>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(true);

  // Subscribe to chat-message events
  useEffect(() => {
    // Load phrase library
    chatService.loadLibrary().then((lib) => {
      setLibrary(lib);
      setLoadingLibrary(false);
    }).catch(() => {
      setLoadingLibrary(false);
    });

    // Connect to backend WebSocket
    connectSocket(roomId);
    setIsConnected(true);

    // Subscribe to chat messages
    const handleMessage = (e: Event) => {
      const msg = (e as CustomEvent).detail as ChatMessage;
      if (msg) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    window.addEventListener('chat-message', handleMessage as unknown as EventListener);
    return () => window.removeEventListener('chat-message', handleMessage as unknown as EventListener);
  }, [roomId]);

  const handleSendMessage = async (text: string, roomId: string) => {
    // Validate message against phrase library
    const result = await chatService.validateMessage(text);
    if (!result.valid) {
      return;
    }

    const msg: ChatMessage = {
      id: `user-${Date.now()}`,
      roomId,
      text: result.text,
      timestamp: new Date().toISOString(),
      validated: true,
      isOwn: true,
      sender: 'user',
    };
    setMessages((prev) => [...prev, msg]);

    // Broadcast to backend
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'chat-message', text: result.text, roomId }));
    }

    // Generate AI response (server-side Gemma fallback)
    try {
      const aiResponse = await aiNpcService.generateResponse(result.text, 'chat');
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        roomId,
        text: aiResponse,
        timestamp: new Date().toISOString(),
        validated: true,
        isOwn: false,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const sysMsg: ChatMessage = {
        id: `sys-${Date.now()}`,
        roomId,
        text: "I'm having trouble connecting right now. Let's just rest here together.",
        timestamp: new Date().toISOString(),
        validated: true,
        isOwn: false,
        sender: 'system',
      };
      setMessages((prev) => [...prev, sysMsg]);
    }
  };

  return (
    <Suspense fallback={<div>Loading sanctuary...</div>}>
      <Hub roomId={roomId} chat={messages} onSendMessage={handleSendMessage} />
    </Suspense>
  );
}
