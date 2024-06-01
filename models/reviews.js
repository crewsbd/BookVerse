const { Schema, model } = require('mongoose');
const validators = require('mongoose-validators');

const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'book',
        required: true,
    },
    comment: {
        type: String,
    },
    rating: {
        type: Number,
    },
});

const Reviews = model('Review', BookSchema, 'reviews');

module.exports = Books;
