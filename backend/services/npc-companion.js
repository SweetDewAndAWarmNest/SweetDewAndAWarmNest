const { chatService } = require('./chat-moderation');
const { crisisService } = require('./crisis-escalation');
const { aiNpcService } = require('./ai-npc');

// ── Dual-Memory Store ──────────────────────────────────────────────
// Short-term (session) memory: in-memory, per-connection, cleared on disconnect
// Long-term (persistent) memory: stored in a JSON file, survives restarts

const fs = require('fs');
const path = require('path');

// Long-term memory storage
const MEMORY_DIR = path.join(__dirname, '..', 'memory');
if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

// Memory store structure: { [userId]: { memories: [], timeline: [] } }
const longTermMemory = {};

// Load existing long-term memory from disk
const MEMORY_FILE = path.join(MEMORY_DIR, 'longterm.json');
if (fs.existsSync(MEMORY_FILE)) {
  try {
    const data = fs.readFileSync(MEMORY_FILE, 'utf8');
    longTermMemory[userId] = JSON.parse(data);
  } catch (err) {
    console.error('[NPC Memory] Failed to load long-term memory:', err);
  }
}

// Save long-term memory to disk (debounced)
let saveTimer = null;
function saveLongTermMemory() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    try {
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(longTermMemory, null, 2));
      saveTimer = null;
    } catch (err) {
      console.error('[NPC Memory] Failed to save long-term memory:', err);
    }
  }, 2000);
}

// ── Short-Term Memory (per connection) ─────────────────────────────
// Stored in the connection context, cleared on disconnect

class ShortTermMemory {
  constructor(context) {
    this.context = context; // socket connection
    this.memories = [];
    this.timeline = [];
    this.lastAccess = Date.now();
  }

  // Add a memory (short-term)
  addMemory(type, content, metadata = {}) {
    const memory = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      content,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.memories.push(memory);
    this.timeline.push(memory);
    this.lastAccess = Date.now();
    return memory;
  }

  // Search short-term memory
  search(query, limit = 5) {
    return this.timeline
      .filter(m => {
        const text = `${m.content} ${m.type}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, limit);
  }

  // Update last access
  touch() {
    this.lastAccess = Date.now();
  }

  // Clear all memories (called on disconnect)
  clear() {
    this.memories = [];
    this.timeline = [];
  }
}

// ── Long-Term Memory (persistent) ──────────────────────────────────
// Stored per user ID, survives restarts

class LongTermMemoryStore {
  constructor(userId) {
    this.userId = userId;
    this.memories = longTermMemory[userId]?.memories || [];
    this.timeline = longTermMemory[userId]?.timeline || [];
    this.lastAccess = longTermMemory[userId]?.lastAccess || Date.now();
  }

  // Add a long-term memory
  addMemory(type, content, metadata = {}) {
    const memory = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      content,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.memories.push(memory);
    this.timeline.push(memory);
    this.lastAccess = Date.now();
    longTermMemory[this.userId] = {
      memories: this.memories,
      timeline: this.timeline,
      lastAccess: this.lastAccess,
    };
    saveLongTermMemory();
    return memory;
  }

  // Search long-term memory
  search(query, limit = 10) {
    this.touch();
    return this.timeline
      .filter(m => {
        const text = `${m.content} ${m.type}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, limit);
  }

  // Get context for an AI prompt
  getContext(limit = 5) {
    this.touch();
    return {
      memories: this.timeline.slice(-limit).reverse(),
      timelineLength: this.timeline.length,
      lastAccess: this.lastAccess,
    };
  }

  // Touch (update last access)
  touch() {
    this.lastAccess = Date.now();
    longTermMemory[this.userId].lastAccess = this.lastAccess;
    saveLongTermMemory();
  }
}

// ── NPC Companion Service ──────────────────────────────────────────

const memoryStore = new Map(); // userId -> LongTermMemoryStore

function getMemoryStore(userId) {
  if (!memoryStore.has(userId)) {
    memoryStore.set(userId, new LongTermMemoryStore(userId));
  }
  return memoryStore.get(userId);
}

// Generate a response using the AI or fallback
async function generateResponse(prompt, { userId, intent = 'default-npc', roomId, socketId } = {}) {
  const context = userId ? getMemoryStore(userId).getContext(5) : {};

  // If user is in a crisis, escalate immediately
  if (intent === 'crisis-response' || crisisService.isCrisis(prompt)) {
    const protocol = crisisService.getEscalationProtocol(2);
    return `🚨 ${protocol.response}\n\n📞 Crisis Resources:\n${Object.entries(protocol.resources || {}).map(([key, val]) => `${key}: ${val}`).join('\n')}\n\nPlease reach out to a trained professional immediately.`;
  }

  // Build the prompt with context
  const systemPrompt = aiNpcService.getSystemPrompt(intent);
  const contextText = context.memories
    .map(m => `Previous: ${m.content}`)
    .join('\n');

  const fullPrompt = contextText
    ? `${contextText}\n\n${systemPrompt}\n\nUSER: ${prompt}\n\nAI COMPANION:`
    : `${systemPrompt}\n\nUSER: ${prompt}\n\nAI COMPANION:`;

  // Use server-side AI or fallback
  if (aiNpcService.isConfigured()) {
    try {
      const response = await aiNpcService.generateResponse(fullPrompt, intent);
      return response;
    } catch (err) {
      console.error('[NPC] AI generation failed:', err);
    }
  }

  // Fallback to phrase library
  const lowerPrompt = prompt.toLowerCase();
  const fallbackKey = Object.keys(chatService.getPhraseLibrary()).find(key =>
    lowerPrompt.includes(key)
  );
  if (fallbackKey) {
    return chatService.getPhraseLibrary()[fallbackKey];
  }
  return "That's okay. I'm here with you. Take your time.";
}

// Get the NPC's greeting message
function getGreeting() {
  const greetings = [
    "Welcome to the Nest. I'm your companion. You can always return here.",
    "Hello there. This is a safe place. Take your time.",
    "Hi. I'm glad you're here. We can sit quietly together if you like.",
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// Get the NPC's current state description
function getStateDescription() {
  const states = [
    "I'm here and listening. Take your time.",
    "I'm sitting quietly. The kettle's on.",
    "Just waiting for you. No pressure at all.",
  ];
  return states[Math.floor(Math.random() * states.length)];
}

// Save a memory to long-term storage
function saveMemory(userId, type, content, metadata = {}) {
  if (!userId) return;
  const store = getMemoryStore(userId);
  return store.addMemory(type, content, metadata);
}

// Get memories for a user
function getMemories(userId, limit = 10) {
  if (!userId) return [];
  const store = getMemoryStore(userId);
  return store.search('.', limit);
}

// ── Export ─────────────────────────────────────────────────────────

module.exports = {
  generateResponse,
  getGreeting,
  getStateDescription,
  saveMemory,
  getMemories,
  LongTermMemoryStore,
  ShortTermMemory,
};
