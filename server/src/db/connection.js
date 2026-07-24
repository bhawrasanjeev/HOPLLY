import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hoplly';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Database connection failure: ${error.message}`);
    // Do not terminate process immediately to allow server to startup with fallback messages
  }
};
