const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const reviewsController = require('../controllers/reviews.js');
const authentication = require('../authentication');
const validation = require('../validation/review.js');

/* Authorize for this route */
router.use(authentication.isAuthenticated);

/* get Routes */
router.get('/', reviewsController.getAll);
router.get('/:id', reviewsController.getSingle);

/* Post routes */
router.post('/', validation.validators, validation.handleErrors, reviewsController.createReview);

/* Put routes */
router.put('/:id', validation.validators, validation.handleErrors, reviewsController.updateReview);

/* Delete Routes*/
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;