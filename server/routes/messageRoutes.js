import express from 'express';
import Message from '../models/Message.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// 3. Get owner’s inbox FIRST (before dynamic :roomId route)
router.get('/owner/inbox', authMiddleware(['owner']), async (req, res) => {
  try {
    const ownerId = req.user.id;
    const messages = await Message.find({ roomId: ownerId }).sort({ createdAt: -1 });

    const userMap = new Map();
    for (const msg of messages) {
      if (msg.senderRole === 'user' && !userMap.has(msg.senderId.toString())) {
        userMap.set(msg.senderId.toString(), msg);
      }
    }

    const userList = Array.from(userMap.values()).map((msg) => ({
      userId: msg.senderId,
      lastMessage: msg.text,
      unread: !msg.read,
      updatedAt: msg.updatedAt
    }));

    res.json(userList);
  } catch (err) {
    console.error('Inbox fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 1. Save message to DB
router.post('/', authMiddleware(['user', 'owner']), async (req, res) => {
  try {
    const { text, roomId } = req.body;
    const message = new Message({
      senderId: req.user.id,
      senderRole: req.user.role,
      roomId,
      text
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Save message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Chat history by room
router.get('/:roomId', authMiddleware(['user', 'owner']), async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

    // Mark unread messages (from other user) as read
    await Message.updateMany(
      { roomId, senderId: { $ne: req.user.id }, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error('Fetch messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Count messages for owner
router.get('/owner/count', authMiddleware, async (req, res) => {
    try {
      if (req.user.role !== 'owner') return res.status(403).json({ message: 'Access denied' });
  
      const rooms = await Message.find({ senderRole: 'user' }); // rough count by sender role
      res.json({ count: rooms.length });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch message count' });
    }
  });

export default router;