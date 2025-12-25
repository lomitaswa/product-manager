import { jest } from '@jest/globals';

// Mock dependency
jest.unstable_mockModule('../../repositories/product.repository.js', () => ({
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
}));

const productRepository = await import('../../repositories/product.repository.js');
const productService = await import('../../services/product.service.js');

describe('Product Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllProducts', () => {
        it('should return paginated products', async () => {
            const mockResult = { products: [] as any[], total: 0, page: 1, limit: 10 };
            (productRepository.findAll as any).mockResolvedValue(mockResult);

            const result = await productService.getAllProducts({});

            expect(result).toEqual(mockResult);
        });
    });

    describe('getProductById', () => {
        it('should return product when found', async () => {
            const mockProduct = { id: 1, name: 'Test' };
            (productRepository.findById as any).mockResolvedValue(mockProduct);

            const result = await productService.getProductById('1');

            expect(result).toEqual(mockProduct);
        });

        it('should throw error when not found', async () => {
            (productRepository.findById as any).mockResolvedValue(null);

            await expect(productService.getProductById('99')).rejects.toThrow('Product not found');
        });
    });
});
