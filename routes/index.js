const router = require('express').Router();
const authenticationRouter = require('./authentication.js');

const swaggerRouter = require('./swagger.js');

// Put all the routers here
router.use('/api-docs', swaggerRouter);
router.use('/authentication', authenticationRouter);
//router.use('/users', userRouter);
//router.use('/books', bookRouter);
//router.use('/reviews', reviewRouter);

router.use('/books', require('./books.js'));

router.use('/users', require('./users.js'));

router.use('/reviews', require('./reviews.js'));

router.use('/collections', require('./collections.js'));

module.exports = router;
