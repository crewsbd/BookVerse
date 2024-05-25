const { MongoClient, ObjectId } = require('mongodb'); 

async function insertSampleReview(req, res) { 
    await client.connect(); 
    const reviewsDb = client.db('reviews'); 
    const reviewsCollection = reviewsDb.collection('reviews'); 
    const sampleReview = { 
        _id: new ObjectId(), 
        userId: new ObjectId(req.body.userId), 
        bookId: new ObjectId(req.body.bookId), 
        rating: req.body.rating, 
        comment: req.body.comment 
    }; 
    await reviewsCollection.insertOne(sampleReview); 
    res.status(201).send('Sample review inserted'); 
    await client.close(); 
} 

 

async function getReviewsWithDetails(req, res) { 
    await client.connect(); 
    const reviewsDb = client.db('reviews'); 
    const reviewsCollection = reviewsDb.collection('reviews'); 
    const reviewsWithDetails = await reviewsCollection.aggregate([ 
    { 
        $lookup: { 
            from: 'users', 
            localField: 'userId', 
            foreignField: '_id', 
            as: 'userDetails' 
        } 
    }, 
    { 
        $lookup: { 
            from: 'books', 
            localField: 'bookId', 
            foreignField: '_id', 
            as: 'bookDetails' 
        } 
    }, 
    { $unwind: '$userDetails' }, 
    { $unwind: '$bookDetails' } 
    ]).toArray(); 
    res.status(200).json(reviewsWithDetails); 
    await client.close(); 
} 

module.exports = { insertSampleReview, getReviewsWithDetails }; 