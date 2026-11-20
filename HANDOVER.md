# HANDOVER.md — Handover Summary

**Project**: Soft Dew And A Warm Nest
**Date**: 2026-11-18
**Prepared by**: Development team

---

## 1. What Was Built

- **Repository**: https://github.com/SweetDewAndAWarmNest/SweetDewAndAWarmNest
- **Website**: https://sdaawn.pages.dev
- **Spec**: `SPEC_CHAT` (comprehensive design document)

## 2. Project Structure

```
frameworm/
├── README.md              # Project overview
├── PLAN.md                # Detailed implementation plan
├── TODO.md                # Task list
├── HANDOVER.md            # This file
├── docs/                  # Full documentation
└── src/
    ├── frontend/          # React + TypeScript + Vite PWA
    ├── backend/           # Express + Socket.IO server
    ├── shared/            # Shared TypeScript types & constants
    ├── games/             # Game implementations (2D canvas / 3D Three.js)
    ├── public/            # Static assets (fonts, icons, audio)
    ├── tools/             # Build, dev, and utility scripts
    └── tests/             # Automated tests
```

## 3. Key Technical Decisions

- **PWA frontend**: React + TypeScript + Vite. Three.js for 3D hub world. Canvas 2D for board games.
- **Backend**: Node.js + Express + Socket.IO for real-time multiplayer sync.
- **AI NPCs**: On-device WebLLM (WebGPU) with server-side Gemma fallback. Grounded in curated reference notes.
- **Chat**: Positive-only phrase library (predefined IDs + emojis), server-side hard validation.
- **Crisis**: Location-aware 988/lifeline integration, tiered escalation protocol.
- **Data**: Ephemeral session tokens, zero persistent multiplayer records, differential privacy.
- **Games**: Chess, checkers (Canvas 2D, no dependencies). Skateboarding, car racing, spaceship racing/battles (Three.js).
- **Architecture**: Zero-ads, no-data-selling. PWA-first, offline-capable, WCAG 2.1 AA.

---

## 4. Build Commands

- `npm run dev` — start frontend dev server
- `npm run dev:backend` — start backend server
- `npm run build` — production build
- `npm run test` — run all tests
- `npm run test:browser` — Playwright headless browser tests

---

## 5. Quality Gates

- WCAG 2.1 AA: all interactive elements have visible keyboard focus, alt text, ARIA labels
- Positive-only chat: server rejects any message not in the approved phrase library
- Crisis: every screen displays crisis numbers; panic button routes to safe page
- Games: no fail state, no time pressure, no negative feedback
- Offline: service worker caches all assets; app works without network

---

## 6. What Must NOT Be Done

- No ads, no data selling, no sponsored content (by design, not marketing)
- No "therapy" or "treatment" claims — frame as wellness tool
- No persistent multiplayer records (ephemeral session tokens only)
- No AI claiming to be human or a therapist (anti-dependency by design)
- No negative/emergency-emoji communication (positive-only phrase library)
