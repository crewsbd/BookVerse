const mongodb = require('../database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['users']
    //#swagger.description = 'Get all user documents'

    const result = await mongodb.getDatabase().db().collection('user').find();
    result.toArray().then((users) => {
        if (users[0]) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(users);
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['users']
    //#swagger.description = 'Get one user document'
  
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDatabase()
        .db()
        .collection('user')
        .findOne({ _id: userId });

    if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: `User ${req.params.id} not found` });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=['users']

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user document',
        schema: {
            $oauthID: 12345678,
            $name: 'Jane Doe',
            $profileUrl: 'https://github.com/doej',
            $authProvider: 'github',
            $__v: 0
        }
    }
    */

    const user = {
        oauthID: req.body.oauthID,
        name: req.body.name,
        profileUrl: req.body.profileUrl,
        authProvider: req.body.authProvider,
        __v: req.body.__v,
    };

    try {
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('user')
            .insertOne(user);
        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500).json(
                response.error || 'Some error occurred while updating the user.'
            );
        }
    } catch (error) {
        console.dir(error);
        if (error.code && error.code === 11000) {
            res.status(500).json({ error: 'Duplicate key' });
        } else {
            res.status(500).json({ error: 'Unanticipated error' });
        }
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['users']

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update existing user document',
        schema: {
            $oauthID: 12345678,
            $name: 'Jane Doe',
            $profileUrl: 'https://github.com/doej',
            $authProvider: 'github',
            $__v: 0
        }
    }
    */

    const userID = new ObjectId('' + req.params.id);
    const user = {
        oauthID: req.body.oauthID,
        name: req.body.name,
        profileUrl: req.body.profileUrl,
        authProvider: req.body.authProvider,
        __v: req.body.__v,
    };

    try {
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('user')
            .replaceOne({ _id: userID }, user);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(
                response.error || 'Some error occurred while updating the user.'
            );
        }
    } catch (error) {
        console.dir(error);
        if (error.code && error.code === 11000) {
            res.status(500).json({ error: 'Duplicate key' });
        } else {
            res.status(500).json({ error: 'Unanticipated error' });
        }
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['users']
    //#swagger.description = 'Delete one user document'
 
    const userID = new ObjectId(req.params.id);
    const response = await mongodb
        .getDatabase()
        .db()
        .collection('user')
        .deleteOne({ _id: userID });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(
            response.error || 'Some error occurred while updating the user.'
        );
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser,
};
// testing
