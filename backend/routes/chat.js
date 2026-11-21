const express = require('express');
const router = express.Router();
const { chatService } = require('../services/chat-moderation');

// Get the full phrase library
router.get('/library', (req, res) => {
  res.json({ phrases: chatService.getPhraseLibrary(), emojis: chatService.getPositiveEmojis() });
});

// Check if a message is a known phrase ID
router.post('/validate', (req, res) => {
  const { text, roomId } = req.body || {};
  if (typeof text !== 'string') {
    return res.status(400).json({ valid: false, reasons: ['Missing text'] });
  }
  const result = chatService.validateMessage(text, roomId);
  res.json(result);
});

module.exports = { router };
