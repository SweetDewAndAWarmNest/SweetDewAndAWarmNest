# PLAN2.md — Implementation Plan

**Project**: Soft Dew And A Warm Nest
**Status**: Planning phase
**Date**: 2026-11-19

---

## 1. Vision

A free, ad-free sanctuary for people navigating low energy, depression, or related feelings. The platform must be built with **empathy as its foundation**, treating safety and calm not as features, but as the core architecture.

---

## 2. Phased Roadmap

### Phase 0: Foundations (months 0–3)

- Legal entity, clinical advisory board, DPIA
- COPPA/GDPR compliance architecture
- Crisis resource API integration
- Security baseline

### Phase 1: The Quiet Hub (months 3–9)

- Persistent hub (3D)
- Avatar creation (humanoid + non-human base forms)
- Bench (consensual conversation)
- Mailbox (asynchronous kindness)
- One NPC companion with dual-memory and crisis escalation
- One game (chess/checkers with solo and quiet social modes)

### Phase 2: Expressive Identity (months 6–12)

- Quadruped/taur/winged locomotion
- Expressive autonomy (tails, ears, wings)
- Species-appropriate emotes
- Plurality support (multiple forms, private kintype notes)
- LGBTQ+/BIPOC representation audit

### Phase 3: Cozy and Flow Games (months 9–15)

- Fishing/gathering
- Gardening
- Free-skate
- Scenic racing

### Phase 4: Gentle Competition (months 12–18)

- Non-contact car racing with rubber-banding
- Spaceship sparring with light-tag mechanics
- Opt-in leaderboards (seasonal)

### Phase 5: Evaluation and Scale (months 15–24)

- IRB-approved wellbeing evaluation
- Accessibility audit
- Cultural adaptation for second region
- Open-source release of non-sensitive components

---

## 3. Technical Architecture

### Frontend

- **Framework**: React + TypeScript + Vite
- **3D**: Three.js for the hub world and games
- **Canvas 2D**: Board games (chess, checkers)
- **PWA**: Offline-capable, installable

### Backend

- **Node.js + Express + Socket.IO**
- Real-time multiplayer sync (authoritative server)
- Chat system (positive-only phrase library)
- Crisis escalation
- AI NPC integration

### AI NPCs

- On-device WebLLM (WebGPU) with server-side Gemma fallback
- Grounded in curated reference notes
- Dual-memory framework (short-term + long-term)

### Chat

- Positive-only phrase library (predefined IDs + emojis)
- Server-side hard validation
- Trust staircase (stranger → acquaintance → friend → trusted friend)

---

## 4. Games

| Game | Mode | Communication |
|------|------|---------------|
| Chess/Checkers | Board game | Emotes + phrases |
| Skateboarding | Flow sport | No chat, ghost trails |
| Car Racing | Non-contact | Emotes only |
| Spaceship Racing/Battles | Opt-in | Emotes only, light-tag |

---

## 5. Key Technical Decisions

- **PWA frontend**: React + TypeScript + Vite
- **3D**: Three.js for 3D hub world. Canvas 2D for board games.
- **Backend**: Node.js + Express + Socket.IO for real-time multiplayer sync
- **AI NPCs**: On-device WebLLM (WebGPU) with server-side Gemma fallback
- **Chat**: Positive-only phrase library (predefined IDs + emojis), server-side hard validation
- **Crisis**: Location-aware 988/lifeline integration, tiered escalation protocol
- **Data**: Ephemeral session tokens, zero persistent multiplayer records, differential privacy

---

## 6. Quality Gates

- WCAG 2.1 AA: all interactive elements have visible keyboard focus, alt text, ARIA labels
- Positive-only chat: server rejects any message not in the approved phrase library
- Crisis: every screen displays crisis numbers; panic button routes to safe page
- Games: no fail state, no time pressure, no negative feedback
- Offline: service worker caches all assets; app works without network
