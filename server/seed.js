import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rental_estate');

    await Property.deleteMany();

    await Property.insertMany([
      {
        title: 'Cozy PG in Sector 22',
        city: 'Chandigarh',
        area: 'Sector 22',
        location: 'Near Aroma Chowk',
        type: 'PG',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1598928506311-0b47e18f2d4c?auto=format&fit=crop&w=800&q=80',
        ],
        moveInDate: new Date(),
        rating: 4.5,
        latitude: 30.7290,
        longitude: 76.7794,
        description: 'A cozy PG near Aroma Chowk ideal for students and working women.',
        amenities: ['WiFi', 'Fridge', 'Power Backup'],
    owner: {
      name: 'Priya Sharma',
      phone: '+91-9876543210',
      email: 'priya@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
        
      },
      {
        title: '1BHK in Sunny Enclave',
        city: 'Kharar',
        area: 'Sunny Enclave',
        location: 'near NH4',
        type: '1BHK',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560448070-c9215c1f3b99?auto=format&fit=crop&w=800&q=80',
        ],
        moveInDate: new Date(),
        rating: 4.8,
        latitude: 30.7190,
        longitude: 76.6596,
        description: 'A cozy 1BHK near NH4 ideal for students and working women.',
        amenities: ['WiFi', 'Fridge', 'Power Backup'],
    owner: {
      name: 'Raghu Sharma',
      phone: '+91-9876548910',
      email: 'priya@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
      },
      {
        title: 'Spacious 2BHK in Sector 17',
        city: 'Chandigarh',
        area: 'Sector 17',
        loaction: 'Near Mall',
        type: '2BHK',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1598928506311-0b47e18f2d4c?auto=format&fit=crop&w=800&q=80',
        ],
        moveInDate: new Date(),
        rating: 4.6,
        latitude: 30.7363,
        longitude: 76.7821,
        description: 'A cozy 2BHK ideal for students.',
        amenities: ['WiFi', 'Fridge', 'Power Backup'],
    owner: {
      name: 'Sanjay Sharma',
      phone: '+91-8876543210',
      email: 'priya@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
      },

      {
        title: 'Luxury 3BHK in Manimajra',
        city: 'Chandigarh',
        area: 'Manimajra',
        location: 'Shive Chowk',
        type: '3BHK',
        price: 30000,
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1618221105740-e1a3a7c649b2?auto=format&fit=crop&w=800&q=80',
        ],
        moveInDate: new Date(),
        rating: 5.0,
        latitude: 30.7165,
        longitude: 76.8125,
        description: 'A modern 3BHK in a calm and connected neighborhood.',
        amenities: ['Parking', 'Lift'],
        owner: {
          name: 'Ravi Mehta',
          phone: '+91-9988776655',
          email: 'ravi@example.com',
          avatar: 'https://i.pravatar.cc/150?img=6'
        }
      },
      {
        title: 'Affordable PG for Girls',
        city: 'Kharar',
        area: 'Sector 125',
        location: 'near bus stand' ,
        type: 'PG',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1598928506311-0b47e18f2d4c?auto=format&fit=crop&w=800&q=80',
        ],
        moveInDate: new Date(),
        rating: 4.1,
        latitude: 30.7152,
        longitude: 76.6835,
        description: 'A modern PG in a calm and connected neighborhood.',
        amenities: ['Parking', 'Lift'],
        owner: {
          name: 'Ravi Mehta',
          phone: '+91-9988776655',
          email: 'ravi@example.com',
          avatar: 'https://i.pravatar.cc/150?img=6'
        }
      },

    ]);

    console.log('✅ Seeded successfully with multiple properties!');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedData();