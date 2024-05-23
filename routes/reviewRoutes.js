const express = require('express'); 
const router = express.Router(); 
const { insertSampleReview, getReviewsWithDetails } = require('../controllers/reviewController'); 

router.post('/insertSampleReview', insertSampleReview); 
router.get('/getReviewsWithDetails', getReviewsWithDetails); 

module.exports = router; 