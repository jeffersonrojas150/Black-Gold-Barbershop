import { body, query, param } from 'express-validator';

// Sanitizar strings generales
export const sanitizeString = (field) => {
    return body(field)
        .trim()
        .escape()
        .stripLow();
};

// Sanitizar emails
export const sanitizeEmail = (field) => {
    return body(field)
        .trim()
        .normalizeEmail()
        .isEmail();
};

// Middleware para limpiar todos los inputs
export const sanitizeInputs = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }

    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }

    next();
};