import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.unstable_mockModule('../../repositories/user.repository.js', () => ({
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
}));

const userRepository = await import('../../repositories/user.repository.js');
const authService = await import('../../services/auth.service.js');

describe('Auth Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('loginUser', () => {
        it('should return a token for valid credentials', async () => {
            const mockUser = { id: 1, email: 'test@example.com', password_hash: 'hashed', name: 'Test' };
            (userRepository.findByEmail as any).mockResolvedValue(mockUser);

            jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
            jest.spyOn(jwt, 'sign').mockImplementation(() => 'mock-token');

            const result = await authService.loginUser({ email: 'test@example.com', password: 'password' });

            expect(result).toEqual({ 
                token: 'mock-token',
                user: { id: 1, email: 'test@example.com', name: 'Test' }
            });
        });

        it('should throw error if user not found', async () => {
            (userRepository.findByEmail as any).mockResolvedValue(null);

            await expect(authService.loginUser({ email: 'none@example.com', password: 'pw' }))
                .rejects.toThrow('User not found');
        });
    });

    describe('registerUser', () => {
        it('should register a new user', async () => {
            const mockUser = { id: 1, name: 'Test', email: 'test@example.com' };
            (userRepository.create as any).mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed');

            const result = await authService.registerUser({
                name: 'Test',
                email: 'test@example.com',
                password: 'password'
            });

            expect(result).toEqual({ user: mockUser });
        });
    });
});
