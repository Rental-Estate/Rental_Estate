import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: 'estaterental01@gmail.com' });
    if (existing) {
      console.log('⚠️ Admin already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('adminpassword123', 10);

    await User.create({
      fullName: 'Admin',
      email: 'estaterental01@gmail.com',
      phone: '9999999999',
      password: hashedPassword,
      role: 'admin',
      status: 'approved',
    });

    console.log('✅ Admin user created successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Failed to seed admin:', err);
    process.exit(1);
  }
};

seedAdmin();