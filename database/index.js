const mongoose = require('mongoose');

function connect() {
    if (
        mongoose.connection.readyState === mongoose.ConnectionStates.connected
    ) {
        console.log('Mongoose already connected');
    } else {
        console.log('Connecting to MongoDB');
        mongoose
            .connect(process.env.MONGODB_URI)
            .then(() => console.log('Database connected. Status: ', mongoose.connection.readyState));
        
        console.log(`Mongodb connection status: ${mongoose.connection.readyState}`);
    }
}
connect();

module.exports = mongoose;
