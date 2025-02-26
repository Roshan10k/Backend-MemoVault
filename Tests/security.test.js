const request = require('supertest');
const app = require('../app'); // Import the app from app.js
const User = require('../Model/userModel');
const bcrypt = require('bcryptjs');

// Mock Sequelize methods
jest.mock('../Model/userModel', () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
}));

describe('User Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user', async () => {
        User.create.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            username: 'testuser',
            password: 'hashedpassword',
        });

        const res = await request(app).post('/api/users/create_user').send({
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should login a user with correct credentials', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        User.findOne.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            password: hashedPassword,
            toJSON: () => ({ id: 1, email: 'test@example.com' }),
        });

        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login a user with incorrect credentials', async () => {
        User.findOne.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
        });

        const res = await request(app).post('/api/users/login').send({
            email: 'test@example.com',
            password: 'wrongpassword',
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should prevent SQL Injection', async () => {
        const res = await request(app).post('/api/users/login').send({
            email: "' OR 1=1 --",
            password: "hacked",
        });

        expect(res.status).toBe(400); // Assuming your app handles input validation
    });

    it('should prevent XSS attacks', async () => {
        const res = await request(app).post('/api/users/create_user').send({
            email: "<script>alert('XSS')</script>",
            username: "xss_test",
            password: "password123",
        });

        expect(res.status).toBe(400); // Assuming your app validates input properly
    });

    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/api/unknown');
        expect(res.status).toBe(404);
    });
});
