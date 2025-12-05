import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { sanitizeInputs } from './middleware/sanitize.js';

// Rutas
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import barberRoutes from './routes/barberRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInputs);

// Rutas de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '💈 Barbershop API',
    version: '1.0.0',
    status: 'running' 
  });
});

app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({ 
    status: 'OK', 
    database: dbStatus ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/appointments', appointmentRoutes);

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  await testConnection();
});