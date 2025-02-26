const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

jest.mock('../controllers/userController');
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('POST /users/create_user should create a new user', async () => {
        userController.createUser.mockImplementation((req, res) => {
            res.status(201).json({ message: 'User registered successfully' });
        });

        const response = await request(app)
            .post('/users/create_user')
            .send({ email: 'test@example.com', username: 'testuser', password: 'password' });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    test('POST /users/login should log in a user', async () => {
        userController.loginUser.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Login successful', token: 'mockedToken' });
        });

        const response = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('mockedToken');
    });

    test('GET /users/show_user should return a list of users', async () => {
        userController.getUsers.mockImplementation((req, res) => {
            res.status(200).json([{ id: 1, email: 'test@example.com' }]);
        });

        const response = await request(app).get('/users/show_user');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, email: 'test@example.com' }]);
    });

    test('PUT /users/:id should update a user', async () => {
        userController.updateUser.mockImplementation((req, res) => {
            res.status(200).json({ message: 'User updated successfully' });
        });

        const response = await request(app)
            .put('/users/1')
            .send({ username: 'UpdatedUser' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
    });

    test('DELETE /users/:id should delete a user', async () => {
        userController.deleteUser.mockImplementation((req, res) => {
            res.status(200).json({ message: 'User deleted' });
        });

        const response = await request(app).delete('/users/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted');
    });

    test('POST /users/forgot-password should reset password', async () => {
        userController.forgotPassword.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Password updated successfully' });
        });

        const response = await request(app)
            .post('/users/forgot-password')
            .send({ email: 'test@example.com', newPassword: 'newpassword', confirmPassword: 'newpassword' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password updated successfully');
    });

    test('GET /users/me should return current user details', async () => {
        userController.getCurrentUser.mockImplementation((req, res) => {
            res.status(200).json({ id: 1, email: 'test@example.com' });
        });

        const response = await request(app).get('/users/me');

        expect(response.status).toBe(200);
        expect(response.body.email).toBe('test@example.com');
    });
});
