const controller = require('../../controllers/books');
//const jest = require('jest');

test('Create a book in the database', async () => {
    jest.expect(await controller.createBook(require('express').request())).toBe(
        'Something'
    );
});
let result = await controller.createBook(null, null);