
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password, role, address } = req.body;

    if (!fullName || !email || !phone || !password || !role)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ $or: [{ email }, { phone }] });
    if (exists)
      return res.status(400).json({ message: 'Email or phone already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const status = role === 'owner' ? 'pending' : 'approved';

    const user = new User({ fullName, email, phone, password: hashed, role, address, status });
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: `Welcome to RentalEstate, ${fullName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2 style="color:#2b2b2b;">Hi ${fullName},</h2>
          <p>Thanks for registering with <strong>RentalEstate</strong> as a ${role}.</p>
          ${
            role === 'owner'
              ? "<p>Your account is under review. You'll receive another email once it's approved by our team.</p>"
              : "<p>You can now browse and book properties on our platform right away.</p>"
          }
          <p>We're excited to have you with us!</p>
          <br/>
          <p style="font-size:12px; color:#888;">This is an automated message from RentalEstate. Do not reply to this email.</p>
        </div>
      `,
    });

    if (role === 'owner') {
      await transporter.sendMail({
        to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
        subject: 'New Owner Registration Pending Approval',
        html: `<p>Owner <strong>${fullName}</strong> registered with email <strong>${email}</strong> and is awaiting approval.</p>`,
      });

      return res.status(201).json({ message: 'Owner registration submitted for approval', user });
    }

    res.status(201).json({ message: 'Registered successfully', user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/approve-owner/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.role !== 'owner') {
      return res.status(404).json({ message: 'Owner not found' });
    }

    user.status = 'approved';
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: 'Your Owner Account Approved',
      html: `<p>Hi ${user.fullName}, your owner account has been approved. You can now login and access your dashboard.</p>`,
    });

    res.json({ message: 'Owner approved successfully' });
  } catch (err) {
    console.error('Approval error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/reject-owner/:id', authMiddleware(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await User.findById(id);
    if (!user || user.role !== 'owner') {
      return res.status(404).json({ message: 'Owner not found' });
    }

    user.status = 'rejected';
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: 'RentalEstate Owner Registration Rejected',
      html: `<p>Hi ${user.fullName}, unfortunately your registration as an owner has been rejected.<br/>Reason: ${reason || 'Not specified'}<br/>You may contact support for more info.</p>`
    });

    res.json({ message: 'Owner rejected and status updated' });
  } catch (err) {
    console.error('Reject owner error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/pending-owners', authMiddleware(['admin']), async (req, res) => {
  try {
    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    const query = {
      role: 'owner',
      ...(status && { status: new RegExp(status, 'i') }),
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const owners = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await User.countDocuments(query);

    res.json({ owners, total });
  } catch (err) {
    console.error('Fetch pending owners error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/owner-stats', authMiddleware(['admin']), async (req, res) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'owner', status: 'pending' }),
      User.countDocuments({ role: 'owner', status: 'approved' }),
      User.countDocuments({ role: 'owner', status: 'rejected' })
    ]);

    res.json({ total, pending, approved, rejected });
  } catch (err) {
    console.error('Owner stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

export default router;