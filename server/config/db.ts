/**
 * Database Connection Configuration (MongoDB + Mongoose)
 * PulsePoint Emergency Blood Donor & SOS Alert System
 */
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pulsepoint_tamilnadu_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      autoIndex: true, // Automatically builds 2dsphere indexes for geospatial search
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('[MongoDB] Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
