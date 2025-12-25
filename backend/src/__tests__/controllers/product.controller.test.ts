import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Mock the service
jest.unstable_mockModule('../../services/product.service.js', () => ({
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
}));

// Mock the token utility for authMiddleware
jest.unstable_mockModule('../../utils/token.js', () => ({
    validateToken: jest.fn().mockReturnValue({ id: 'user-id', name: 'Test User' }),
}));

const productService = await import('../../services/product.service.js');
const productRoutes = await import('../../routes/product.routes.js');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes.default);

const mockUUID = '550e8400-e29b-41d4-a716-446655440000';

describe('Product Controller Integration', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/products', () => {
        it('should return 200 and list of products', async () => {
            (productService.getAllProducts as any).mockResolvedValue({ products: [], total: 0 });

            const res = await request(app)
                .get('/api/products')
                .set('Authorization', 'Bearer mock-token');

            expect(res.status).toBe(200);
            expect(res.body.data.products).toEqual([]);
        });

        it('should return 400 on invalid query params', async () => {
            const res = await request(app)
                .get('/api/products?limit=abc')
                .set('Authorization', 'Bearer mock-token');
            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/products', () => {
        it('should return 201 on success', async () => {
            (productService.createProduct as any).mockResolvedValue({ id: 1, name: 'Test Product' });

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', 'Bearer mock-token')
                .send({ name: 'Test Product', price: 99.99, category_id: mockUUID });

            expect(res.status).toBe(201);
        });
    });
});
