import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import propertyRoutes   from './routes/propertyRoutes.js';
import authRoutes       from './routes/authRoutes.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import registerRoutes   from './routes/registerRoutes.js';
import Message          from './models/Message.js';
import messageRoutes    from './routes/messageRoutes.js';
import bookingRoutes    from './routes/bookingRoutes.js';

/* ─────────────────── ENV ─────────────────── */

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Load .env for local dev; on Render the vars are already injected
dotenv.config({ path: path.join(__dirname, '.env') });

// Allow multiple comma‑separated origins in FRONTEND_URL
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : ['http://localhost:3000'];   // fallback for local dev

/* ─────────────────── APP ─────────────────── */

const app    = express();
const server = http.createServer(app);   // HTTP server for Socket.IO

/* ────────────── Socket.IO setup ───────────── */

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🟢  Socket connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`📦  ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const saved = await new Message({
        senderId:   data.senderId,
        senderRole: data.senderRole,
        text:       data.text,
        roomId:     data.roomId,
        read:       false,
      }).save();

      io.to(data.roomId).emit('receive_message', saved);
    } catch (err) {
      console.error('❌  Failed to save message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴  Socket disconnected:', socket.id);
  });
});

/* ─────────────── Middleware ─────────────── */

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

/* ───────────────── Routes ────────────────── */

app.use('/api/properties', propertyRoutes);
app.use('/api/auth',       registerRoutes);
app.use('/api/auth',       authRoutes);
app.use('/api/auth',       googleAuthRoutes);
app.use('/api/messages',   messageRoutes);
app.use('/api/bookings',   bookingRoutes);

/* ─────────────── Fallback 404 ────────────── */

app.use((_, res) => res.status(404).json({ message: 'API route not found' }));

/* ─────────── Mongo & Server start ────────── */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/rental_estate', {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅  MongoDB connected');
    server.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.error('❌  MongoDB connection error:', err));
