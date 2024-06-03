const mongodb = require('../database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['books']
    //#swagger.description = 'Get all book documents'
    const result = await mongodb.getDatabase().db().collection('book').find();
    result.toArray().then((books) => {
        if (books[0]) {
            console.log('SUCCESS');
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(books);
        } else {
            console.log('FAILURE');
            res.status(404).json({ message: 'No books found' });
        }
    });
};

/**
 * Get one book
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getSingle = async (req, res) => {
    //#swagger.tags=['books']
    //#swagger.description = 'Get one book document'
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('book')
        .find({ _id: bookId });

    await result
        .toArray()
        .then((book) => {
            if (book[0]) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(book[0]);
            } else {
                res.status(404).json({ message: 'Book not found' });
            }
        })
        .catch((error) => {
            res.status(404).json({ message: 'User not found' });
        });
};

const createBook = async (req, res) => {
    //#swagger.tags=['books']

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create one book document',
        schema: {
            $title: '1984',
            $authorLastName: 'Orwell',
            $authorFirstName: 'George',
            $isbn: '978-0151010264',
            $publisher: 'Mariner Books Classics',
            $publicationDate: 'June 1, 2003',
            $genre: 'Dystopian Fiction',
            $synopsis: '1984 is a dystopian novel set in a totalitarian society ruled by the Party and its leader, Big Brother. The story follows Winston Smith, a low-ranking member of the Party who becomes disillusioned with its oppressive regime and begins to rebel against it. As he navigates life under constant surveillance and censorship, Winston grapples with questions of truth, freedom, and individuality.'
        }
    }
    */
    const book = {
        title: req.body.title,
        authorLastName: req.body.authorLastName,
        authorFirstName: req.body.authorFirstName,
        isbn: req.body.isbn,
        publisher: req.body.publisher,
        publicationDate: req.body.publicationDate,
        genre: req.body.genre,
        synopsis: req.body.synopsis,
    };
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('book')
        .insertOne(book);
    if (result.acknowledged) {
        res.status(201).json({ created: result.insertedId });
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while inserting the book.'
        );
    }
};

const updateBook = async (req, res) => {
    //#swagger.tags=['books']

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update one book document',
        schema: {
            $title: 'Animal Farm and 1984 ',
            $authorLastName: 'Orwell',
            $authorFirstName: 'George',
            $isbn: '978-0151010264',
            $publisher: 'Mariner Books Classics',
            $publicationDate: 'June 1, 2003',
            $genre: 'Dystopian Fiction',
            $synopsis: '1984 is a dystopian novel set in a totalitarian society ruled by the Party and its leader, Big Brother. The story follows Winston Smith, a low-ranking member of the Party who becomes disillusioned with its oppressive regime and begins to rebel against it. As he navigates life under constant surveillance and censorship, Winston grapples with questions of truth, freedom, and individuality.'
        }
    }
    */
    const bookId = new ObjectId(req.params.id);
    const book = {
        title: req.body.title,
        authorLastName: req.body.authorLastName,
        authorFirstName: req.body.authorFirstName,
        isbn: req.body.isbn,
        publisher: req.body.publisher,
        publicationDate: req.body.publicationDate,
        genre: req.body.genre,
        synopsis: req.body.synopsis,
    };
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('book')
        .replaceOne({ _id: bookId }, book);
    if (response.modifiedCount > 0) {
        res.status(200).json({ updated: `${req.params.id}` });
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while updating the book.'
        );
    }
};

const deleteBook = async (req, res) => {
    //#swagger.tags=['books']
    //#swagger.description = 'Delete one book document'
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('book')
        .deleteOne({ _id: bookId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while deleting the book.'
        );
    }
};

module.exports = { getAll, getSingle, createBook, updateBook, deleteBook };
