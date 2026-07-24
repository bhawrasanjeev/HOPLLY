import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/db/connection.js';
import { seedData } from './src/db/seed.js';

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Try auto-seeding if DB is connected
  try {
    await seedData();
  } catch (err) {
    console.warn('[Seed warning]:', err.message);
  }

  const startOnPort = (port) => {
    const server = app.listen(port, () => {
      console.log(`Hoply Express Backend Server running on port ${port}`);
      console.log(`Health Check: http://localhost:${port}/api/health`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[Server] Port ${port} is already in use. Retrying on ${port + 1}...`);
        startOnPort(port + 1);
        return;
      }

      console.error('[Server] Failed to start:', err);
      process.exit(1);
    });
  };

  startOnPort(PORT);
};

startServer();
