const validator = require('express-validator');

const validators = [
    validator
        .body('title')
        .trim()
        .escape()
        .exists()
        .isString()
        .withMessage('Bad title'),
    validator
        .body('authorLastName')
        .trim()
        .escape()
        .exists()
        .isString()
        .withMessage('Bad last name'),
    validator
        .body('authorFirstName')
        .trim()
        .escape()
        .exists()
        .isString()
        .withMessage('Bad first name'),
    validator
        .body('publicationDate')
        .trim()
        .escape()
        .exists()
        .isISO8601()
        .withMessage('Bad date'),
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
