/* ───────────────────── Imports ───────────────────── */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

/* security & logs */
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

/* app-specific imports */
import propertyRoutes   from './routes/propertyRoutes.js';
import authRoutes       from './routes/authRoutes.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import registerRoutes   from './routes/registerRoutes.js';
import messageRoutes    from './routes/messageRoutes.js';
import bookingRoutes    from './routes/bookingRoutes.js';
import Message          from './models/Message.js';

/* ───────────────────── .env ───────────────────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

/* ───────────────────── Allowed origins ───────────────────── */
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

/* ───────────────────── Express & HTTP server ───────────────────── */
const app    = express();
const server = http.createServer(app);          // needed for Socket.IO

/* ───────────────────── Socket.IO ───────────────────── */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`📦 ${socket.id} joined room ${roomId}`);
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
      console.error('❌ Failed to save message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

/* ───────────────────── Global middleware ───────────────────── */
app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(cors({ origin: allowedOrigins, credentials: true }));

/* ───────────────────── Routes ───────────────────── */
app.use('/api/properties', propertyRoutes);
app.use('/api/auth',       registerRoutes);
app.use('/api/auth',       authRoutes);
app.use('/api/auth',       googleAuthRoutes);
app.use('/api/messages',   messageRoutes);
app.use('/api/bookings',   bookingRoutes);

/* health check */
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: Date.now() }));

/* fallback 404 */
app.use((_, res) => res.status(404).json({ message: 'API route not found' }));

/* ───────────────────── Mongo & server start ───────────────────── */
const PORT = process.env.PORT || 6060;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rental_estate', {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
