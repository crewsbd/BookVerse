const mongodb = require('../database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['users']
    const result = await mongodb.getDatabase().db().collection('user').find();
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['users']
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('user').find({ _id: userId });
    result.toArray().then((users) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0]);
    });
};

const createUser = async (req, res) => {
    //#swagger.tags=['users']
    // ! Change these dependant on how users are formatted in the database. 
    const user = {
        data1: req.body.data1,
        data2: req.body.data2
        
    };
    const response = await mongodb.getDatabase().db().collection('user').insertOne(user);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['users']
    const userID = new ObjectId(req.params.id);
    // ! Change these dependant on how users are formatted in the database.
    const user = {
        data1: req.body.data1,
        data2: req.body.data2
    };
    const response = await mongodb.getDatabase().db().collection('user').replaceOne({ _id: userID }, user);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['users']
    const userID = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('user').deleteOne({ _id: userID});
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
}
// testing