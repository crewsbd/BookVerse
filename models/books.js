const { Schema, model } = require('mongoose');
const validators = require('mongoose-validators');

const BookSchema = new Schema({
    oauthID: {
        type: Number,
        required: true,
        unique: true,
        index: true,
        immutable: true,
    },
    title: {
        type: String,
        required: true,
        max: 50,
    },
    authorLastName: {
        type: String,
        required: true,
        min: 3,
        unique: false,
    },
    authorFirstName: {
        type: String, 
        required: true, 
        unique: false,
        min: 3,
    },
    isbn: {
        type: Number,
        required: true, 
        unique: true,
        min: 13,
        max: 13,
    },
    publisher: {
        type: String, 
        required: true, 
        unique: false,
        min: 3,
    },
    publicationDate: {
        type: Date,
        required: true,
        unique: false,
        validate: validators.isDate(),
    },
    genre: {
        type: String,
        required: true,
        unique: false,
        min: 3,
    },
    synopsis: {
        type: String, 
        required: true,
        unique: false,
        min: 5,
        max: 255,
    },
    authProvider: String
});

const Books = model('Book', BookSchema, 'books');

module.exports = Books;