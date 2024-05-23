const router = require('express').Router();
const authenticationRouter = require('./authentication.js');

// Put all the routers here
router.use('/authentication', authenticationRouter);

module.exports = router