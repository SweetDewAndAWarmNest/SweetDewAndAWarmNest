const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'sdaawn-backend' });
});

// Service info
router.get('/info', (req, res) => {
  res.json({
    service: 'sdaawn-backend',
    version: '1.0.0',
    description: 'Express + Socket.IO backend for Soft Dew And A Warm Nest',
  });
});

module.exports = { router };
