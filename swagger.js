const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'BookVerse API',
        description: 'BookVerse API',
    },
    host: 'https://bookverse-bzgy.onrender.com/',
    schemes: ['https', 'http'],
};

const outputFile = './swagger.json';
const endPointsFiles = ['./routes/index.js'];

//this will generate the swagger.json
swaggerAutogen(outputFile, endPointsFiles, doc);
