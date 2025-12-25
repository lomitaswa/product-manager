import { jest } from '@jest/globals';

jest.unstable_mockModule('../../config/db.js', () => ({
    pool: {
        query: jest.fn(),
    },
}));

const { pool } = await import('../../config/db.js');
const jobRepository = await import('../../repositories/job.repository.js');

describe('Job Repository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createJob', () => {
        it('should create a new job and return id', async () => {
            const mockJob = { id: 1 };
            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockJob] });

            const result = await jobRepository.createJob('BULK_UPLOAD', 'PENDING', 'path/to/file');

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO async_jobs'),
                ['BULK_UPLOAD', 'PENDING', 'path/to/file']
            );
            expect(result).toEqual(mockJob);
        });
    });

    describe('updateStatus', () => {
        it('should update job status and details', async () => {
            (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

            await jobRepository.updateStatus(1, 'COMPLETED', 100, undefined, 'output/path');

            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('UPDATE async_jobs SET status=$1, processed_records=$2, result_file_path=$3 WHERE id=$4'),
                ['COMPLETED', 100, 'output/path', 1]
            );
        });
    });
});
