const express = require('express'); 
const router = express.Router(); 
const { insertSampleUser, addBookToUserCollection, getUserBookCollection } = require('../controllers/userController'); 

router.post('/insertSampleUser', insertSampleUser); 
router.post('/:userId/addBookToCollection', addBookToUserCollection); 
router.get('/:userId/getBookCollection', getUserBookCollection); 

module.exports = router; 