const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock the Users model
const userMock = dbMock.define('Users', {
    id: 1,
    username: 'John Doe',
    email: 'john@gmail.com',
    password: 'hashedpassword123', // Ideally, mock bcrypt hashing here
});

// Simulate validation error for missing required fields
userMock.create = jest.fn((data) => {
    if (!data.username || !data.email || !data.password) {
        return Promise.reject(new Error('Validation error: missing required fields'));
    }
    return Promise.resolve(data); // Simulate successful creation if validation passes
});

describe('User Model', () => {
    it('should create a user', async () => {
        const user = await userMock.create({
            username: 'John Doe',
            email: 'john@gmail.com',
            password: 'password',
        });

        expect(user.username).toBe('John Doe');
        expect(user.email).toBe('john@gmail.com');
        expect(user.password).toBe('password');
    });

    it('should require a username, email, and password', async () => {
        await expect(userMock.create({})).rejects.toThrow('Validation error: missing required fields');
    });
});
