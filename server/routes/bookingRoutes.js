import express from 'express';
import Booking from '../models/Booking.js';
import authMiddleware from '../middleware/auth.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// POST /api/bookings — Create booking & send confirmation email
router.post('/', authMiddleware, async (req, res) => {
  const { propertyId, type, date, time } = req.body;

  try {
    const booking = new Booking({
      userId: req.user.id,
      propertyId,
      type,
      date,
      time
    });

    await booking.save();

    // Email confirmation to user
    await sendEmail(req.user.email, 'Booking Confirmed', `
      <h2>Your ${type} booking is confirmed!</h2>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
    `);

    res.status(201).json({ success: true, message: 'Booking created' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Booking failed', error: err.message });
  }
});

// GET /api/bookings — Admin view of all bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await Booking.find()
      .populate('userId', 'name')
      .populate('propertyId', 'title');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// GET bookings for owner
router.get('/owner/bookings', authMiddleware, async (req, res) => {
    try {
      if (req.user.role !== 'owner') return res.status(403).json({ message: 'Access denied' });
  
      const bookings = await Booking.find()
        .populate('userId', 'name')
        .populate('propertyId', 'title owner')
        .where('propertyId.owner')
        .equals(req.user.id);
  
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });

  // PUT /api/bookings/:id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { status } = req.body;
  
      // Only owners or admins should be allowed to update booking status
      if (req.user.role !== 'owner' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      const booking = await Booking.findById(req.params.id).populate('propertyId');
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Ensure the booking is for a property owned by this owner
      if (req.user.role === 'owner' && booking.propertyId.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }
  
      booking.status = status;
      await booking.save();
  
      res.json({ success: true, message: `Booking ${status}` });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
    }
  });

// ✅ GET /api/bookings/owner/count
router.get('/owner/count', authMiddleware, async (req, res) => {
    try {
      if (req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      const bookings = await Booking.find()
        .populate({
          path: 'propertyId',
          match: { 'owner.email': req.user.email }
        });
  
      // Only count those with matched owner
      const count = bookings.filter(b => b.propertyId !== null).length;
  
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch owner booking count' });
    }
  });
  
export default router;
