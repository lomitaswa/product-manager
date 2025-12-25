import { jest } from '@jest/globals';

// Mock the pool before importing the repository
jest.unstable_mockModule('../../config/db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

const { pool } = await import('../../config/db.js');
const userRepository = await import('../../repositories/user.repository.js');

describe('User Repository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findByEmail', () => {
        it('should return a user when found', async () => {
            const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

            const result = await userRepository.findByEmail('test@example.com');

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM users WHERE email='),
                ['test@example.com']
            );
            expect(result).toEqual(mockUser);
        });

        it('should return undefined when user is not found', async () => {
            (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await userRepository.findByEmail('notfound@example.com');

            expect(result).toBeUndefined();
        });
    });

    describe('create', () => {
        it('should create and return a new user', async () => {
            const mockUser = { id: 1, name: 'New User', email: 'new@example.com' };
            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

            const result = await userRepository.create('New User', 'new@example.com', 'hashedpassword');

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO users'),
                ['New User', 'new@example.com', 'hashedpassword']
            );
            expect(result).toEqual(mockUser);
        });
    });

    describe('findById', () => {
        it('should return a user by id', async () => {
            const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

            const result = await userRepository.findById('1');

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT name, id, email from users where id ='),
                ['1']
            );
            expect(result).toEqual(mockUser);
        });
    });
});
