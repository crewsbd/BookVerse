require('dotenv').config();
const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'BookVerse API',
        description: 'BookVerse API',
    },
    // DON'T CHANGE THIS
    host: `${process.env.HOST}${process.env.DEV === 'true' ? ':' + process.env.PORT : ''}`,
    //host: 'bookverse-bzgy.onrender.com/',
    //schemes: ['https', 'http'],
    schemes: [process.env.DEV === 'true' ? 'http' : 'https'],
};

const outputFile = './swagger.json';
const endPointsFiles = ['./routes/index.js'];

//this will generate the swagger.json
swaggerAutogen(outputFile, endPointsFiles, doc);