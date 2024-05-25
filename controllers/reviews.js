const mongodb = require('../database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Reviews']
    const result = await mongodb.getDatabase().db().collection('reviews').find();
    result.toArray().then((reviews) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reviews);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Reviews']
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('reviews').find({ _id: reviewId });
    result.toArray().then((reveiws) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reveiws[0]);
    });
};

const createReview = async (req, res) => {
    //#swagger.tags=['Reviews']
    // ! Change these dependant on how reveiws are formatted in the database. 
    const review = {
        data1: req.body.data1,
        data2: req.body.data2  
    };
    const response = await mongodb.getDatabase().db().collection('reviews').insertOne(review);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the review.');
    }
};

const updateReview = async (req, res) => {
    //#swagger.tags=['Reviews']
    const reveiwID = new ObjectId(req.params.id);
    // ! Change these dependant on how reveiws are formatted in the database.
    const review = {
        data1: req.body.data1,
        data2: req.body.data2
    };
    const response = await mongodb.getDatabase().db().collection('reviews').replaceOne({ _id: reveiwID }, review);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the review.');
    }
};

const deleteReview = async (req, res) => {
    //#swagger.tags=['Reviews']
    const reviewID = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('reviews').deleteOne({ _id: reviewID });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the review.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createReview,
    updateReview,
    deleteReview
}

// testing