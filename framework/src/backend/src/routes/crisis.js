const express = require('express');
const router = express.Router();
const { crisisService } = require('../services/crisis-escalation');

// Get crisis resources for a region
router.get('/resources/:region?', (req, res) => {
  const region = req.params.region || 'US';
  res.json({ region, resources: crisisService.getCrisisResources(region) });
});

// Get escalation protocol
router.get('/protocol/:tier', (req, res) => {
  const tier = parseInt(req.params.tier, 10);
  if (isNaN(tier)) {
    return res.status(400).json({ error: 'Invalid tier' });
  }
  res.json({ tier, protocol: crisisService.getEscalationProtocol(tier) });
});

// Report a crisis event (de-identified logging)
router.post('/report', (req, res) => {
  const { userMessage, region, uniqueId } = req.body || {};
  // In production: log de-identified event to secure storage
  console.log('[crisis-report]', { uniqueId, region, length: (userMessage || '').length });
  res.json({ status: 'logged', id: uniqueId || 'unknown' });
});

module.exports = { router };
