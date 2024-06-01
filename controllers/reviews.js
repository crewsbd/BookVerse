const mongodb = require('../database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Reviews']
    // const result = await mongodb.getDatabase().db().collection('reviews').find();

    const result = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .aggregate([
            {
                $lookup: {
                    from: 'user',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'reviewer',
                },
            },
            {
                $unwind: '$reviewer',
            },
            {
                $lookup: {
                    from: 'book',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            {
                $unwind: '$book',
            },
            {
                $project: {
                    _id: 1,
                    reviewer: '$reviewer.name',
                    book: '$book.title',
                    authorFirstName: '$book.authorFirstName',
                    authorLastName: '$book.authorLastName',
                    rating: 1,
                    comment: 1,
                },
            },
        ]);
    result.toArray().then((reviews) => {
        if (reviews[0]) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(reviews);
        } else {
            res.status(404).json({ message: 'No reviews found' });
        }
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Reviews']
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .findOne({ _id: reviewId });

    if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: `Review ${req.params.id} not found` });
    }
};

const createReview = async (req, res) => {
    //#swagger.tags=['Reviews']
    // ! Change these dependant on how reveiws are formatted in the database.
    const review = {
        userId: new ObjectId(req.body.userId),
        bookId: new ObjectId(req.body.bookId),
        rating: req.body.rating,
        comment: req.body.comment,
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .insertOne(review);

    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while creating the review.'
        );
    }
};

const updateReview = async (req, res) => {
    //#swagger.tags=['Reviews']
    const reveiwID = new ObjectId(req.params.id);
    // ! Change these dependant on how reveiws are formatted in the database.
    const review = {
        userId: new ObjectId(req.body.userId),
        bookId: new ObjectId(req.body.bookId),
        rating: req.body.rating,
        comment: req.body.comment,
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .replaceOne({ _id: reveiwID }, review);

    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while updating the review.'
        );
    }
};

const deleteReview = async (req, res) => {
    //#swagger.tags=['Reviews']
    const reviewID = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .deleteOne({ _id: reviewID });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while deleting the review.'
        );
    }
};

module.exports = {
    getAll,
    getSingle,
    createReview,
    updateReview,
    deleteReview,
};

// testing
