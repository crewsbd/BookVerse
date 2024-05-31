const { getAll, getSingle, createUser, updateUser, deleteUser } = require('../../controllers/users');
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
                insertOne: jest.fn()
            })
        })
    })
}));

describe('Users controller', () => {
    let mockDb;

    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = database.getDatabase().db().collection('user');
    });

    describe('getAll', () => {
        it('Should return the list of users', async () => {
            const req = {}; // Mock request object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                setHeader: jest.fn()
            }; // Mock response object

            const users = [
                {
                    "_id": "6652296d46a631a87cf0592f",
                    "oauthID": 555555555,
                    "name": "John Doe",
                    "profileUrl": "https://github.com/JohnDoe",
                    "authProvider": "github",
                    "__v": 0
                },
                {
                    "_id": "8652195d67a731z57eb0592f",
                    "oauthID": 99999999,
                    "name": "John Deer",
                    "profileUrl": "https://github.com/JohnDeer",
                    "authProvider": "github",
                    "__v": 0
                }
            ];

            mockDb.find().toArray.mockResolvedValue(users);

            await getAll(req, res); // Call the getAll function with mock req and res

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls[0]); // Log the calls to res.json

            expect(res.status).toHaveBeenCalledWith(200); // Check that res.status was called with 200
            expect(res.json).toHaveBeenCalledWith(users); // Check that res.json was called with the correct users array
        });
    });

    describe('getSingle', () => {
        it('Should return a single user based off of ID', async () => {
            const req = { params: { id: '6652296d46a631a87cf0592f' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                setHeader: jest.fn()
            };

            const user = {
                "_id": "6652296d46a631a87cf0592f",
                "oauthID": 555555555,
                "name": "John Doe",
                "profileUrl": "https://github.com/JohnDoe",
                "authProvider": "github",
                "__v": 0
            };

            mockDb.findOne.mockResolvedValue(user);

            await getSingle(req, res);

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls); // Log the calls to res.json

            expect(res.status).toHaveBeenLastCalledWith(200);
            expect(res.json).toHaveBeenLastCalledWith(user);
        });

        it('should return 404 if user not found', async () => {
            const req = {
                params: { id: '6652296d46a631a87cf0592f' } // Valid ObjectId format but not in database
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
            expect(res.json).toHaveBeenCalledWith({ message: `User ${req.params.id} not found` });
        });
    });

    describe('createUser', () => {
        it('Should put a user in the database', async () => {
            const req = {}; // Mock request object
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                setHeader: jest.fn()
            }; // Mock response object

            const user = [
                {
                    "_id": "6652296d46a631a87cf0592f",
                    "oauthID": 555555555,
                    "name": "John Doe",
                    "profileUrl": "https://github.com/JohnDoe",
                    "authProvider": "github",
                    "__v": 0
                },
                {
                    "_id": "8652195d67a731z57eb0592f",
                    "oauthID": 99999999,
                    "name": "John Deer",
                    "profileUrl": "https://github.com/JohnDeer",
                    "authProvider": "github",
                    "__v": 0
                }
            ];

            mockDb.insertOne().mockResolvedValue(users);

            await createUser(req, res); // Call the getAll function with mock req and res

            console.log(res.status.mock.calls); // Log the calls to res.status
            console.log(res.json.mock.calls[0]); // Log the calls to res.json

            expect(res.status).toHaveBeenCalledWith(200); // Check that res.status was called with 200
            expect(res.json).toHaveBeenCalledWith(users); // Check that res.json was called with the correct users array
        });
    });

});
