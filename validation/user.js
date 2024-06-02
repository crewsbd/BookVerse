const validator = require('express-validator');

const validators = [
    validator.body('oauthid').exists().isNumeric().withMessage('Bad oauthID'),
    validator
        .body('name')
        .trim()
        .escape()
        .exists()
        .isString()
        //.isNumeric()
        .withMessage('Bad name'),
    validator
        .body('profileUrl')
        .customSanitizer((url) => {
            return decodeURIComponent(url);
        })
        .trim()
        .escape()
        .exists()
        .isString()
        //.isURL()
        .withMessage('Bad profile url'),
    validator
        .body('authProvider')
        .trim()
        .escape()
        .exists()
        .isString()
        .withMessage('Bad auth provider'),
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
