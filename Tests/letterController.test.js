const Letter = require('../Model/lettertoselfModel');
const letterController = require('../controllers/lettertoselfController');
const authMiddleware = require('../middleware/authMiddleware');

jest.mock('../Model/lettertoselfModel', () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
}));

describe('Letter Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createLetter', () => {
        it('should create a new letter', async () => {
            const req = { user: { id: 1 }, body: { title: 'Test Title', date: '2023-10-01', content: 'Test content' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockLetter = { id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' };

            Letter.create.mockResolvedValue(mockLetter);

            await letterController.createLetter(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "Letter saved successfully", letter: mockLetter });
        });
    });

    describe('getLettersByUser', () => {
        it('should return all letters for a user', async () => {
            const req = { user: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockLetters = [{ id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' }];

            Letter.findAll.mockResolvedValue(mockLetters);

            await letterController.getLettersByUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockLetters);
        });
    });

    describe('getRecentLetters', () => {
        it('should return recent letters for a user', async () => {
            const req = { user: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockLetters = [{ id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' }];

            Letter.findAll.mockResolvedValue(mockLetters);

            await letterController.getRecentLetters(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockLetters);
        });
    });

    describe('getLetterById', () => {
        it('should return a letter by ID', async () => {
            const req = { params: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockLetter = { id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' };

            Letter.findByPk.mockResolvedValue(mockLetter);

            await letterController.getLetterById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockLetter);
        });

        it('should return 404 if letter is not found', async () => {
            const req = { params: { id: 99 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Letter.findByPk.mockResolvedValue(null);

            await letterController.getLetterById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Letter not found" });
        });
    });

    describe('updateLetter', () => {
        it('should update a letter', async () => {
            const req = { params: { id: 1 }, user: { id: 1 }, body: { title: 'Updated Title', date: '2023-10-02', content: 'Updated content' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockLetter = { id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content', update: jest.fn() };

            Letter.findByPk.mockResolvedValue(mockLetter);

            await letterController.updateLetter(req, res);

            expect(mockLetter.update).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Letter updated successfully", letter: mockLetter });
        });

        it('should return 403 if user is not authorized', async () => {
            const req = { params: { id: 1 }, user: { id: 2 }, body: { title: 'Updated Title', date: '2023-10-02', content: 'Updated content' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockLetter = { id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' };

            Letter.findByPk.mockResolvedValue(mockLetter);

            await letterController.updateLetter(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
        });
    });

    describe('deleteLetter', () => {
        it('should delete a letter', async () => {
            const req = { params: { id: 1 }, user: { id: 1 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockLetter = { id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content', destroy: jest.fn() };

            Letter.findByPk.mockResolvedValue(mockLetter);

            await letterController.deleteLetter(req, res);

            expect(mockLetter.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Letter deleted successfully" });
        });

        it('should return 403 if user is not authorized', async () => {
            const req = { params: { id: 1 }, user: { id: 2 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockLetter = { id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' };

            Letter.findByPk.mockResolvedValue(mockLetter);

            await letterController.deleteLetter(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
        });
    });
});