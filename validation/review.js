const validator = require('express-validator');

const validators = [
    validator
        .body('userName')
        .trim()
        .escape()
        .exists()
        .isString()
        .withMessage('Bad user name'),
        validator
        .body('reviewText')
        .trim()
        .escape()
        .exists()
        .isString()
        .withMessage('Bad review text'),

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
