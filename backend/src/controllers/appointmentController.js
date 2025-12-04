import pool from '../config/database.js';

export const getAppointments = async (req, res) => {
    try {
        const { status, date, barber_id } = req.query;
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.notes,
        a.created_at,
        s.name as service_name,
        s.price as service_price,
        s.duration as service_duration,
        u_client.name as client_name,
        u_client.email as client_email,
        u_client.phone as client_phone,
        u_barber.name as barber_name,
        b.id as barber_id
      FROM appointments a
      INNER JOIN services s ON a.service_id = s.id
      INNER JOIN users u_client ON a.client_id = u_client.id
      INNER JOIN barbers b ON a.barber_id = b.id
      INNER JOIN users u_barber ON b.user_id = u_barber.id
      WHERE 1=1
    `;

        const params = [];

        // Filtrar por rol
        if (userRole === 'client') {
            query += ' AND a.client_id = ?';
            params.push(userId);
        } else if (userRole === 'barber') {
            // Obtener el barber_id del usuario
            const [barberData] = await pool.query(
                'SELECT id FROM barbers WHERE user_id = ?',
                [userId]
            );
            if (barberData.length > 0) {
                query += ' AND a.barber_id = ?';
                params.push(barberData[0].id);
            }
        }

        // Filtros adicionales
        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }

        if (date) {
            query += ' AND a.appointment_date = ?';
            params.push(date);
        }

        if (barber_id) {
            query += ' AND a.barber_id = ?';
            params.push(barber_id);
        }

        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

        const [appointments] = await pool.query(query, params);

        res.status(200).json({
            data: appointments
        });
    } catch (error) {
        console.error('GetAppointments error:', error);
        res.status(500).json({
            error: 'Error al obtener citas'
        });
    }
};

export const getAppointment = async (req, res) => {
    try {
        const [appointments] = await pool.query(
            `
      SELECT 
        a.*,
        s.name as service_name,
        s.price as service_price,
        s.duration as service_duration,
        u_client.name as client_name,
        u_client.email as client_email,
        u_client.phone as client_phone,
        u_barber.name as barber_name,
        b.id as barber_id
      FROM appointments a
      INNER JOIN services s ON a.service_id = s.id
      INNER JOIN users u_client ON a.client_id = u_client.id
      INNER JOIN barbers b ON a.barber_id = b.id
      INNER JOIN users u_barber ON b.user_id = u_barber.id
      WHERE a.id = ?
      `,
            [req.params.id]
        );

        if (appointments.length === 0) {
            return res.status(404).json({
                error: 'Cita no encontrada'
            });
        }

        const appointment = appointments[0];

        // Verificar permisos
        const userRole = req.user.role;
        const userId = req.user.id;

        if (userRole === 'client' && appointment.client_id !== userId) {
            return res.status(403).json({
                error: 'No tienes permiso para ver esta cita'
            });
        }

        if (userRole === 'barber') {
            const [barberData] = await pool.query(
                'SELECT id FROM barbers WHERE user_id = ?',
                [userId]
            );
            if (barberData.length === 0 || barberData[0].id !== appointment.barber_id) {
                return res.status(403).json({
                    error: 'No tienes permiso para ver esta cita'
                });
            }
        }

        res.status(200).json({
            data: appointment
        });
    } catch (error) {
        console.error('GetAppointment error:', error);
        res.status(500).json({
            error: 'Error al obtener cita'
        });
    }
};

export const createAppointment = async (req, res) => {
    try {
        const { barber_id, service_id, appointment_date, appointment_time, notes } = req.body;
        const client_id = req.user.id;

        // Validar que todos los campos estén presentes
        if (!barber_id || !service_id || !appointment_date || !appointment_time) {
            return res.status(400).json({
                error: 'Todos los campos son requeridos'
            });
        }

        // Validar que la fecha sea futura
        const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
        const now = new Date();

        if (appointmentDateTime <= now) {
            return res.status(400).json({
                error: 'La fecha y hora de la cita debe ser futura'
            });
        }

        // Verificar que el barbero existe y está activo
        const [barbers] = await pool.query(
            'SELECT id FROM barbers WHERE id = ? AND is_active = 1',
            [barber_id]
        );

        if (barbers.length === 0) {
            return res.status(404).json({
                error: 'Barbero no encontrado o no disponible'
            });
        }

        // Verificar que el servicio existe y está activo
        const [services] = await pool.query(
            'SELECT id, duration FROM services WHERE id = ? AND is_active = 1',
            [service_id]
        );

        if (services.length === 0) {
            return res.status(404).json({
                error: 'Servicio no encontrado o no disponible'
            });
        }

        const serviceDuration = services[0].duration;

        // Verificar disponibilidad del barbero
        const dayOfWeek = appointmentDateTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const [schedules] = await pool.query(
            'SELECT start_time, end_time FROM barber_schedules WHERE barber_id = ? AND day_of_week = ? AND is_available = 1',
            [barber_id, dayOfWeek]
        );

        if (schedules.length === 0) {
            return res.status(400).json({
                error: 'El barbero no está disponible en ese día'
            });
        }

        // Verificar que el horario está dentro del horario laboral
        const schedule = schedules[0];
        const appointmentTimeStr = appointment_time + ':00';

        if (appointmentTimeStr < schedule.start_time || appointmentTimeStr >= schedule.end_time) {
            return res.status(400).json({
                error: 'El horario seleccionado está fuera del horario laboral'
            });
        }

        // Verificar que no haya conflictos con otras citas
        const [conflicts] = await pool.query(
            `
      SELECT a.id, a.appointment_time, s.duration
      FROM appointments a
      INNER JOIN services s ON a.service_id = s.id
      WHERE a.barber_id = ? 
        AND a.appointment_date = ? 
        AND a.status != 'cancelled'
      `,
            [barber_id, appointment_date]
        );

        // Verificar solapamiento
        for (const conflict of conflicts) {
            const conflictTime = conflict.appointment_time;
            const conflictDuration = conflict.duration;

            const conflictStart = parseInt(conflictTime.split(':')[0]) * 60 + parseInt(conflictTime.split(':')[1]);
            const conflictEnd = conflictStart + conflictDuration;

            const appointmentStart = parseInt(appointment_time.split(':')[0]) * 60 + parseInt(appointment_time.split(':')[1]);
            const appointmentEnd = appointmentStart + serviceDuration;

            if (
                (appointmentStart >= conflictStart && appointmentStart < conflictEnd) ||
                (appointmentEnd > conflictStart && appointmentEnd <= conflictEnd) ||
                (appointmentStart <= conflictStart && appointmentEnd >= conflictEnd)
            ) {
                return res.status(400).json({
                    error: 'El horario seleccionado no está disponible'
                });
            }
        }



        // Crear la cita
        const [result] = await pool.query(
            'INSERT INTO appointments (client_id, barber_id, service_id, appointment_date, appointment_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [client_id, barber_id, service_id, appointment_date, appointment_time, notes || null, 'pending']
        );

        // Obtener la cita creada
        const [newAppointment] = await pool.query(
            `
      SELECT 
        a.*,
        s.name as service_name,
        s.price as service_price,
        s.duration as service_duration,
        u_client.name as client_name,
        u_barber.name as barber_name
      FROM appointments a
      INNER JOIN services s ON a.service_id = s.id
      INNER JOIN users u_client ON a.client_id = u_client.id
      INNER JOIN barbers b ON a.barber_id = b.id
      INNER JOIN users u_barber ON b.user_id = u_barber.id
      WHERE a.id = ?
      `,
            [result.insertId]
        );

        res.status(201).json({
            data: newAppointment[0],
            message: 'Cita creada exitosamente'
        });
    } catch (error) {
        console.error('CreateAppointment error:', error);
        res.status(500).json({
            error: 'Error al crear cita'
        });
    }
};


export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointmentId = req.params.id;

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({
                error: 'Estado inválido'
            });
        }

        // Validar que barberos solo puedan marcar como completadas
        if (req.user.role === 'barber' && status !== 'completed') {
            return res.status(403).json({
                error: 'Los barberos solo pueden marcar citas como completadas'
            });
        }

        // Obtener la cita
        const [appointments] = await pool.query(
            'SELECT * FROM appointments WHERE id = ?',
            [appointmentId]
        );

        if (appointments.length === 0) {
            return res.status(404).json({
                error: 'Cita no encontrada'
            });
        }

        const appointment = appointments[0];

        // Verificar permisos
        const userRole = req.user.role;
        const userId = req.user.id;

        if (userRole === 'client') {
            // Los clientes solo pueden cancelar sus propias citas
            if (appointment.client_id !== userId) {
                return res.status(403).json({
                    error: 'No tienes permiso para modificar esta cita'
                });
            }

            if (status !== 'cancelled') {
                return res.status(403).json({
                    error: 'Solo puedes cancelar citas'
                });
            }

            // Validar que se cancele con al menos 2 días de anticipación
            const appointmentDate = new Date(appointment.appointment_date);
            const now = new Date();
            const diffTime = appointmentDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 2) {
                return res.status(400).json({
                    error: 'Las citas deben cancelarse con al menos 2 días de anticipación'
                });
            }
        }

        // Actualizar estado
        await pool.query(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, appointmentId]
        );

        // Obtener cita actualizada
        const [updatedAppointment] = await pool.query(
            `
      SELECT 
        a.*,
        s.name as service_name,
        s.price as service_price,
        u_client.name as client_name,
        u_barber.name as barber_name
      FROM appointments a
      INNER JOIN services s ON a.service_id = s.id
      INNER JOIN users u_client ON a.client_id = u_client.id
      INNER JOIN barbers b ON a.barber_id = b.id
      INNER JOIN users u_barber ON b.user_id = u_barber.id
      WHERE a.id = ?
      `,
            [appointmentId]
        );

        res.status(200).json({
            data: updatedAppointment[0],
            message: 'Estado de cita actualizado exitosamente'
        });
    } catch (error) {
        console.error('UpdateAppointmentStatus error:', error);
        res.status(500).json({
            error: 'Error al actualizar estado de cita'
        });
    }
};


export const deleteAppointment = async (req, res) => {
    try {
        const [appointments] = await pool.query(
            'SELECT id FROM appointments WHERE id = ?',
            [req.params.id]
        );

        if (appointments.length === 0) {
            return res.status(404).json({
                error: 'Cita no encontrada'
            });
        }

        await pool.query('DELETE FROM appointments WHERE id = ?', [req.params.id]);

        res.status(200).json({
            message: 'Cita eliminada exitosamente'
        });
    } catch (error) {
        console.error('DeleteAppointment error:', error);
        res.status(500).json({
            error: 'Error al eliminar cita'
        });
    }
};


export const getAppointmentStats = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user.id;

        let whereClause = '';
        const params = [];

        if (userRole === 'barber') {
            const [barberData] = await pool.query(
                'SELECT id FROM barbers WHERE user_id = ?',
                [userId]
            );
            if (barberData.length > 0) {
                whereClause = 'WHERE barber_id = ?';
                params.push(barberData[0].id);
            }
        }

        // Total de citas
        const [totalResult] = await pool.query(
            `SELECT COUNT(*) as total FROM appointments ${whereClause}`,
            params
        );

        // Citas por estado
        const [statusResult] = await pool.query(
            `SELECT status, COUNT(*) as count FROM appointments ${whereClause} GROUP BY status`,
            params
        );

        // Citas del mes actual
        const [monthResult] = await pool.query(
            `SELECT COUNT(*) as count FROM appointments 
       ${whereClause ? whereClause + ' AND' : 'WHERE'} 
       MONTH(appointment_date) = MONTH(CURRENT_DATE()) 
       AND YEAR(appointment_date) = YEAR(CURRENT_DATE())`,
            params
        );

        // Ingresos del mes (si es admin)
        let monthlyRevenue = 0;
        if (userRole === 'admin') {
            const [revenueResult] = await pool.query(
                `SELECT SUM(s.price) as revenue FROM appointments a
         INNER JOIN services s ON a.service_id = s.id
         WHERE a.status = 'completed'
         AND MONTH(a.appointment_date) = MONTH(CURRENT_DATE())
         AND YEAR(a.appointment_date) = YEAR(CURRENT_DATE())`
            );
            monthlyRevenue = revenueResult[0].revenue || 0;
        }

        res.status(200).json({
            data: {
                total: totalResult[0].total,
                byStatus: statusResult,
                thisMonth: monthResult[0].count,
                monthlyRevenue
            }
        });
    } catch (error) {
        console.error('GetAppointmentStats error:', error);
        res.status(500).json({
            error: 'Error al obtener estadísticas'
        });
    }
};