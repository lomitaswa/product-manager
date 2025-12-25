import { jest } from '@jest/globals';

jest.unstable_mockModule('../../config/db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

const { pool } = await import('../../config/db.js');
const productRepository = await import('../../repositories/product.repository.js');

describe('Product Repository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return products with pagination and filtering', async () => {
            const mockProducts = [{ id: 1, name: 'Product 1', price: 100 }];
            const mockCount = { count: '1' };

            (pool.query as jest.Mock)
                .mockResolvedValueOnce({ rows: mockProducts }) // First call: products
                .mockResolvedValueOnce({ rows: [mockCount] }); // Second call: count

            const result = await productRepository.findAll({
                category_id: 1,
                search: 'test',
                sortBy: 'price',
                sortOrder: 'asc',
                page: 1,
                limit: 10
            });

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(result.products).toEqual(mockProducts);
            expect(result.total).toBe(1);
        });
    });

    describe('create', () => {
        it('should create and return a new product', async () => {
            const mockProduct = { id: 1, name: 'Product 1', price: 100, category_id: 1 };
            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockProduct] });

            const result = await productRepository.create({
                name: 'Product 1',
                price: 100,
                category_id: 1
            });

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO products'),
                ['Product 1', undefined, 100, 1]
            );
            expect(result).toEqual(mockProduct);
        });
    });

    describe('update', () => {
        it('should update and return the product', async () => {
            const mockProduct = { id: 1, name: 'Updated Product' };
            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockProduct] });

            const result = await productRepository.update('1', { name: 'Updated Product' });

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE products SET name ='),
                ['Updated Product', '1']
            );
            expect(result).toEqual(mockProduct);
        });
    });
});
