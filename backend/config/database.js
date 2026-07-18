import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Ensure configuration parameters load
dotenv.config();

/**
 * connectDB
 * Connects to MongoDB Atlas cluster using URI stored in environment variables.
 */
const connectDB = async () => {
  try {
    // useNewUrlParser and useUnifiedTopology are unsupported in modern Mongoose v9 and omitted
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
