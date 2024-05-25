const dotenv = require("dotenv");
dotenv.config();

const MongoClient = require("mongodb").MongoClient;

let database;

/**
 * Initialize the database
 * @param { function } callback 
 * @returns { import('mongodb').MongoClient}
 */
const initDatabase = (callback) => {
  console.log(`Initializing Mongo2`);
  if (database) {
    console.log("DB is already initialized!");
    return callback(null, database);
  }
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      database = client;
      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

/**
 * Get an already initialized database
 * @returns { import('mongodb').MongoClient}
 */
const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized')
    }
    return database;
}

module.exports = { initDatabase, getDatabase };
