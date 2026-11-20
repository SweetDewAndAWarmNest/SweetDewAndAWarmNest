# Soft Dew And A Warm Nest

A free, ad-free sanctuary platform for people navigating low energy, depression, or related feelings.

## Overview

Soft Dew And A Warm Nest is a cozy, calming virtual sanctuary built for people who need a safe, quiet place to exist. It features a shared universe with a persistent hub, AI-NPC companions, cozy games (chess, checkers, skateboarding, car racing, spaceship racing/battles), and a positive-only communication system.

## Core Principles

- **Trauma-informed design**: safety and calm are core architecture, not features
- **Radical data minimization**: never collect what you don't need; process on-device where possible
- **Zero ads, zero data selling**: nonprofit/donation/grant-funded
- **Accessibility**: WCAG 2.1 AA as a minimum standard
- **Pull-based games**: cozy, fail-safe, optional — never push notifications

## Repository Structure

```
framework/
├── README.md              # This file
├── PLAN2.md               # Implementation plan
├── TODO.md                # Task list
├── HANDOVER.md            # Handover summary
├── docs/                  # Documentation
├── src/
│   ├── frontend/          # React + TypeScript + Vite PWA
│   ├── backend/           # Express + Socket.IO server
│   ├── shared/            # Shared TypeScript types
│   ├── games/             # Game implementations
│   ├── tools/             # Build/dev scripts
│   └── tests/             # Automated tests
├── public/                # Static assets
└── .github/workflows/     # CI/CD workflows
```

## Getting Started

```bash
cd src/frontend
npm install
npm run dev
```

See `PLAN2.md` for the full implementation plan.

## Safety

Every screen displays crisis numbers. The panic button routes to a safe page. Games have no fail state, no time pressure, and no negative feedback.

## Contact

- **Website**: https://sdaawn.pages.dev
- **GitHub**: https://github.com/SweetDewAndAWarmNest
