import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the service
jest.unstable_mockModule('../../services/auth.service.js', () => ({
    loginUser: jest.fn(),
    registerUser: jest.fn(),
    get: jest.fn(),
}));

const authService = await import('../../services/auth.service.js');
const authRoutes = await import('../../routes/auth.routes.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes.default);

describe('Auth Controller Integration', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 and token on success', async () => {
            (authService.loginUser as any).mockResolvedValue({ 
                token: 'test-token',
                user: { id: 1, email: 'test@example.com', name: 'Test' }
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(res.status).toBe(200);
            expect(res.body.data.token).toBe('test-token');
        });

        it('should return 400 on validation error', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'invalid' }); // Missing password, invalid email

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/auth/register', () => {
        it('should return 201 on success', async () => {
            (authService.registerUser as any).mockResolvedValue({ user: { id: 1 } });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', email: 'test@example.com', password: 'Password123' });

            expect(res.status).toBe(200);
        });
    });
});
