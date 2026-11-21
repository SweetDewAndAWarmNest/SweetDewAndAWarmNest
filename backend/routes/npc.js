const express = require('express');
const router = express.Router();

// NPC companion routes (for direct API access)

router.get('/greeting', (req, res) => {
  res.json({ greeting: require('../services/npc-companion').getGreeting() });
});

router.get('/state', (req, res) => {
  res.json({ state: require('../services/npc-companion').getStateDescription() });
});

router.get('/memories/:userId', (req, res) => {
  const memories = require('../services/npc-companion').getMemories(req.params.userId, 10);
  res.json({ memories, count: memories.length });
});

module.exports = { router };
