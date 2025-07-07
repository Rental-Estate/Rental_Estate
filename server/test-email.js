import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.sendMail({
  to: process.env.GMAIL_USER,
  subject: "Test Email",
  text: "This is a test email from nodemailer!",
}, (err, info) => {
  if (err) return console.error("❌ Failed:", err);
  console.log("✅ Sent:", info.response);
});
