const validator = require('express-validator');

const validators = [
    validator
        .body('name')
        .trim()
        .escape()
        .exists()
        .isString()
        .withMessage('Bad name'),
    validator
        .body('bookList')
        .exists()
        .isArray()
        .withMessage('Bad book list'),
];

/**
 * Middleware to handle validation errors found
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
const handleErrors = (request, response, next) => {
    const errors = validator.validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).json({ Errors: errors.array() });
    } else {
        next();
    }
};

module.exports = { validators, handleErrors };
