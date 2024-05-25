// Configurations
require('dotenv').config();

// Middleware import
const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);

const mongoose = require('./database/mongoose');
const database = require('./database/index');
const authentication = require('./authentication');
const router = require('./routes');

// Error handling
process.on('uncaughtException', (error, origin) => {
    console.log(`${process.stderr.fd}`);
});
process.on('unhandledRejection', (error, origin) => {
    console.log(`Handled rejection: ${error}`);
    console.dir(error);
});

// Session store
console.log('Initializing session store');
const sessionStore = new SessionStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions',
});

// Session store error handling
sessionStore.on('error', () => {
    console.error('Session store error', error);
});

// Middleware implemented
app.use(cors({ methods: 'GET,POST,PUT,PATCH,DELETE' }));
app.use(bodyParser.json());
console.log('Setting up session');
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
    })
);

console.log('Setting up authentication');
app.use(authentication.initializer);
app.use(authentication.session);

// Stub route until routes added
app.use('/', router);
console.log('Setting up root route');
app.get('/', (request, response, next) => {
    console.log('ENDPOINT GET /');
    response.status(200).json({ message: 'Stub. Replace this with a router.' });
});

// Start API
// app.listen(process.env.PORT, () => {
//     console.log(`API server listening on localhost:${process.env.PORT}`);
// });


  // Initialize the database
  database.initDatabase((error) => {
    if (error) {
      console.log(`DB init error`);
      console.log(error);
    } else {
      // Start the server
      app.listen(process.env.PORT, () => {
        console.log(`Server listening on localhost:${process.env.PORT}`);
      });
    }
  });