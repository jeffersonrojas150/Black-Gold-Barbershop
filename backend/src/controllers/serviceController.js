import pool from '../config/database.js';

export const getServices = async (req, res) => {
    try {
        const { is_active } = req.query;

        let query = 'SELECT * FROM services';
        const params = [];

        if (is_active !== undefined) {
            query += ' WHERE is_active = ?';
            params.push(is_active === 'true' ? 1 : 0);
        }

        query += ' ORDER BY name ASC';

        const [services] = await pool.query(query, params);

        res.status(200).json({
            data: services
        });
    } catch (error) {
        console.error('GetServices error:', error);
        res.status(500).json({
            error: 'Error al obtener servicios'
        });
    }
};

export const getService = async (req, res) => {
    try {
        const [services] = await pool.query(
            'SELECT * FROM services WHERE id = ?',
            [req.params.id]
        );

        if (services.length === 0) {
            return res.status(404).json({
                error: 'Servicio no encontrado'
            });
        }

        res.status(200).json({
            data: services[0]
        });
    } catch (error) {
        console.error('GetService error:', error);
        res.status(500).json({
            error: 'Error al obtener servicio'
        });
    }
};

export const createService = async (req, res) => {
    try {
        const { name, description, price, duration, image_url, is_active } = req.body;

        // Validaciones
        if (!name || !description || !price || !duration) {
            return res.status(400).json({ 
                error: 'Nombre, descripción, precio y duración son requeridos' 
            });
        }

        if (price <= 0) {
            return res.status(400).json({ 
                error: 'El precio debe ser mayor a 0' 
            });
        }

        if (duration <= 0) {
            return res.status(400).json({ 
                error: 'La duración debe ser mayor a 0' 
            });
        }

        const [result] = await pool.query(
            'INSERT INTO services (name, description, price, duration, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            [
                name, 
                description, 
                price, 
                duration, 
                image_url || null,
                is_active !== false ? 1 : 0
            ]
        );

        const [services] = await pool.query(
            'SELECT * FROM services WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            data: services[0],
            message: 'Servicio creado exitosamente'
        });
    } catch (error) {
        console.error('CreateService error:', error);
        res.status(500).json({
            error: 'Error al crear servicio'
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const { name, description, price, duration, image_url, is_active } = req.body;

        // Verificar si el servicio existe
        const [existing] = await pool.query(
            'SELECT * FROM services WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                error: 'Servicio no encontrado'
            });
        }

        const currentService = existing[0];

        // Validaciones solo si se proporcionan los campos
        if (price !== undefined && price <= 0) {
            return res.status(400).json({ 
                error: 'El precio debe ser mayor a 0' 
            });
        }

        if (duration !== undefined && duration <= 0) {
            return res.status(400).json({ 
                error: 'La duración debe ser mayor a 0' 
            });
        }

        // Actualización parcial - solo actualizar campos proporcionados
        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push('name = ?');
            values.push(name);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (price !== undefined) {
            updates.push('price = ?');
            values.push(price);
        }
        if (duration !== undefined) {
            updates.push('duration = ?');
            values.push(duration);
        }
        if (image_url !== undefined) {
            updates.push('image_url = ?');
            values.push(image_url);
        }
        if (is_active !== undefined) {
            updates.push('is_active = ?');
            values.push(is_active ? 1 : 0);
        }

        if (updates.length === 0) {
            return res.status(400).json({ 
                error: 'No hay campos para actualizar' 
            });
        }

        values.push(req.params.id);

        await pool.query(
            `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const [services] = await pool.query(
            'SELECT * FROM services WHERE id = ?',
            [req.params.id]
        );

        res.status(200).json({
            data: services[0],
            message: 'Servicio actualizado exitosamente'
        });
    } catch (error) {
        console.error('UpdateService error:', error);
        res.status(500).json({
            error: 'Error al actualizar servicio'
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        // Verificar si el servicio existe
        const [existing] = await pool.query(
            'SELECT * FROM services WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                error: 'Servicio no encontrado'
            });
        }

        // Verificar si hay citas asociadas
        const [appointments] = await pool.query(
            'SELECT COUNT(*) as count FROM appointments WHERE service_id = ?',
            [req.params.id]
        );

        if (appointments[0].count > 0) {
            // Soft delete: marcar como inactivo en lugar de eliminar
            await pool.query(
                'UPDATE services SET is_active = 0 WHERE id = ?',
                [req.params.id]
            );
            return res.status(200).json({ 
                message: 'Servicio desactivado (tiene citas asociadas)' 
            });
        }

        // Si no tiene citas, eliminar completamente
        await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);

        res.status(200).json({ 
            message: 'Servicio eliminado exitosamente' 
        });
    } catch (error) {
        console.error('DeleteService error:', error);
        res.status(500).json({
            error: 'Error al eliminar servicio'
        });
    }
};