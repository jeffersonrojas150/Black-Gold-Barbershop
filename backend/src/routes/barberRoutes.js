import express from 'express';
import {
    getBarbers,
    getBarber,
    getBarberSchedule,
    getBarberAvailability
} from '../controllers/barberController.js';

const router = express.Router();

router.get('/', getBarbers);
router.get('/:id', getBarber);
router.get('/:id/schedule', getBarberSchedule);
router.get('/:id/availability', getBarberAvailability);

export default router;