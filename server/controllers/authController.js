import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const otpStore = {}; // In-memory OTP store

const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ✅ Register
export const register = async (req, res) => {
  try {
    const { email, password, phone, otp, role } = req.body;
    let user;

    if (email) {
      if (await User.findOne({ email }))
        return res.status(400).json({ message: 'Email already exists' });
      const hashed = await bcrypt.hash(password, 10);
      user = new User({ email, password: hashed, role });
    } else {
      if (!otpStore[phone] || otpStore[phone] !== otp)
        return res.status(400).json({ message: 'Invalid OTP' });
      if (await User.findOne({ phone }))
        return res.status(400).json({ message: 'Phone already registered' });
      user = new User({ phone, role });
    }

    await user.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password, phone, otp } = req.body;
    let user;

    if (email && password) {
      user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });

      if (!user.password) {
        return res.status(400).json({ message: 'Account has no password. Use OTP login.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
    } else if (phone && otp) {
      if (!otpStore[phone] || otpStore[phone] !== otp)
        return res.status(400).json({ message: 'Invalid OTP' });
      user = await User.findOne({ phone });
      if (!user) return res.status(404).json({ message: 'User not found' });
    } else {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const token = generateToken(user);
    return res.json({ user, token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { phone, email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (phone) otpStore[phone] = otp;
    if (email) otpStore[email] = otp;

    console.log(`OTP for ${phone || email}: ${otp}`);

    if (email) {
      await transporter.sendMail({
        to: email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP is <strong>${otp}</strong></p>`,
      });
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error("OTP Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;
    const key = phone || email;

    if (!otpStore[key] || otpStore[key] !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });

    let user = await User.findOne({ $or: [{ phone }, { email }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link valid for 15 minutes.</p>`,
    });

    console.log(`✅ Password reset link sent to ${email}`);
    res.json({ message: 'Password reset link sent to email' });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Reset Password
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ message: 'Missing data' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Google Login
export const googleLogin = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, role: 'user' });
      await user.save();
    }
    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Google login failed' });
  }
};
