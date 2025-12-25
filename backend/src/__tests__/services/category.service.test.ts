import { jest } from '@jest/globals';

// Mock dependency
jest.unstable_mockModule('../../repositories/category.repository.js', () => ({
    findById: jest.fn(),
    update: jest.fn(),
    deleteById: jest.fn(),
    create: jest.fn(),
}));

const categoryRepository = await import('../../repositories/category.repository.js');
const categoryService = await import('../../services/category.service.js');

describe('Category Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should return a category when found', async () => {
            const mockCategory = { id: 1, name: 'Electronics' };
            (categoryRepository.findById as jest.Mock).mockResolvedValue(mockCategory);

            const result = await categoryService.get('1');

            expect(result).toEqual({ category: mockCategory });
        });
    });

    describe('create', () => {
        it('should create a new category', async () => {
            const mockCategory = { id: 1, name: 'Books' };
            (categoryRepository.create as jest.Mock).mockResolvedValue(mockCategory);

            const result = await categoryService.create({ name: 'Books' });

            expect(result).toEqual({ category: mockCategory });
        });
    });

    describe('update', () => {
        it('should update and return the category', async () => {
            const mockCategory = { id: 1, name: 'Updated' };
            (categoryRepository.update as jest.Mock).mockResolvedValue(mockCategory);

            const result = await categoryService.update('1', 'Updated');

            expect(result).toEqual({ category: mockCategory });
        });
    });

    describe('deleteById', () => {
        it('should return success true if category was deleted', async () => {
            (categoryRepository.deleteById as jest.Mock).mockResolvedValue(1);

            const result = await categoryService.deleteById('1');

            expect(result).toEqual({ success: true });
        });

        it('should return success false if category was not deleted', async () => {
            (categoryRepository.deleteById as jest.Mock).mockResolvedValue(0);

            const result = await categoryService.deleteById('99');

            expect(result).toEqual({ success: false });
        });
    });
});
