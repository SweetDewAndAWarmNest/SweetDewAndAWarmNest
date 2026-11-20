const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const socketIo = require('socket.io');
const path = require('path');

const chatRouter = require('./routes/chat');
const crisisRouter = require('./routes/crisis');
const apiRouter = require('./routes/api');
const { chatService } = require('./services/chat-moderation');
const { crisisService } = require('./services/crisis-escalation');
const { aiNpcService } = require('./services/ai-npc');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Static assets (future)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/chat', chatRouter.router);
app.use('/api/crisis', crisisRouter.router);
app.use('/api', apiRouter.router);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join a room (e.g., by hub or game)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.emit('joined-room', { roomId, socketId: socket.id });
  });

  // Join a game room
  socket.on('join-game', (gameId) => {
    socket.join(`game-${gameId}`);
    socket.emit('joined-game', { gameId, socketId: socket.id });
  });

  // AI response generation (server-side Gemma fallback)
  socket.on('ai-response', async (data) => {
    try {
      const { prompt, intent = 'default-npc' } = data;
      const response = await aiNpcService.generateResponse(prompt, intent);
      socket.emit('ai-response', {
        id: socket.id,
        prompt,
        response,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      socket.emit('ai-response-error', { error: 'Failed to generate AI response' });
    }
  });

  // Chat message (positive-only validation)
  socket.on('chat-message', async (data) => {
    try {
      const result = await chatService.validateMessage(data);
      if (result.valid) {
        io.to(`room-${data.roomId}`).emit('chat-message', {
          id: socket.id,
          roomId: data.roomId,
          text: result.text,
          timestamp: new Date().toISOString(),
          validated: true,
        });
      } else {
        socket.emit('chat-message-error', {
          error: 'Message blocked by safety filter',
          reasons: result.reasons,
        });
      }
    } catch (err) {
      socket.emit('chat-message-error', { error: 'Server error processing message' });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🔗 WebSocket server ready on port ${PORT}`);
});

module.exports = { app, server, io };
