import { jest } from '@jest/globals';

jest.unstable_mockModule('../../config/db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

const { pool } = await import('../../config/db.js');
const categoryRepository = await import('../../repositories/category.repository.js');

describe('Category Repository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findById', () => {
        it('should return a category by id', async () => {
            const mockCategory = { id: 1, name: 'Electronics' };
            (pool.query as unknown as jest.Mock).mockResolvedValue({ rows: [mockCategory] });

            const result = await categoryRepository.findById('1');

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT id, name from categories where id ='),
                ['1']
            );
            expect(result).toEqual(mockCategory);
        });
    });

    describe('create', () => {
        it('should create and return a new category', async () => {
            const mockCategory = { id: 1, name: 'Electronics' };
            (pool.query as unknown as jest.Mock).mockResolvedValue({ rows: [mockCategory] });

            const result = await categoryRepository.create({ name: 'Electronics' });

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT into categories'),
                ['Electronics']
            );
            expect(result).toEqual(mockCategory);
        });
    });

    describe('update', () => {
        it('should update and return the category', async () => {
            const mockCategory = { id: 1, name: 'Updated Electronics' };
            (pool.query as unknown as jest.Mock).mockResolvedValue({ rows: [mockCategory] });

            const result = await categoryRepository.update('1', 'Updated Electronics');

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE categories SET name ='),
                ['Updated Electronics', '1']
            );
            expect(result).toEqual(mockCategory);
        });
    });

    describe('deleteById', () => {
        it('should delete a category and return row count', async () => {
            (pool.query as unknown as jest.Mock).mockResolvedValue({ rowCount: 1 });

            const result = await categoryRepository.deleteById('1');

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM categories WHERE id ='),
                ['1']
            );
            expect(result).toBe(1);
        });
    });
});
