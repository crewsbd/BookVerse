const router = require('express').Router();
const authenticationRouter = require('./authentication.js');

// Put all the routers here
router.use('/authentication', authenticationRouter);

router.use('/books', require('./books.js'));

router.use('/users', require('./users.js'));

router.use('/reviews', require('./reviews.js'));

module.exports = router;