import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAppointmentStats
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Estadísticas (Admin y Barber)
router.get('/stats', authorize('admin', 'barber'), getAppointmentStats);

// CRUD de citas
router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.post('/', authorize('client'), createAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.delete('/:id', authorize('admin'), deleteAppointment);

export default router;