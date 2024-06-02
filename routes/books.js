const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const bookController = require('../controllers/books.js');
const authentication = require('../authentication');
const validator = require('../validation/book.js');

/* Authorize for this route */
router.use(authentication.isAuthenticated);

/* get Routes */
router.get('/', bookController.getAll)
router.get('/:id', bookController.getSingle)

/* Post routes */
router.post('/', validator.validators, validator.handleErrors,  bookController.createBook)

/* Put routes */
router.put('/:id', validator.validators, validator.handleErrors, bookController.updateBook)

/* Delete Routes*/
router.delete('/:id', bookController.deleteBook)

module.exports = router;