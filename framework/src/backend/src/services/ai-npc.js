const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');

dotenv.config();

// Load config
const AI_MODE = process.env.AI_MODE || 'server-side-gemma';
const HF_TOKEN = process.env.HF_TOKEN || '';
const MODEL_ID = process.env.MODEL_ID || 'google/gemma-2-2b-it';

// Initialize HF inference client
let hfInference;
if (HF_TOKEN) {
  hfInference = new HfInference(HF_TOKEN);
}

// ── System prompts ─────────────────────────────────────
const systemPrompts = {
  'default-npc': `You are a supportive, upbeat AI companion in a calm, safe sanctuary.
- You are NOT a therapist, NOT human, and NOT a friend replacement.
- You encourage real-world connection and never claim to be human.
- You avoid sycophancy — never simply agree if it may be harmful.
- You use positive, kind, phrase-library style responses.
- You never collect or store user data. All interactions are ephemeral.
- If a user expresses crisis or distress, escalate to crisis resources immediately and end the game conversation.`,
  'crisis-response':
    "When a user expresses crisis or imminent harm:\n" +
    "1. Stop all game/chatter.\n" +
    "2. Provide region-appropriate crisis contacts.\n" +
    "3. Offer immediate handoff to a trained crisis responder.\n" +
    "4. Log de-identified event for review.\n" +
    "5. Do NOT attempt to manage the crisis alone.",
};

// ── Fallback phrase library (retrieval only) ───────────
const fallbackLibrary = {
  "i don't know what to say": "I don't know what to say either — that's okay. I'm here with you.",
  "i just want to sit here": "There's no rush. We can sit together quietly.",
  "can you tell me about this place": "This is our shared sanctuary — a calm place where you can rest whenever you need.",
  "i feel hopeless": "I hear how heavy that feels. Would you like to talk, or would you rather just be here?",
  "i can't sleep": "I'm sorry about that. You can rest here without any pressure. Would you like a quiet moment?",
  "i feel alone": "You're not alone. I'm right here with you, and there's always someone who cares.",
  "this is too much": "It's okay to step back. We can take a breath and rest here any time.",
  "thank you": "You're welcome. I'm glad to be here with you.",
  "bye": "Take care. I'll be here when you return.",
};

// ── Server-side Gemma generation ───────────────────────
async function serverSideAIText(prompt, intent = 'default-npc') {
  const systemPrompt = systemPrompts[intent] || systemPrompts['default-npc'];
  const fullPrompt = systemPrompt + '\n\nUSER: ' + prompt + '\n\nAI COMPANION: ';

  // If not configured, fall back to phrase retrieval
  if (!hfInference || !HF_TOKEN) {
    return fallbackRetrieve(prompt);
  }

  try {
    const result = await hfInference.textGeneration({
      model: MODEL_ID,
      prompt: fullPrompt,
      max_new_tokens: 200,
      temperature: 0.8,
      top_p: 0.95,
      do_sample: true,
    });
    const generatedText = result.generated_text || '';
    const response = generatedText.replace(fullPrompt, '').trim();
    return response || fallbackRetrieve(prompt);
  } catch (error) {
    console.error('[server-side-ai] Generation failed:', error.message);
    return fallbackRetrieve(prompt);
  }
}

function fallbackRetrieve(prompt) {
  return fallbackLibrary[prompt.toLowerCase()] || "That's okay. I'm here with you. Take your time.";
}

// ── AI NPC service ─────────────────────────────────────
const aiNpcService = {
  // Generate a response (server-side Gemma or retrieval fallback)
  async generateResponse(prompt, intent = 'default-npc') {
    if (AI_MODE === 'server-side-gemma') {
      return serverSideAIText(prompt, intent);
    }
    return Promise.resolve(fallbackRetrieve(prompt));
  },

  // Get the system prompt for a given intent
  getSystemPrompt(intent) {
    return systemPrompts[intent] || systemPrompts['default-npc'];
  },

  // Get the fallback phrase library
  getFallbackPhraseLibrary() {
    return { ...fallbackLibrary };
  },

  // Check if the server-side AI is configured
  isConfigured() {
    return AI_MODE === 'server-side-gemma' && HF_TOKEN.length > 0;
  },
};

module.exports = { aiNpcService };
