
const mongoose = require('mongoose');

function connect() {
    if (
        mongoose.connection.readyState === mongoose.ConnectionStates.connected
    ) {
        console.log('Mongoose already connected');
    } else {
        console.log(`Mongoose Connecting to MongoDB ${process.env.MONGODB_URI}`);
        mongoose
            .connect(process.env.MONGODB_URI)
            .then(() => console.log('Database connected. Status: ', mongoose.connection.readyState));
        
        console.log(`Mongodb connection status: ${mongoose.connection.readyState}`);
    }
}
connect();

module.exports = mongoose;
