const { MongoClient, ObjectId } = require('mongodb'); 

async function insertSampleBook(req, res) { 
    await client.connect(); 
    const booksDb = client.db('books'); 
    const booksCollection = booksDb.collection('books'); 
    const sampleBook = { 
        "_id": new ObjectId(), 
        "title": "The Great Gatsby", 
        "authorLastName": "Fitzgerald", 
        "authorFirstName": "F. Scott", 
        "isbn": "978-0-743-25455-0", 
        "publisher": "Scribner", 
        "publicationDate": "April 10, 1925", 
        "genre": "Fiction, Classic", 
        "synopsis": "The Great Gatsby is a novel set in the Roaring Twenties..." 
    }; 
    await booksCollection.insertOne(sampleBook); 
    res.status(201).send('Sample book inserted'); 
    await client.close(); 

} 

module.exports = { insertSampleBook }; 