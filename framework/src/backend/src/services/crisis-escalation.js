const crisisResources = {
  "US": {
    "988": "988 Suicide & Crisis Lifeline",
    "crisisTextLine": "Text HOME to 741741",
    "ttCluster": "ThroughLine Crisis Resources",
  },
  "UK": {
    "988": "Call 999 or 111 (NHS)",
    "samaritan": "116 123",
    "crisisTextLine": "Text SHOUT to 85258",
  },
  "CA": {
    "988": "Call 988 (Suicide Crisis Helpline)",
    "crisisTextLine": "Text 686868",
  },
  "AU": {
    "988": "Call 13 11 14 (Lifeline)",
    "crisisTextLine": "Text 0477 13 11 14",
  },
};

function getCrisisResources(region = 'US') {
  return crisisResources[region] || crisisResources['US'];
}

function getEscalationProtocol(tier) {
  const protocols = {
    0: { trigger: 'Ambiguous distress language; no explicit risk', response: 'AI validates, offers grounding, surfaces optional resources', owner: 'AI system' },
    1: { trigger: 'Explicit hopelessness or passive ideation without plan/intent', response: 'AI shifts to safety-focused script, offers one-tap human chat and local helplines, ends game suggestions', owner: 'AI + on-call moderator' },
    2: { trigger: 'Explicit intent, plan, means, or imminent risk', response: 'AI interrupts, provides region-appropriate crisis contacts, offers immediate handoff to trained crisis responder, logs de-identified event for review', owner: 'Human crisis responder' },
    3: { trigger: 'Imminent danger to life', response: 'Emergency services guidance, location-aware resources, post-incident follow-up', owner: 'Clinical lead + legal' },
  };
  return protocols[tier] || protocols[0];
}

const crisisService = {
  getCrisisResources,
  getEscalationProtocol,
};

module.exports = { crisisService };
