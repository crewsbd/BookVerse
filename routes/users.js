const router = require('express').Router();
const authenticationRouter = require('./authentication.js');
const usersController = require('../controllers/users.js')

//router.use('/authentication', authenticationRouter);

/* get Routes */
router.get('/', usersController.getAll)
router.get('/:id', usersController.getSingle)

/* Post routes */
router.post('/', usersController.createUser)

/* Put routes */
router.put('/:id', usersController.updateUser)

/* Delete Routes*/
router.delete('/:id', usersController.deleteUser)

module.exports = router;