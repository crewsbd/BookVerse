const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const reviewsController = require('../controllers/reviews.js');
const authentication = require('../authentication');

/* Authorize for this route */
router.use(authentication.isAuthenticated);

/* get Routes */
router.get('/', reviewsController.getAll);
router.get('/:id', reviewsController.getSingle);

/* Post routes */
router.post('/', reviewsController.createReview);

/* Put routes */
router.put('/:id', reviewsController.updateReview);

/* Delete Routes*/
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;