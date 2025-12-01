import jwt from 'jsonwebtoken';

// Generar JWT
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Enviar token en respuesta
export const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user.id);

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};