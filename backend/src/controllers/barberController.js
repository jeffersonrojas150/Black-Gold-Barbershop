import pool from '../config/database.js';

// @desc    Obtener todos los barberos
// @route   GET /api/barbers
// @access  Public
export const getBarbers = async (req, res) => {
    try {
        const { is_active } = req.query;

        let query = `
      SELECT 
        b.id,
        b.user_id,
        b.specialty,
        b.bio,
        b.image_url,
        b.is_active,
        u.name,
        u.email,
        u.phone
      FROM barbers b
      INNER JOIN users u ON b.user_id = u.id
    `;

        const params = [];

        if (is_active !== undefined) {
            query += ' WHERE b.is_active = ?';
            params.push(is_active === 'true' ? 1 : 0);
        }

        query += ' ORDER BY u.name ASC';

        const [barbers] = await pool.query(query, params);

        res.status(200).json({
            success: true,
            count: barbers.length,
            data: barbers
        });
    } catch (error) {
        console.error('GetBarbers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener barberos'
        });
    }
};

// @desc    Obtener un barbero por ID
// @route   GET /api/barbers/:id
// @access  Public
export const getBarber = async (req, res) => {
    try {
        const [barbers] = await pool.query(
            `
      SELECT 
        b.id,
        b.user_id,
        b.specialty,
        b.bio,
        b.image_url,
        b.is_active,
        u.name,
        u.email,
        u.phone
      FROM barbers b
      INNER JOIN users u ON b.user_id = u.id
      WHERE b.id = ?
      `,
            [req.params.id]
        );

        if (barbers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Barbero no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: barbers[0]
        });
    } catch (error) {
        console.error('GetBarber error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener barbero'
        });
    }
};

// @desc    Obtener horarios de un barbero
// @route   GET /api/barbers/:id/schedule
// @access  Public
export const getBarberSchedule = async (req, res) => {
    try {
        const [schedules] = await pool.query(
            'SELECT * FROM barber_schedules WHERE barber_id = ? ORDER BY FIELD(day_of_week, "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")',
            [req.params.id]
        );

        res.status(200).json({
            success: true,
            data: schedules
        });
    } catch (error) {
        console.error('GetBarberSchedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener horarios'
        });
    }
};

// @desc    Obtener disponibilidad de barbero para una fecha
// @route   GET /api/barbers/:id/availability?date=YYYY-MM-DD&service_id=1
// @access  Public
export const getBarberAvailability = async (req, res) => {
    try {
        const { date, service_id } = req.query;

        if (!date || !service_id) {
            return res.status(400).json({
                success: false,
                message: 'Fecha y servicio son requeridos'
            });
        }

        // Obtener duración del servicio
        const [services] = await pool.query(
            'SELECT duration FROM services WHERE id = ?',
            [service_id]
        );

        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        const serviceDuration = services[0].duration;

        // Obtener día de la semana
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Obtener horario del barbero para ese día
        const [schedules] = await pool.query(
            'SELECT start_time, end_time FROM barber_schedules WHERE barber_id = ? AND day_of_week = ? AND is_available = 1',
            [req.params.id, dayOfWeek]
        );

        if (schedules.length === 0) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const schedule = schedules[0];

        // Obtener citas ya reservadas para ese día
        const [appointments] = await pool.query(
            'SELECT appointment_time, duration FROM appointments a INNER JOIN services s ON a.service_id = s.id WHERE barber_id = ? AND appointment_date = ? AND status != "cancelled"',
            [req.params.id, date]
        );

        // Generar slots disponibles
        const slots = [];
        const startTime = schedule.start_time.split(':');
        const endTime = schedule.end_time.split(':');

        let currentHour = parseInt(startTime[0]);
        let currentMinute = parseInt(startTime[1]);

        const endHour = parseInt(endTime[0]);
        const endMinute = parseInt(endTime[1]);

        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}:00`;

            // Verificar si el slot está ocupado
            const isOccupied = appointments.some(apt => {
                const aptTime = apt.appointment_time;
                const aptDuration = apt.duration;
                const aptEndMinutes = parseInt(aptTime.split(':')[0]) * 60 + parseInt(aptTime.split(':')[1]) + aptDuration;
                const slotMinutes = currentHour * 60 + currentMinute;
                const slotEndMinutes = slotMinutes + serviceDuration;

                const aptStartMinutes = parseInt(aptTime.split(':')[0]) * 60 + parseInt(aptTime.split(':')[1]);

                return (slotMinutes >= aptStartMinutes && slotMinutes < aptEndMinutes) ||
                    (slotEndMinutes > aptStartMinutes && slotEndMinutes <= aptEndMinutes) ||
                    (slotMinutes <= aptStartMinutes && slotEndMinutes >= aptEndMinutes);
            });

            if (!isOccupied) {
                // Verificar que hay tiempo suficiente antes del cierre
                const slotEndMinutes = currentHour * 60 + currentMinute + serviceDuration;
                const closeMinutes = endHour * 60 + endMinute;

                if (slotEndMinutes <= closeMinutes) {
                    slots.push(timeSlot);
                }
            }

            // Incrementar en intervalos de 30 minutos
            currentMinute += 30;
            if (currentMinute >= 60) {
                currentHour += 1;
                currentMinute = 0;
            }
        }

        res.status(200).json({
            success: true,
            data: slots
        });
    } catch (error) {
        console.error('GetBarberAvailability error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener disponibilidad'
        });
    }
};