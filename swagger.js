require('dotenv').config();
const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'BookVerse API',
        description: 'BookVerse API',
    },
    //host: `localhost:3000`,
    host: 'https://bookverse-xetd.onrender.com',
    //schemes: ['https', 'http'],
    schemes: ['https'],
};

const outputFile = './swagger.json';
const endPointsFiles = ['./routes/index.js'];

//this will generate the swagger.json
swaggerAutogen(outputFile, endPointsFiles, doc);
