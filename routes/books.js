const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const bookController = require('../controllers/books.js')

//router.use('/authentication', authenticationRouter);

/* get Routes */
router.get('/', bookController.getAll)
router.get('/:id', bookController.getSingle)

/* Post routes */
router.post('/', bookController.createBook)

/* Put routes */
router.put('/:id', bookController.updateBook)

/* Delete Routes*/
router.delete('/:id', bookController.deleteBook)

module.exports = router;