# AGENTS.md — Sweet Dew And A Warm Nest

**Project**: Sweet Dew And A Warm Nest — a free, ad-free sanctuary platform for people navigating low energy, depression, or related feelings.
**Scope**: Full project framework — frontend (React/TS/Three.js PWA), backend (Node/Express + Socket.IO), shared types, games (chess, checkers, skateboarding, car racing, spaceship racing/battles), AI NPCs, crisis infrastructure, positive-only chat system.
**Created**: 2026-11-18
**Orientation**: Orientation complete. SPEC.txt fully read and analyzed. All deliverables created. Deployed on Cloudflare Pages at sdaawn.pages.dev.
**Website**: https://sdaawn.pages.dev
**Name**: Sweet Dew And A Warm Nest (cute, wholesome, sanctuary-themed, multi-word)

---

## 1. Communication Norms

- **User preference**: "Properly proceed with all" = full autonomous implementation, zero stubs, zero placeholders.
- **Verification**: Verify in a real browser (Playwright headless) before reporting done. Check the browser DOM and network to confirm, not just the code.
- **Deliverables**: All documentation files must be complete and substantive, not stubs.
- **Parallel work**: Use `execute_code` for multi-step tool orchestration (filing, branching, looping). Use direct tool calls for single operations.
- **No fabricated output**: Report real results from tools. If a build fails, report the error verbatim.

---

## 2. Project Structure

```
frameworm/
├── README.md              # Project overview
├── PLAN.md                # Detailed implementation plan
├── TODO.md                # Task list
├── HANDOVER.md            # Handover summary
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

---

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
