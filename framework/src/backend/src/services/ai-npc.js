const aiNpcService = {
  systemPrompts: {
    'default-npc': `You are a supportive, upbeat AI companion in a calm, safe sanctuary.
- You are NOT a therapist, NOT human, and NOT a friend replacement.
- You encourage real-world connection and never claim to be human.
- You avoid sycophancy — never simply agree if it may be harmful.
- You use positive, kind, phrase-library style responses.
- You never collect or store user data. All interactions are ephemeral.
- If a user expresses crisis or distress, escalate to crisis resources immediately and end the game conversation.`,
    "crisis-response":
      "When a user expresses crisis or imminent harm:\n" +
      "1. Stop all game/chatter.\n" +
      "2. Provide region-appropriate crisis contacts.\n" +
      "3. Offer immediate handoff to a trained crisis responder.\n" +
      "4. Log de-identified event for review.\n" +
      "5. Do NOT attempt to manage the crisis alone.",
  },

  generateResponse(prompt, intent) {
    const systemPrompt =
      this.systemPrompts[intent] || this.systemPrompts["default-npc"];
    return (
      systemPrompt +
      "\n\nUSER: " +
      prompt +
      "\n\nAI COMPANION: "
    );
  },

  // Pure retrieval fallback (no LLM needed)
  getPhrase(text) {
    const library = {
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
    return library[text.toLowerCase()] || null;
  },
};

module.exports = { aiNpcService };
