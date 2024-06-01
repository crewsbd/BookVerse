const { getAll, getSingle, createReview, updateReview, deleteReview } = require('../../controllers/reviews');
const database = require('../../database');

// Mock the database initialization
jest.mock('../../database', () => ({
    getDatabase: jest.fn().mockReturnValue({
        db: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue({
                find: jest.fn().mockReturnValue({
                    toArray: jest.fn()
                }),
                findOne: jest.fn(),
                insertOne: jest.fn(),
                replaceOne: jest.fn(),
                deleteOne: jest.fn()
            })
        })
    })
}));

describe('reviews controller', () => {
    let mockDb;

    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = database.getDatabase().db().collection('reviews');
    });

    describe('getAll', () => {
        it('Should return the list of reviews', async () => {
            const req = {}; // Mock request object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                setHeader: jest.fn()
            }; // Mock response object

            const reviews = [
                {
                    "_id": "6652396d46a631a97cf0492f",
                    "userName": "John Doe",
                    "reviewText": "Lorem ipsum dolor sit amet.",
                    "reviewScore": "5/5",
                },
                {
                    "_id": "6452396d46a621a97cf0462f",
                    "userName": "John Doe",
                    "reviewText": "Lorem ipsum dolor sit amet.",
                    "reviewScore": "5/5",
                }
            ];

            mockDb.find().toArray.mockResolvedValue(reviews);

            await getAll(req, res); // Call the getAll function with mock req and res

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls[0]); // Log the calls to res.json

            expect(res.status).toHaveBeenCalledWith(200); // Check that res.status was called with 200
            expect(res.json).toHaveBeenCalledWith(reviews); // Check that res.json was called with the correct reviews array
        });
    });

    describe('getSingle', () => {
        it('Should return a single review based off of ID', async () => {
            const req = { params: { id: '6652396d46a631a97cf0492f' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                setHeader: jest.fn()
            };

            const review = {
                "_id": "6652396d46a631a97cf0492f",
                "userName": "John Doe",
                "reviewText": "Lorem ipsum dolor sit amet.",
                "reviewScore": "5/5",
            };

            mockDb.findOne.mockResolvedValue(review);

            await getSingle(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls); // Log the calls to res.json

            expect(res.status).toHaveBeenLastCalledWith(200);
            expect(res.json).toHaveBeenLastCalledWith(review);
        });

        it('should return 404 if review not found', async () => {
            const req = {
                params: { id: '6652296d46d631c87cf0492f' } // Valid ObjectId format but not in database
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                setHeader: jest.fn()
            };

            mockDb.findOne.mockResolvedValue(null);

            await getSingle(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls); // Log the calls to res.json

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: `Review ${req.params.id} not found` });
        });
    });

    describe('createReview', () => {
        it('should create a new review and return 204 status', async () => {
            const req = {
                body: {
                    userName: 'Jane Doe',
                    reviewText: 'Lorem ipsum dolor sit amet.',
                    reviewScore: '5/5'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };

            const review = {
                "_id": "6652396d46a631a97cf0492f",
                "userName": "John Doe",
                "reviewText": "Lorem ipsum dolor sit amet.",
                "reviewScore": "5/5",
            };

            // Mock the insertOne method to return a successful response
            database.getDatabase().db().collection('review').insertOne.mockResolvedValue({
                acknowledged: true
            });

            await createReview(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 500 if review creation fails', async () => {
            const req = {
                body: {
                    userName: 'Jane Doe',
                    reviewText: 'Lorem ipsum dolor sit amet.',
                    reviewScore: '5/5'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };

            // Mock the insertOne method to return a failed response
            database.getDatabase().db().collection('review').insertOne.mockResolvedValue({
                acknowledged: false,
                error: 'Some error occurred while creating the review.'
            });

            await createReview(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls); // Log the calls to res.json

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith( 'Some error occurred while creating the review.' );
        });
    });

    describe('updateReview', () => {
        it('should update a review and return 204 status', async () => {
            const req = {
                params: { id: '6652296d46d631c87cf0492f' },
                body: {
                    userName: 'Jane Doe',
                    reviewText: 'Lorem ipsum dolor sit amet.',
                    reviewScore: '5/5'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };

            // Mock the insertOne method to return a successful response
            database.getDatabase().db().collection('review').replaceOne.mockResolvedValue({
                acknowledged: true,
                modifiedCount: 1
            });

            await updateReview(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 500 if review creation fails', async () => {
            const req = {
                params: { id: '6652296d46d631c87cf0492f' },
                body: {
                    userName: 'Jane Doe',
                    reviewText: 'Lorem ipsum dolor sit amet.',
                    reviewScore: '5/5'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };

            // Mock the insertOne method to return a failed response
            database.getDatabase().db().collection('review').replaceOne.mockResolvedValue({
                acknowledged: false,
                modifiedCount: 0,
                error: 'Some error occurred while updating the review.'
            });

            await updateReview(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls); // Log the calls to res.json

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith( 'Some error occurred while updating the review.' );
        });
    });

    describe('deleteReview', () => {
        it('should delete a review and return 204 status', async () => {
            const req = { params: { id: '6652296d46d631c87cf0492f' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };

            // Mock the insertOne method to return a successful response
            database.getDatabase().db().collection('review').deleteOne.mockResolvedValue({
                acknowledged: true,
                deletedCount: 1
            });

            await deleteReview(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 500 if review deletion fails', async () => {
            const req = { params: { id: '6652296d46d631c87cf0492f' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
                json: jest.fn()
            };

            // Mock the insertOne method to return a failed response
            database.getDatabase().db().collection('review').deleteOne.mockResolvedValue({
                acknowledged: false,
                deletedCount: 0,
                error: 'Some error occurred while updating the review.'
            });

            await deleteReview(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls); // Log the calls to res.json

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith( 'Some error occurred while updating the review.' );
        });
    });

});
