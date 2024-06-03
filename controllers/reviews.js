const mongodb = require('../database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['reviews']
    //#swagger.description = 'Get all review documents'

    const result = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .aggregate([
            {
                $lookup: {
                    from: 'book',
                    localField: 'bookId',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$book',
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    book: {
                        _id: 1,
                        title: 1,
                        authorFirstName: 1,
                        authorLastName: 1,
                        genre: 1,
                    },
                    rating: 1,
                    text: 1,
                    user: {
                        _id: 1,
                        name: 1,
                    },
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
    //#swagger.tags=['reviews']
    //#swagger.description = 'Get one review document'

    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .aggregate([
            {
                $match: { _id: new ObjectId(reviewId) },
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
                $lookup: {
                    from: 'user',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$book',
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    book: {
                        _id: 1,
                        title: 1,
                        authorFirstName: 1,
                        authorLastName: 1,
                        genre: 1,
                    },
                    rating: 1,
                    text: 1,
                    user: {
                        _id: 1,
                        name: 1,
                    },
                },
            },
        ]);

        await result
        .toArray()
        .then((review) => {
            if (review[0]) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(review[0]);
            } else {
                res.status(404).json({ message: 'Review not found' });
            }
        })
        .catch((error) => {
            res.status(404).json({ message: 'Review not found' });
        });
};

const createReview = async (req, res) => {
    //#swagger.tags=['reviews']

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create one review document',
        schema: {
            $userId: '665220f5a5130bbd1e9fef37',
            $bookId: '6646462b5878f42691955e07',
            $rating: 4,
            $text: 'Great book'
        }
    }
    */

    const review = {
        userId: req.body.userId,
        bookId: req.body.bookId,
        rating: req.body.rating,
        text: req.body.text,
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
    //#swagger.tags=['reviews']

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update one review document',
        schema: {
            $userId: '665220f5a5130bbd1e9fef37',
            $bookId: '6646462b5878f42691955e07',
            $rating: 4,
            $text: 'Great book'
        }
    }
    */

    const reveiwID = new ObjectId(req.params.id);

    const review = {
        userId: req.body.userId,
        bookId: req.body.bookId,
        rating: req.body.rating,
        text: req.body.text,
    };

    const response = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .replaceOne({ _id: reveiwID }, review);

    if (response.modifiedCount > 0) {
        res.status(204).json({ deleted: `${req.params.id}` });
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while updating the review.'
        );
    }
};

const deleteReview = async (req, res) => {
    //#swagger.tags=['reviews']
    //#swagger.description = 'Delete one review document'

    const reviewID = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('reviews')
        .deleteOne({ _id: reviewID });
    if (response.deletedCount > 0) {
        res.status(204).json({ deleted: `${req.params.id}` });
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
