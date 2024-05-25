const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const bookRouter = require('./bookRoutes.js');
const reviewRouter = require('./reviewRoutes.js');
const userRouter = require('./userRoutes.js');

// Put all the routers here
router.use('/authentication', authenticationRouter);
router.use('/users', userRouter);
router.use('/books', bookRouter);
router.use('/reviews', reviewRouter);

module.exports = router