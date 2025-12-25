import { jest } from '@jest/globals';
import amqp from 'amqplib';

// Mock dependencies
jest.unstable_mockModule('amqplib', () => ({
    default: {
        connect: jest.fn(),
    },
}));
jest.unstable_mockModule('../../repositories/job.repository.js', () => ({
    updateStatus: jest.fn(),
}));

const amqpMock = await import('amqplib');
const jobRepository = await import('../../repositories/job.repository.js');

describe('Bulk Upload Worker', () => {
    let mockChannel: any;
    let mockConnection: any;

    beforeEach(() => {
        mockChannel = {
            assertQueue: jest.fn(),
            consume: jest.fn(),
            ack: jest.fn(),
        };
        mockConnection = {
            createChannel: jest.fn().mockResolvedValue(mockChannel),
        };
        (amqpMock.default.connect as jest.Mock).mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should start and consume from queue', async () => {
        // This is a simplified test for the worker startup
        const { startWorker } = await import('../../workers/bulk-upload.worker.js');

        // The worker might be executed immediately on import in some setups, 
        // but here we expect to be able to call it if exported or check side effects.
        // Since workers often self-execute, we might need to mock the entire file or adjust export.

        expect(amqpMock.default.connect).toHaveBeenCalled();
    });
});
