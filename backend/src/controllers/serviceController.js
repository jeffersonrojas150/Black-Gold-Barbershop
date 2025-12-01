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
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        console.error('GetServices error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener servicios'
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
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: services[0]
        });
    } catch (error) {
        console.error('GetService error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener servicio'
        });
    }
};

export const createService = async (req, res) => {
    try {
        const { name, description, price, duration, image_url } = req.body;

        const [result] = await pool.query(
            'INSERT INTO services (name, description, price, duration, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description || null, price, duration, image_url || null]
        );

        const [services] = await pool.query(
            'SELECT * FROM services WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            data: services[0]
        });
    } catch (error) {
        console.error('CreateService error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear servicio'
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const { name, description, price, duration, image_url, is_active } = req.body;

        const [existing] = await pool.query(
            'SELECT id FROM services WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        await pool.query(
            'UPDATE services SET name = ?, description = ?, price = ?, duration = ?, image_url = ?, is_active = ? WHERE id = ?',
            [name, description, price, duration, image_url, is_active, req.params.id]
        );

        const [services] = await pool.query(
            'SELECT * FROM services WHERE id = ?',
            [req.params.id]
        );

        res.status(200).json({
            success: true,
            data: services[0]
        });
    } catch (error) {
        console.error('UpdateService error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar servicio'
        });
    }
};

export const deleteService = async (req, res) => {
    try {
        const [existing] = await pool.query(
            'SELECT id FROM services WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);

        res.status(200).json({
            success: true,
            message: 'Servicio eliminado exitosamente'
        });
    } catch (error) {
        console.error('DeleteService error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar servicio'
        });
    }
};