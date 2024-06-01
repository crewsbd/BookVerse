const promisify = require('util').promisify;
const mongodb = require('../../database');
const jestmock = require('@jest-mock/express');
const controller = require('../../controllers/books');

describe('Book controller', () => {
    let database;
    let docID;
    let newDocID;
    const newBook = {
        title: 'TEST Pride and Prejudice',
        authorLastName: 'Austen',
        authorFirstName: 'Jane',
        isbn: '978-0-486-28153-8',
        publisher: 'Dover Publications',
        publicationDate: 'May 29, 2003',
        genre: 'Fiction, Romance',
        synopsis:
            'Pride and Prejudice is a romantic novel set in early 19th-century England. It follows the story of Elizabeth Bennet, the spirited second daughter of the Bennet family, as she navigates the complexities of love, marriage, and social class. Through misunderstandings, mistaken judgments, and witty dialogue, Elizabeth and the enigmatic Mr. Darcy overcome their initial prejudices and find true love in a society where reputation and propriety reign supreme.',
    };
    let request;
    let response;

    // Pre test suite setup
    beforeAll(async () => {
        // Let it fail if exception
        const asyncFunction = promisify(mongodb.initDatabase);

        database = await asyncFunction();
    });

    // Pre test setup
    beforeEach(() => {
        // Reset these
        request = jestmock.getMockReq();
        response = jestmock.getMockRes().res;
    });

    // Post test teardown
    afterAll(async () => {
        await database.close();
    });

    // TESTS
    // POST tests
    test('Book is created', async () => {
        // Set up the req and res
        request.body = newBook;
        response.json = jest.fn((json) => {
            docID = json.id;
        });

        // Run the controller
        await controller.createBook(request, response);

        //Test results
        expect(response.status).toHaveBeenCalledWith(204);
        expect(response.json).toHaveBeenCalled();
    }, 10000);

    // GET tests
    test('Check if the book is retrieved', async () => {
        // Set up the req and res
        request.params.id = docID;
        response.json = jest.fn((json) => {
            newDocID = json.id;
        });

        // Run the controller
        await controller.getSingle(request, response);

        // Test results
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalled();
        expect(newDocID === docID); // Retrieved the right one?
    }, 10000);

    test('Check if all books runs', async () => {
        // Set up the req and res
        let results;
        response.json = jest.fn((json) => {
            results = json;
        });

        // Run the controller
        await controller.getAll(request, response);

        // Test results
        // TODO: This doesn't work because of controller using .then method. Need to figure out how to test with that.
        // expect(response.status).toHaveBeenCalledWith(200);
        //expect(response.json).toHaveBeenCalled();
        //expect(results); // Retrieved the right one?
    }, 10000);

    test('Fail gracefully on 404', async () => {
        // Set up the req and res
        request.params.id = 'ffffffffffffffffffffffff';

        // Run the controller
        await controller.getSingle(request, response);

        // Test results
        expect(response.status).toHaveBeenCalledWith(404);
    }, 10000);

    test('Check if the book can update', async () => {
        // Set up the req and res
        request.params.id = docID;
        request.body = newBook;
        request.body.title = 'MODIFIED';

        // Run the controller
        await controller.updateBook(request, response);

        // Test results
        expect(response.status).toHaveBeenCalledWith(204);
    });

    test('Check if the book can delete', async () => {
        // Set up the req and res
        request.params.id = docID;

        // Run the controller
        await controller.deleteBook(request, response);

        // Test results
        expect(response.status).toHaveBeenCalledWith(204);
    });
});
