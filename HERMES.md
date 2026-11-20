# HERMES.md — Private Repo Context & Working Memory

**Repo**: `SweetDewAndAWarmNest-Private` (private) — `https://github.com/SweetDewAndAWarmNest/SweetDewAndAWarmNest-Private`
**Created**: 2026-11-20

---

## 1. About This Repo

This is the **Private** repository for the Soft Dew And A Warm Nest project.
It holds everything that is not meant for public release, plus the full private
implementation. The **Public** repo (`SweetDewAndAWarmNest`) holds only the spec
and non-sensitive documentation.

---

## 2. Repository Layout

```
SweetDewAndAWarmNest-Private/
├── .gitignore
├── build_spec.py            # Helper to build SPEC_CHAT from spec/SPEC.txt
├── framework/               # ← Private full project root
│   ├── AGENTS.md
│   ├── README.md
│   ├── PLAN2.md
│   ├── TODO.md
│   ├── HANDOVER.md
│   ├── SDAAWN-task-tracker.md
│   ├── wrangler.toml
│   ├── playwright.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .github/workflows/
│   ├── docs/
│   ├── public/
│   ├── src/
│   │   ├── backend/
│   │   ├── frontend/        # React/TS/Vite PWA
│   │   ├── shared/
│   │   ├── games/
│   │   ├── tools/
│   │   └── tests/
│   └── tests/
├── SDAAWN-Console/          # Private CLI / backend console
│   ├── Cargo.toml
│   ├── pyproject.toml
│   ├── README.md
│   ├── config/
│   ├── rust/                # Rust workspace crates
│   └── src/
├── spec/                    # Source spec (SPEC.txt)
├── SPEC_CHAT                # Full production-grade spec (public copy)
└── test-strip/              # Scratch / test outputs
```

---

## 3. Public Repo (`SweetDewAndAWarmNest`)

**URL**: `https://github.com/SweetDewAndAWarmNest/SweetDewAndAWarmNest`
**Type**: Public

### Contents
- `SPEC_CHAT` — the full production-grade spec (172,642 bytes, commit `3c2ff35`)

### Rules
- **Nothing sensitive here.** No secrets, no private code, no user data.
- Push is done with the `LoopyLuci` account (Collaborator on this repo).
- The public repo is read-mostly: it exists to publish the spec and docs.

---

## 4. Private Repo (`SweetDewAndAWarmNest-Private`)

**URL**: `https://github.com/SweetDewAndAWarmNest/SweetDewAndAWarmNest-Private`
**Type**: Private

### Contents
- `framework/` — the private full project (src/frontend, src/backend, games, docs, tests, CI)
- `SDAAWN-Console/` — private Rust/Python console utilities
- `SPEC_CHAT`, `spec/SPEC.txt` — spec files (kept private)
- `test-strip/` — test scratch

### Access
- More restrictive than the public repo.
- Push only with the `LoopyLuci` account (GitHub Collaborator).

---

## 5. What Goes Where (Rules of Thumb)

| What | Where |
|------|-------|
| Production spec & docs | `SweetDewAndAWarmNest` (public) |
| Full project source (src/…) | `framework/` in private repo |
| CLI / server console tools | `SDAAWN-Console/` in private repo |
| Secrets / auth tokens | Never committed; use env files + secret storage |
| Test scratch / scripts | `test-strip/` (private) |
| Release builds | Build artifacts, do not commit |

**Rule of thumb**: if it would never be shown to a reviewer, it belongs in the
private repo. If it is a spec or public-facing doc, it belongs in the public repo.

---

## 6. Current State

| Item | Status |
|------|--------|
| `SPEC_CHAT` (public) | ✅ Pushed to public repo (commit `3c2ff35`) |
| `SPEC_CHAT` (private) | ✅ In private repo (commit `185f0cb`) |
| `SDAAWN-Console` (private) | ✅ Pushed to private repo (commit `185f0cb`) |
| `framework/` source | ✅ Rebuilt at commit `185f0cb` (note: original files were lost in an earlier restructure; this is a re-creation, not a restore) |
| README / docs | ✅ Present in `framework/` |
| `src/backend` / `src/frontend` | ✅ Skeleton dirs present (empty, not implemented) |

### Known gaps
- `src/backend` and `src/frontend` are empty skeletons — not yet implemented.
- The original `framework/` files were lost in an earlier restructure; the current
  `framework/` is a re-creation, not a restore of the historical state.
- `build_spec.py` is a helper to rebuild `SPEC_CHAT` from `spec/SPEC.txt`.

---

## 7. Next Steps

1. **Complete `src/backend` and `src/frontend`** — these are the primary development work.
2. **Implement games** (chess, checkers, skateboarding, car racing, spaceship racing/battles).
3. **Implement AI NPCs** (on-device WebLLM + server-side Gemma fallback).
4. **Implement chat** (positive-only phrase library with server-side hard validation).
5. **Implement crisis escalation** (tiered, location-aware 988/lifeline integration).
6. **Finish PWA build** (vite build, service worker, Cloudflare Pages deploy).
7. **Generate real `SPEC_CHAT` from `spec/SPEC.txt`** via `build_spec.py` (the current
   `SPEC_CHAT` is a re-creation, not the original spec content).
8. Verify everything in a real browser (Playwright) before reporting done.

---

## 8. Auth & Deployment

- **CLI**: `gh` CLI, logged in as `LoopyLuci` (GitHub Collaborator).
- **Public repo**: push allowed (Collaborator).
- **Private repo**: push allowed (Collaborator).
- **GitHub Pages**: `sdaawn.pages.dev` (from public repo).

---

## 9. Notes for Future Agents

- Always run `gh auth status` before pushing.
- Before touching the public repo, check the remote refs (`git ls-remote origin`).
- Never commit secrets, `.env` files, or user data.
- The `framework/` folder is the canonical project root for all private work.
- The public repo is a read-mostly mirror of the spec; do not re-push spec changes
  without an explicit review step.
