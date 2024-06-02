const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const collectionController = require('../controllers/collections.js');
const authentication = require('../authentication');
const validation = require('../validation/collection.js');

/* Authorize for this route */
router.use(authentication.isAuthenticated);

/* get Routes */
router.get('/', collectionController.getAll)
router.get('/:id', collectionController.getSingle)

/* Post routes */
router.post('/', validation.validators, validation.handleErrors, collectionController.createCollection)

/* Put routes */
router.put('/:id', validation.validators, validation.handleErrors, collectionController.updateCollection)

/* Delete Routes*/
router.delete('/:id', collectionController.deleteCollection)

module.exports = router;