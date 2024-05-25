const { Schema, model } = require('mongoose');
const validators = require('mongoose-validators');

const userSchema = new Schema({
    oauthID: {
        type: Number,
        required: true,
        unique: true,
        index: true,
        immutable: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        index: true,
        immutable: true,
        validate: validators.isEmail(),
    },
    password: {
        type: String,
        required: false,
        unique: false,
        min: 10,
        max: 20,
    },
    profileUrl: {
        type: String,
        required: false,
        unique: true,
        validate: validators.isURL(),
    },
    authProvider: String,
});

const Users = model('User', userSchema, 'user');

module.exports = Users;
