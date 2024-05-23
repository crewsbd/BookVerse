const { MongoClient, ObjectId } = require('mongodb'); 

async function insertSampleUser(req, res) { 
    await client.connect(); 
    const usersDb = client.db('users'); 
    const usersCollection = usersDb.collection('users'); 
    const sampleUser = { 
        _id: new ObjectId(), 
        username: 'johndoe', 
        email: 'johndoe@example.com', 
        bookCollection: [] // Initialize with an empty array 
    }; 
    await usersCollection.insertOne(sampleUser); 
    res.status(201).send('Sample user inserted'); 
    await client.close(); 
} 

async function addBookToUserCollection(req, res) { 
    const userId = req.params.userId; 
    const bookId = req.body.bookId; 

    await client.connect(); 
    const usersDb = client.db('users'); 
    const usersCollection = usersDb.collection('users'); 

    await usersCollection.updateOne( 
        { _id: new ObjectId(userId) }, 
        { $addToSet: { bookCollection: new ObjectId(bookId) } } // Prevent duplicates with $addToSet 
    ); 

    res.status(200).send('Book added to user collection'); 
    await client.close(); 
} 

 

async function getUserBookCollection(req, res) { 
    const userId = req.params.userId; 

    await client.connect(); 
    const usersDb = client.db('users'); 
    const usersCollection = usersDb.collection('users'); 
    const booksDb = client.db('books'); 
    const booksCollection = booksDb.collection('books'); 

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) }); 

    if (!user) { 
        res.status(404).send('User not found'); 
        await client.close(); 
        return; 
    } 

    const userBooks = await booksCollection.find({ _id: { $in: user.bookCollection } }).toArray(); 

    res.status(200).json(userBooks); 
    await client.close(); 
} 

 

module.exports = { insertSampleUser, addBookToUserCollection, getUserBookCollection }; 