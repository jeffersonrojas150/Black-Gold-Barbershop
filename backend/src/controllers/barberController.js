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
            data: barbers
        });
    } catch (error) {
        console.error('GetBarbers error:', error);
        res.status(500).json({
            error: 'Error al obtener barberos'
        });
    }
};

export const getBarber = async (req, res) => {
    try {
        const [barbers] = await pool.query(
            `SELECT 
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
             WHERE b.id = ?`,
            [req.params.id]
        );

        if (barbers.length === 0) {
            return res.status(404).json({
                error: 'Barbero no encontrado'
            });
        }

        res.status(200).json({
            data: barbers[0]
        });
    } catch (error) {
        console.error('GetBarber error:', error);
        res.status(500).json({
            error: 'Error al obtener barbero'
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

// @desc    Crear un barbero
// @route   POST /api/barbers
// @access  Admin
export const createBarber = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { name, email, password, specialty, bio, image_url, is_active, phone } = req.body;

        // Validaciones
        if (!name || !email || !password) {
            await connection.rollback();
            return res.status(400).json({ 
                error: 'Nombre, email y contraseña son requeridos' 
            });
        }

        if (password.length < 6) {
            await connection.rollback();
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        // Verificar si el email ya existe
        const [existingUser] = await connection.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            await connection.rollback();
            return res.status(400).json({ 
                error: 'El email ya está registrado' 
            });
        }

        // Hash de la contraseña
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.default.hash(password, 10);

        // 1. Crear el usuario con rol 'barber'
        const [userResult] = await connection.query(
            `INSERT INTO users (name, email, password, role, phone) 
             VALUES (?, ?, ?, 'barber', ?)`,
            [name, email, hashedPassword, phone || null]
        );

        const userId = userResult.insertId;

        // 2. Crear el barbero
        const [barberResult] = await connection.query(
            `INSERT INTO barbers (user_id, specialty, bio, image_url, is_active) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, specialty || null, bio || null, image_url || null, is_active !== false ? 1 : 0]
        );

        await connection.commit();

        // Obtener el barbero completo con info del usuario
        const [newBarber] = await connection.query(
            `SELECT 
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
             WHERE b.id = ?`,
            [barberResult.insertId]
        );

        res.status(201).json({
            data: newBarber[0],
            message: 'Barbero creado exitosamente'
        });
    } catch (error) {
        await connection.rollback();
        console.error('CreateBarber error:', error);
        res.status(500).json({
            error: 'Error al crear el barbero'
        });
    } finally {
        connection.release();
    }
};

// @desc    Actualizar un barbero
// @route   PUT /api/barbers/:id
// @access  Admin
export const updateBarber = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { id } = req.params;
        const { name, email, specialty, bio, image_url, is_active, phone } = req.body;

        // Verificar si el barbero existe
        const [existing] = await connection.query(
            'SELECT user_id FROM barbers WHERE id = ?',
            [id]
        );
        
        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                error: 'Barbero no encontrado'
            });
        }

        const barber = existing[0];

        // Actualizar usuario si se proporcionó name, email o phone
        if (name !== undefined || email !== undefined || phone !== undefined) {
            const userUpdates = [];
            const userValues = [];

            if (name !== undefined) {
                userUpdates.push('name = ?');
                userValues.push(name);
            }
            if (email !== undefined) {
                // Verificar que el email no esté en uso por otro usuario
                const [emailCheck] = await connection.query(
                    'SELECT id FROM users WHERE email = ? AND id != ?',
                    [email, barber.user_id]
                );
                if (emailCheck.length > 0) {
                    await connection.rollback();
                    return res.status(400).json({
                        error: 'El email ya está en uso'
                    });
                }
                userUpdates.push('email = ?');
                userValues.push(email);
            }
            if (phone !== undefined) {
                userUpdates.push('phone = ?');
                userValues.push(phone);
            }

            if (userUpdates.length > 0) {
                userValues.push(barber.user_id);
                await connection.query(
                    `UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`,
                    userValues
                );
            }
        }

        // Actualizar barbero
        const barberUpdates = [];
        const barberValues = [];

        if (specialty !== undefined) {
            barberUpdates.push('specialty = ?');
            barberValues.push(specialty);
        }
        if (bio !== undefined) {
            barberUpdates.push('bio = ?');
            barberValues.push(bio);
        }
        if (image_url !== undefined) {
            barberUpdates.push('image_url = ?');
            barberValues.push(image_url);
        }
        if (is_active !== undefined) {
            barberUpdates.push('is_active = ?');
            barberValues.push(is_active ? 1 : 0);
        }

        if (barberUpdates.length > 0) {
            barberValues.push(id);
            await connection.query(
                `UPDATE barbers SET ${barberUpdates.join(', ')} WHERE id = ?`,
                barberValues
            );
        }

        await connection.commit();

        // Obtener el barbero actualizado
        const [updated] = await connection.query(
            `SELECT 
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
             WHERE b.id = ?`,
            [id]
        );

        res.status(200).json({
            data: updated[0],
            message: 'Barbero actualizado exitosamente'
        });
    } catch (error) {
        await connection.rollback();
        console.error('UpdateBarber error:', error);
        res.status(500).json({
            error: 'Error al actualizar el barbero'
        });
    } finally {
        connection.release();
    }
};

// @desc    Eliminar un barbero
// @route   DELETE /api/barbers/:id
// @access  Admin
export const deleteBarber = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { id } = req.params;

        // Verificar si el barbero existe
        const [existing] = await connection.query(
            'SELECT user_id FROM barbers WHERE id = ?',
            [id]
        );
        
        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                error: 'Barbero no encontrado'
            });
        }

        const barber = existing[0];

        // Verificar si tiene citas asociadas
        const [appointments] = await connection.query(
            'SELECT COUNT(*) as count FROM appointments WHERE barber_id = ?',
            [id]
        );

        if (appointments[0].count > 0) {
            // Soft delete: marcar como inactivo
            await connection.query(
                'UPDATE barbers SET is_active = 0 WHERE id = ?',
                [id]
            );
            await connection.commit();
            return res.status(200).json({ 
                message: 'Barbero desactivado (tiene citas asociadas)' 
            });
        }

        // Si no tiene citas, eliminar completamente
        // Por el CASCADE, esto también eliminará el usuario
        await connection.query('DELETE FROM barbers WHERE id = ?', [id]);

        await connection.commit();

        res.status(200).json({ 
            message: 'Barbero eliminado exitosamente' 
        });
    } catch (error) {
        await connection.rollback();
        console.error('DeleteBarber error:', error);
        res.status(500).json({
            error: 'Error al eliminar el barbero'
        });
    } finally {
        connection.release();
    }
};