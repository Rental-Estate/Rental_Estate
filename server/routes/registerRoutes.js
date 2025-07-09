import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, param } from 'express-validator';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

import User from '../models/User.js';
import Otp  from '../models/Otp.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validate.js';

dotenv.config();
const router = express.Router();

/* ───── Helpers ───── */
const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

/* ───── OTP ROUTES ───── */
router.post(
  '/send-otp',
  [ body('email').isEmail().withMessage('Valid email required') ],
  validate,
  async (req, res) => {
    const { email } = req.body;
    const code      = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await Otp.deleteMany({ email });
      await Otp.create({ email, otp: code, expiresAt: Date.now() + 10*60*1000 });

      await transporter.sendMail({
        from: `"RentalEstate" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is: ${code}`,
      });

      res.json({ message: 'OTP sent' });
    } catch (err) {
      console.error('OTP send error:', err);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  }
);

router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validate,
  async (req, res) => {
    const { email, otp } = req.body;
    try {
      const record = await Otp.findOne({ email, otp });
      if (!record || record.expiresAt < Date.now())
        return res.status(400).json({ message: 'Invalid or expired OTP' });

      await Otp.deleteMany({ email });
      res.json({ message: 'OTP verified' });
    } catch (err) {
      console.error('OTP verify error:', err);
      res.status(500).json({ message: 'OTP verification failed' });
    }
  }
);

/* ───── REGISTER ───── */
router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone').isMobilePhone().withMessage('Invalid phone'),
    body('password')
      .isStrongPassword({ minLength: 8 })
      .withMessage('Password must be 8+ chars incl. letters & numbers'),
    body('role').isIn(['tenant', 'owner']).withMessage('Role must be tenant or owner'),
  ],
  validate,
  async (req, res) => {
    try {
      const { fullName, email, phone, password, role, address } = req.body;

      const exists = await User.findOne({ $or: [{ email }, { phone }] });
      if (exists)
        return res.status(400).json({ message: 'Email or phone already registered' });

      const hashed = await bcrypt.hash(password, 10);
      const status = role === 'owner' ? 'pending' : 'approved';

      const user = await User.create({
        fullName, email, phone, password: hashed, role, address, status,
      });

      // Send welcome mail (same as before)...
      await transporter.sendMail({
        to: email,
        subject: `Welcome to RentalEstate, ${fullName}!`,
        html: `<p>Hi ${fullName}, thanks for joining as a ${role}.</p>`,
      });

      if (role === 'owner') {
        await transporter.sendMail({
          to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
          subject: 'New Owner Registration Pending Approval',
          html: `<p>Owner <b>${fullName}</b> (${email}) awaits approval.</p>`,
        });
      }

      res.status(201).json({ message: 'Registered', user, token: generateToken(user) });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/* ───── ADMIN OWNER ACTIONS (unchanged except validation additions) ───── */

router.patch(
  '/approve-owner/:id',
  [
    param('id').isMongoId().withMessage('Invalid user id'),
    authMiddleware(['admin']),
  ],
  validate,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user || user.role !== 'owner') return res.status(404).json({ message: 'Owner not found' });

      user.status = 'approved';
      await user.save();

      await transporter.sendMail({
        to: user.email,
        subject: 'Your Owner Account Approved',
        html: `<p>Hi ${user.fullName}, your owner account is now approved.</p>`,
      });

      res.json({ message: 'Owner approved' });
    } catch (err) {
      console.error('Approval error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Similar validation can be added to /reject-owner/:id, /pending-owners etc.

export default router;
