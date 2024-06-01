const mongodb = require('../database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['collections']

    // const result = await mongodb
    //     .getDatabase()
    //     .db()
    //     .collection('collection')
    //     .find();

    const result = await mongodb
        .getDatabase()
        .db()
        .collection('collection')
        .aggregate([
            {
                $lookup: {
                    from: 'book',
                    localField: 'bookList',
                    foreignField: '_id',
                    as: 'books',
                },
            },
            // {
            //     $unwind: '$books',
            // },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    bookList: {
                        $map: {
                            input: '$books',
                            as: 'book',
                            in: {
                                _id: '$$book._id',
                                title: '$$book.title',
                                authorFirstName: '$$book.authorFirstName',
                                authorLastName: '$$book.authorLastName',
                            },
                        },
                    },
                },
            },
        ]);
    console.dir(result);

    result.toArray().then((collection) => {
        if (collection[0]) {
            console.log('SUCCESS');
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(collection);
        } else {
            console.log('FAILURE');
            res.status(404).json({ message: 'No collections found' });
        }
    });
};

/**
 * Get one collection
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getSingle = async (req, res) => {
    //#swagger.tags=['collections']
    const collectionId = new ObjectId(req.params.id);
    // const result = await mongodb
    //     .getDatabase()
    //     .db()
    //     .collection('collection')
    //     .find({ _id: collectionId });

    const result = await mongodb
        .getDatabase()
        .db()
        .collection('collection')
        .aggregate([
            {
                $match: { _id: new ObjectId(collectionId) },
            },
            {
                $lookup: {
                    from: 'book',
                    localField: 'bookList',
                    foreignField: '_id',
                    as: 'books',
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    bookList: {
                        $map: {
                            input: '$books',
                            as: 'book',
                            in: {
                                _id: '$$book._id',
                                title: '$$book.title',
                                authorFirstName: '$$book.authorFirstName',
                                authorLastName: '$$book.authorLastName',
                            },
                        },
                    },
                },
            },
        ]);

    await result
        .toArray()
        .then((collection) => {
            if (collection[0]) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(collection[0]);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        })
        .catch((error) => {
            res.status(404).json({ message: 'User not found' });
        });
};

const createCollection = async (req, res) => {
    //#swagger.tags=['collections']
    let collection;

    if (Array.isArray(req.body.bookList)) {
        collection = {
            name: req.body.name,
            bookList: req.body.bookList.map((bookId) => {
                return new ObjectId(bookId);
            }),
        };
    } else {
        return res
            .status(500)
            .json(
                response.error ||
                    'Some error occurred while inserting the book.'
            );
    }

    const result = await mongodb
        .getDatabase()
        .db()
        .collection('collection')
        .insertOne(collection);
    if (result.acknowledged) {
        res.status(204).json({ id: result.insertedId });
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while inserting the book.'
        );
    }
};

const updateCollection = async (req, res) => {
    //#swagger.tags=['collections']
    const collectionId = new ObjectId(req.params.id);
    // ! Change these dependant on how reveiws are formatted in the database.
    let collection;

    if (Array.isArray(req.body.bookList)) {
        console.log("It's an array");
        collection = {
            name: req.body.name,
            bookList: req.body.bookList.map((bookId) => {
                return new ObjectId(bookId);
            }),
        };
    } else {
        console.log('Array failed');
        return res
            .status(500)
            .json(
                response.error ||
                    'Some error occurred while updating the collection.'
            );
    }
    console.dir(collection);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('collection')
        .replaceOne({ _id: collectionId }, collection);

    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        console.log(response.modifiedCount);
        res.status(500).json(
            response.error ||
                'Some error occurred while updating the collection.'
        );
    }
};

const deleteCollection = async (req, res) => {
    //#swagger.tags=['collections']
    const collectionId = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('collection')
        .deleteOne({ _id: collectionId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(
            response.error ||
                'Some error occurred while deleting the collection.'
        );
    }
};

module.exports = {
    getAll,
    getSingle,
    createCollection,
    updateCollection,
    deleteCollection,
};
