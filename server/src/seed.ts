// src/seed.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User'; // adjust path if needed

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any); // if TS complains, cast to `any`

  const users = [
  {
    name: 'Admin',
    email: 'admin@safeaid.org',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin'
  },
  {
    name: 'Field Agent',
    email: 'agent@safeaid.org',
    password: await bcrypt.hash('agent123', 10),
    role: 'field_agent' // ✅ match enum exactly
  },
  {
    name: 'Medical',
    email: 'medical@safeaid.org',
    password: await bcrypt.hash('medical123', 10),
    role: 'medical'
  }
];

    await User.deleteMany(); // optional
    await User.insertMany(users);
    console.log('✅ Users seeded');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
