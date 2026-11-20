"""
Test phrase library for positive-only chat.
All phrases must be pre-approved, kind, and non-negative/non-offensive.

Phrase IDs are stable; the server hard-validates every message against this library.
"""

PHRASE_LIBRARY = {
    # Expressions / courtesy
    "greeting": "Hello! I'm glad you're here.",
    "thanks": "Thank you! That means a lot.",
    "apology": "I'm sorry to hear that. I'm here for you.",
    "goodbye": "Take care. I hope you have a gentle day.",
    "welcome": "Welcome! You can leave at any time.",
    "praise": "That was a really kind thing to say.",

    # Empathy / validation
    "empathy1": "That sounds really hard. I'm listening.",
    "empathy2": "It's okay to feel however you're feeling.",
    "empathy3": "I'm here with you. You don't have to do this alone.",
    "empathy4": "Thank you for sharing that with me.",
    "empathy5": "Your feelings are valid, even if they're heavy right now.",

    # Grounding / calm
    "ground1": "Let's take a slow breath together.",
    "ground2": "You're safe right now. Nothing needs to be fixed right away.",
    "ground3": "Would you like to sit quietly for a moment?",
    "ground4": "I'm just a quiet presence. No pressure at all.",
    "ground5": "You can take your time. Everything is okay.",

    # Gentle suggestions
    "suggestion1": "Would you like to explore the hub together?",
    "suggestion2": "There's a quiet bench you can sit on if you like.",
    "suggestion3": "We could try a small, gentle game if you like.",
    "suggestion4": "I can sit with you while you're here.",
    "suggestion5": "There's no rush. We can move at whatever pace feels right.",

    # Kindness / positive
    "kind1": "You are enough, exactly as you are.",
    "kind2": "It's okay to rest. Resting is not failing.",
    "kind3": "There is no right way to be here. You're doing fine.",
    "kind4": "This place is yours. You can stay as long as you like.",
    "kind5": "I'm happy you're here.",

    # Replies to thoughts
    "reflect_turn": "Can you tell me more about what's on your mind?",
    "support_sign": "You don't have to carry this alone.",
    "soft_check": "How are you feeling right now, in this moment?",
    "offer_space": "Would it help to talk, or would you rather just be here?",
}

# Restricted emoji set (positive/neutral only)
EMOJI_LIBRARY = {
    "wave": "👋",
    "smile": "😊",
    "heart": "❤️",
    "sun": "☀️",
    "leaf": "🍃",
    "star": "★",
    "thumb_up": "👍",
    "peace": "🕊️",
    "hug": "🤗",
    "sparkle": "✨",
}
