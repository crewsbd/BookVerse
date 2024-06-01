const promisify = require('util').promisify;
const mongodb = require('../../database');
const jestmock = require('@jest-mock/express');
const controller = require('../../controllers/collections');

describe('Collections Controller', () => {
    let database;
    let docID;
    let newDocID;
    const newCollection = {
        name: 'Test Collection',
        description: 'A test collection of books',
    };
    let request;
    let response;

    // Pre test suite setup
    beforeAll(async () => {
        const asyncFunction = promisify(mongodb.initDatabase);
        database = await asyncFunction();
    });

    // Pre test setup
    beforeEach(() => {
        request = jestmock.getMockReq();
        response = jestmock.getMockRes().res;
    });

    // Post test teardown
    afterAll(async () => {
        await database.close();
    });

    // TESTS
    // POST tests
    test('Collection is created', async () => {
        request.body = newCollection;
        response.json = jest.fn((json) => {
            docID = json.id;
        });

        await controller.createCollection(request, response);

        expect(response.status).toHaveBeenCalledWith(204);
        expect(response.json).toHaveBeenCalled();
    }, 10000);

    // GET tests
    test('Check if the collection is retrieved', async () => {
        request.params.id = docID;
        response.json = jest.fn((json) => {
            newDocID = json.id;
        });

        await controller.getSingleCollection(request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalled();
        expect(newDocID === docID);
    }, 10000);

    test('Check if all collections run', async () => {
        let results;
        response.json = jest.fn((json) => {
            results = json;
        });

        await controller.getAllCollections(request, response);

        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalled();
        expect(results); // Retrieved all collections?
    }, 10000);

    test('Fail gracefully on 404', async () => {
        request.params.id = 'ffffffffffffffffffffffff';

        await controller.getSingleCollection(request, response);

        expect(response.status).toHaveBeenCalledWith(404);
    }, 10000);

    test('Check if the collection can update', async () => {
        request.params.id = docID;
        request.body = newCollection;
        request.body.name = 'MODIFIED';

        await controller.updateCollection(request, response);

        expect(response.status).toHaveBeenCalledWith(204);
    });

    test('Check if the collection can delete', async () => {
        request.params.id = docID;

        await controller.deleteCollection(request, response);

        expect(response.status).toHaveBeenCalledWith(204);
    });
});
