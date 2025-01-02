import mongoose from 'mongoose';

const URL = process.env.MONGODB_URI;
console.log('MongoDB URI:', URL);

if (!URL) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Global cache for the MongoDB connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbconn() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(URL, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log('Connected to MongoDB');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
