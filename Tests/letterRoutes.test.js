const request = require('supertest');
const express = require('express');
const letterRoutes = require('../routes/lettertoselfRoutes');
const letterController = require('../controllers/lettertoselfController');
const authMiddleware = require('../middleware/authMiddleware');

jest.mock('../controllers/lettertoselfController');
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/letters', letterRoutes);

describe('Letter Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('POST /letters/create should create a new letter', async () => {
        letterController.createLetter.mockImplementation((req, res) => {
            res.status(201).json({ message: 'Letter saved successfully' });
        });

        const response = await request(app)
            .post('/letters/create')
            .send({ title: 'Test Title', date: '2023-10-01', content: 'Test content' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Letter saved successfully');
    });

    test('GET /letters/me should return all letters for a user', async () => {
        letterController.getLettersByUser.mockImplementation((req, res) => {
            res.status(200).json([{ id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' }]);
        });

        const response = await request(app).get('/letters/me');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' }]);
    });

    test('GET /letters/recent should return recent letters for a user', async () => {
        letterController.getRecentLetters.mockImplementation((req, res) => {
            res.status(200).json([{ id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' }]);
        });

        const response = await request(app).get('/letters/recent');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' }]);
    });

    test('GET /letters/:id should return a letter by ID', async () => {
        letterController.getLetterById.mockImplementation((req, res) => {
            res.status(200).json({ id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' });
        });

        const response = await request(app).get('/letters/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: 1, userId: 1, title: 'Test Title', date: '2023-10-01', content: 'Test content' });
    });

    test('PUT /letters/:id should update a letter', async () => {
        letterController.updateLetter.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Letter updated successfully' });
        });

        const response = await request(app)
            .put('/letters/1')
            .send({ title: 'Updated Title', date: '2023-10-02', content: 'Updated content' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Letter updated successfully');
    });

    test('DELETE /letters/:id should delete a letter', async () => {
        letterController.deleteLetter.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Letter deleted successfully' });
        });
    
        const response = await request(app).delete('/letters/1');
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Letter deleted successfully');
    });

});