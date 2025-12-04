import express from 'express';
import {
    getBarbers,
    getBarber,
    getBarberSchedule,
    getBarberAvailability,
    createBarber,
    updateBarber,
    deleteBarber
} from '../controllers/barberController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', getBarbers);
router.get('/:id', getBarber);
router.get('/:id/schedule', getBarberSchedule);
router.get('/:id/availability', getBarberAvailability);

// Rutas protegidas solo para admin
router.post('/', protect, authorize('admin'), createBarber);
router.put('/:id', protect, authorize('admin'), updateBarber);
router.delete('/:id', protect, authorize('admin'), deleteBarber);

export default router;