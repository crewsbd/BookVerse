const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const bookRouter = require('./bookRoutes.js');
const reviewRouter = require('./reviewRoutes.js');
const userRouter = require('./userRoutes.js');
const swaggerRouter = require('./swagger.js');

// Put all the routers here
router.use('/api-docs', swaggerRouter);
router.use('/authentication', authenticationRouter);
router.use('/users', userRouter);
router.use('/books', bookRouter);
router.use('/reviews', reviewRouter);

router.use('/books', require('./books.js'));

router.use('/users', require('./users.js'));

router.use('/reviews', require('./reviews.js'));

module.exports = router;
