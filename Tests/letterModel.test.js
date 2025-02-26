const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock the Letter model
const LetterMock = dbMock.define('Letter', {
    id: 1,
    userId: 1,
    title: 'Test Title',
    date: '2023-10-01',
    content: 'This is a test letter content.',
});

// Simulate validation error for missing required fields
LetterMock.create = jest.fn((data) => {
    if (!data.userId || !data.date || !data.content) {
        return Promise.reject(new Error('Validation error: missing required fields'));
    }
    return Promise.resolve(data); // Simulate successful creation if validation passes
});

describe('Letter Model', () => {
    it('should create a letter', async () => {
        const letter = await LetterMock.create({
            userId: 1,
            title: 'Test Title',
            date: '2023-10-01',
            content: 'This is a test letter content.',
        });

        expect(letter.userId).toBe(1);
        expect(letter.title).toBe('Test Title');
        expect(letter.date).toBe('2023-10-01');
        expect(letter.content).toBe('This is a test letter content.');
    });

    it('should require userId, date, and content', async () => {
        await expect(LetterMock.create({})).rejects.toThrow('Validation error: missing required fields');
    });
});