const userController = require('../controllers/userController');
const User = require('../Model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../Model/userModel', () => ({
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
    genSalt: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('User Controller Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('loginUser', () => {
        it('should return a token when login is successful', async () => {
            const req = { body: { email: 'test@example.com', password: 'password' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword', toJSON: jest.fn(() => ({ id: 1, email: 'test@example.com' })) };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockedToken');

            await userController.loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ 
                message: "Login successful", 
                token: 'mockedToken', 
                user: { id: 1, email: 'test@example.com' } 
            });
        });

        it('should return 404 if user is not found', async () => {
            const req = { body: { email: 'notfound@example.com', password: 'password' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            User.findOne.mockResolvedValue(null);

            await userController.loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });

        it('should return 401 if password is incorrect', async () => {
            const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await userController.loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
        });
    });

    describe('forgotPassword', () => {
        it('should update the password if user exists and passwords match', async () => {
            const req = { body: { email: 'test@example.com', newPassword: 'newpass123', confirmPassword: 'newpass123' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockUser = { save: jest.fn() };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.genSalt.mockResolvedValue('somesalt');
            bcrypt.hash.mockResolvedValue('hashedpassword123');

            await userController.forgotPassword(req, res);

            expect(mockUser.password).toBe('hashedpassword123');
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Password updated successfully" });
        });

        it('should return 400 if passwords do not match', async () => {
            const req = { body: { email: 'test@example.com', newPassword: 'newpass123', confirmPassword: 'wrongpass' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            await userController.forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "New password and confirm password do not match" });
        });

        it('should return 404 if user is not found', async () => {
            const req = { body: { email: 'notfound@example.com', newPassword: 'newpass123', confirmPassword: 'newpass123' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            User.findOne.mockResolvedValue(null);

            await userController.forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });

    describe('getUsers', () => {
        it('should return a list of users', async () => {
            const req = {};
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockUsers = [{ id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' }];

            User.findAll.mockResolvedValue(mockUsers);

            await userController.getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });
    });

    describe('getCurrentUser', () => {
        it('should return current user details', async () => {
            const req = { user: { id: 1 } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const mockUser = { username: 'JohnDoe', email: 'john@example.com' };

            User.findByPk.mockResolvedValue(mockUser);

            await userController.getCurrentUser(req, res);

            expect(res.json).toHaveBeenCalledWith({ username: 'JohnDoe', email: 'john@example.com' });
        });

        it('should return 404 if user is not found', async () => {
            const req = { user: { id: 99 } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            User.findByPk.mockResolvedValue(null);

            await userController.getCurrentUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const req = { body: { email: 'new@example.com', username: 'NewUser', password: 'password' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const mockUser = { id: 1, email: 'new@example.com', username: 'NewUser' };

            User.create.mockResolvedValue(mockUser);

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully", user: mockUser });
        });
    });

    describe('updateUser', () => {
        it('should update user details', async () => {
            const req = { params: { id: 1 }, body: { username: 'UpdatedUser' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const mockUser = { update: jest.fn() };

            User.findByPk.mockResolvedValue(mockUser);

            await userController.updateUser(req, res);

            expect(mockUser.update).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const req = { params: { id: 1 } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
            const mockUser = { destroy: jest.fn() };

            User.findByPk.mockResolvedValue(mockUser);

            await userController.deleteUser(req, res);

            expect(mockUser.destroy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
        });
    });
});
