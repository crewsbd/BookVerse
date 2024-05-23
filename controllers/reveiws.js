const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Reveiws']
    const result = await mongodb.getDatabase().db().collection('reveiws').find();
    result.toArray().then((reveiws) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reveiws);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Reveiws']
    const reveiwId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('reveiws').find({ _id: reveiwId });
    result.toArray().then((reveiws) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(reveiws[0]);
    });
};

const createReveiw = async (req, res) => {
    //#swagger.tags=['Reveiws']
    // ! Change these dependant on how reveiws are formatted in the database. 
    const reveiw = {
        data1: req.body.data1,
        data2: req.body.data2
        
    };
    const response = await mongodb.getDatabase().db().collection('reveiws').insertOne(reveiw);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

const updateReveiw = async (req, res) => {
    //#swagger.tags=['Reveiws']
    const reveiwID = new ObjectId(req.params.id);
    // ! Change these dependant on how reveiws are formatted in the database.
    const reveiw = {
        data1: req.body.data1,
        data2: req.body.data2
    };
    const response = await mongodb.getDatabase().db().collection('reveiws').replaceOne({ _id: reveiwID }, reveiws);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

const deleteReveiw = async (req, res) => {
    //#swagger.tags=['Reveiws']
    const reveiwID = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('reveiws').deleteOne({ _id: reveiwID});
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the user.');
    }
};

module.exports = {
    getAll,
    getSingle,
    createReveiw,
    updateReveiw,
    deleteReveiw
}

// testing