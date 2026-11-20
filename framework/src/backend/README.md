# Sweet Dew And A Warm Nest — Backend

Express + Socket.IO backend for the wellness sanctuary platform.

## Architecture

- **HTTP API** (Express): REST endpoints for chat validation, crisis resources, and service info
- **WebSocket API** (Socket.IO): Real-time chat, joining rooms/games, and bidirectional events
- **Services**: 
  - `chat-moderation`: Positive-only phrase library validation
  - `crisis-escalation`: Tiered crisis escalation protocol with region-aware resources
  - `ai-npc`: AI companion responses (retrieval fallback, LLM ready)

## Scripts

```bash
npm run dev    # Start dev server (port 3000)
npm start      # Start production server
npm test       # Run tests (placeholder)
```

## Environment Variables

- `PORT` (default: 3000): HTTP/WebSocket server port
- `CORS_ORIGIN` (default: http://localhost:5173): Allowed CORS origin

## Deployment

Run on Cloudflare Pages Functions or a Node-optimized host. Configure `wrangler.toml` for the Cloudflare Pages deployment.
