import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the service
jest.unstable_mockModule('../../services/category.service.js', () => ({
    get: jest.fn(),
    create: jest.fn(),
    deleteById: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn(),
}));

// Mock the token utility for authMiddleware
jest.unstable_mockModule('../../utils/token.js', () => ({
    validateToken: jest.fn().mockReturnValue({ id: 'user-id', name: 'Test User' }),
}));

const categoryService = await import('../../services/category.service.js');
const categoryRoutes = await import('../../routes/category.routes.js');

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes.default);

const mockUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('Category Controller Integration', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/categories/:id', () => {
        it('should return 200 and category', async () => {
            (categoryService.get as jest.Mock).mockResolvedValue({ category: { id: mockUUID, name: 'Test' } });

            const res = await request(app)
                .get(`/api/categories/${mockUUID}`)
                .set('Authorization', 'Bearer mock-token');

            expect(res.status).toBe(200);
            expect(res.body.data.name).toBe('Test');
        });

        it('should return 400 on invalid UUID', async () => {
            const res = await request(app)
                .get('/api/categories/123')
                .set('Authorization', 'Bearer mock-token');

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/categories', () => {
        it('should return 201 on success', async () => {
            (categoryService.create as jest.Mock).mockResolvedValue({ category: { id: mockUUID, name: 'New' } });

            const res = await request(app)
                .post('/api/categories')
                .set('Authorization', 'Bearer mock-token')
                .send({ name: 'New' });

            expect(res.status).toBe(201);
        });
    });
});
