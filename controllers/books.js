const mongodb = require('../database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['books']
    const result = await mongodb.getDatabase().db().collection('books').find();
    result.toArray().then((books) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(books);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['books']
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('book').find({ _id: bookId });
    result.toArray().then((book) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(book[0]);
    });
};

const createBook = async (req, res) => {
    //#swagger.tags=['books']
    const book = {
        title: req.body.title,
        authorLastName: req.body.authorLastName,
        authorFirstName: req.body.authorFirstName,
        isbn: req.body.isbn,
        publisher: req.body.publisher,
        publicationDate: req.body.publicationDate,
        genre: req.body.genre,
        synopsis: req.body.synopsis
    };
    const result = await mongodb.getDatabase().db().collection('books').insertOne(book);
    if (result.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while inserting the book.');
    }
};

const updateBook = async (req, res) => {
    //#swagger.tags=['books']
    const bookId = new ObjectId(req.params.id);
    // ! Change these dependant on how reveiws are formatted in the database.
    const book = {
        title: req.body.title,
        authorLastName: req.body.authorLastName,
        authorFirstName: req.body.authorFirstName,
        isbn: req.body.isbn,
        publisher: req.body.publisher,
        publicationDate: req.body.publicationDate,
        genre: req.body.genre,
        synopsis: req.body.synopsis
    };
    const response = await mongodb.getDatabase().db().collection('books').replaceOne({ _id: bookId }, book);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the book.');
    }
};

const deleteBook = async (req, res) => {
    //#swagger.tags=['Reveiws']
    const bookId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('books').deleteOne({ _id: bookId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the book.');
    }
};

module.exports = { getAll, getSingle, createBook, updateBook, deleteBook }