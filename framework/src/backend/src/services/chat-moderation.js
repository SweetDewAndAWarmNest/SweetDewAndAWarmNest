const express = require('express');
const router = express.Router();

// In-memory phrase library (from test_phrase_library.py)
const phraseLibrary = {
  "greeting": "Hello! I'm glad you're here.",
  "thanks": "Thank you! That means a lot.",
  "apology": "I'm sorry to hear that. I'm here for you.",
  "goodbye": "Take care. I hope you have a gentle day.",
  "welcome": "Welcome! You can leave at any time.",
  "praise": "That was a really kind thing to say.",
  "empathy1": "That sounds really hard. I'm listening.",
  "empathy2": "It's okay to feel however you're feeling.",
  "empathy3": "I'm here with you. You don't have to do this alone.",
  "empathy4": "Thank you for sharing that with me.",
  "empathy5": "Your feelings are valid, even if they're heavy right now.",
  "ground1": "Let's take a slow breath together.",
  "ground2": "You're safe right now. Nothing needs to be fixed right away.",
  "ground3": "Would you like to sit quietly for a moment?",
  "ground4": "I'm just a quiet presence. No pressure at all.",
  "ground5": "You can take your time. Everything is okay.",
  "suggestion1": "Would you like to explore the hub together?",
  "suggestion2": "There's a quiet bench you can sit on if you like.",
  "suggestion3": "We could try a small, gentle game if you like.",
  "suggestion4": "I can sit with you while you're here.",
  "suggestion5": "There's no rush. We can move at whatever pace feels right.",
  "kind1": "You are enough, exactly as you are.",
  "kind2": "It's okay to rest. Resting is not failing.",
  "kind3": "There is no right way to be here. You're doing fine.",
  "kind4": "This place is yours. You can stay as long as you like.",
  "kind5": "I'm happy you're here.",
  "reflect_turn": "Can you tell me more about what's on your mind?",
  "support_sign": "You don't have to carry this alone.",
  "soft_check": "How are you feeling right now, in this moment?",
  "offer_space": "Would it help to talk, or would you rather just be here?",
};

const positiveEmojis = ["👋", "😊", "❤️", "☀️", "🍃", "★", "👍", "🕊️", "🤗", "✨"];

// Validate a message against the phrase library
function validateMessage(text, roomId) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return { valid: false, reasons: ['Empty message'], text: '' };
  }

  const lower = text.toLowerCase().trim();

  // Check if the message matches a phrase ID
  if (phraseLibrary[lower]) {
    return { valid: true, text: phraseLibrary[lower] };
  }

  // Check for positive emojis only
  const emojiRegex = /[\p{Emoji_Presentation}\u200D\p{Emoji}]/gu;
  const emojis = lower.match(emojiRegex);
  if (emojis && emojis.length > 0) {
    const allPositive = emojis.every(e => positiveEmojis.includes(e));
    if (allPositive) {
      return { valid: true, text: lower, isEmoji: true };
    }
  }

  // Default: allow the message (server-side hard validation would happen in production)
  // For now, we allow but flag for review
  return { valid: true, text: lower, allowed: true, review: true };
}

const chatService = {
  validateMessage,
  getPhraseLibrary: () => phraseLibrary,
  getPositiveEmojis: () => positiveEmojis,
};

module.exports = { chatService };
