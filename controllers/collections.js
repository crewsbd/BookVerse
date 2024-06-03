const mongodb = require('../database');
const ObjectId = require('bson').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['collections']
    //#swagger.description = 'Get all collection documents'

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
    return result.toArray().then((collection) => {
        if (collection[0]) {
            console.log('SUCCESS getAll toArray');
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(collection); // Include return so it can be tested.
        } else {
            console.log('FAILURE: getAll toArray');
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
    //#swagger.description = 'Get one collection document'
    const collectionId = new ObjectId(req.params.id);

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
                res.status(404).json({ message: 'Collection not found' });
            }
        })
        .catch((error) => {
            res.status(404).json({ message: 'Collection not found' });
        });
};

const createCollection = async (req, res) => {
    //#swagger.tags=['collections']

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create one collection document',
        schema: {
            $name: 'John Roe',
            $userId: '665220f5a5130bbd1e9fef37',
            $bookList: [ '6646462b5878f42691955e07' ]
        }
    }
    */

    let collection;

    if (Array.isArray(req.body.bookList)) {
        console.log("It's an array");
        collection = {
            name: req.body.name,
            userId: req.body.userId,
            bookList: req.body.bookList.map((bookId) => {
                return new ObjectId(bookId);
            }),
        };
    } else {
        console.log('Error mapping array');
        return res
            .status(500)
            .json('Some error occurred while inserting the collection.');
    }

    const result = await mongodb
        .getDatabase()
        .db()
        .collection('collection')
        .insertOne(collection);
    if (result.acknowledged) {
        res.status(201).json({ created: result.insertedId });
    } else {
        res.status(500).json(
            response.error ||
                'Some error occurred while inserting the collection.'
        );
    }
};

const updateCollection = async (req, res) => {
    //#swagger.tags=['collections']

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update one collection document',
        schema: {
            $name: 'John Roe',
            $userId: '665220f5a5130bbd1e9fef37',
            $bookList: [ '6646462b5878f42691955e07' ]
        }
    }
    */

    const collectionId = new ObjectId('' + req.params.id);
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
        res.status(200).json({ updated: `${req.params.id}` });
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
    //#swagger.description = 'Delete one collection document'
    const collectionId = new ObjectId('' + req.params.id); // Doesn't want a number.
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('collection')
        .deleteOne({ _id: collectionId });
    if (response.deletedCount > 0) {
        res.status(200).json({ deleted: `${req.params.id}` });
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
