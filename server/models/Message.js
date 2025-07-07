import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  senderRole: { type: String, enum: ['user', 'owner'], required: true },
  text: { type: String, required: true },
  roomId: { type: String, required: true }, // usually the owner's ID
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);