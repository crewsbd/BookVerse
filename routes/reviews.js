const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const reviewsController = require('../controllers/reviews.js');

//router.use('/authentication', authenticationRouter);

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