const express = require('express'); 
const router = express.Router(); 
const { insertSampleBook } = require('../controllers/bookController'); 

router.post('/insertSampleBook', insertSampleBook); 

module.exports = router; 

 