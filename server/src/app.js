import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/assistant', assistantRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Hoply Express Backend',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
