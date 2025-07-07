import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  type: { type: String, enum: ['visit', 'booking'], required: true },
  date: Date,
  time: String,
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Booking', bookingSchema);


