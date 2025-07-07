import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  city: String,
  area: String,
  type: String,
  price: Number,
  rating: Number,
  image: String,
  images: [String],
  latitude: Number,
  longitude: Number,
  description: String,
  amenities: [String],
  rules: [String],
  tags: [String],
  address: String,
  owner: {
    name: String,
    phone: String,
    email: String,
    avatar: String,
    verified: Boolean,
    responseTime: String,
    propertiesCount: Number
  },
  reviews: [
    {
      name: String,
      rating: Number,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  wishlist: [String] // array of userIds who saved the property
});

const Property = mongoose.model('Property', propertySchema);
export default Property;