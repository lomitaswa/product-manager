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
jest.unstable_mockModule('../../repositories/product.repository.js', () => ({
    findAll: jest.fn(),
}));
jest.unstable_mockModule('json2csv', () => ({
    Parser: jest.fn().mockImplementation(() => ({
        parse: jest.fn().mockReturnValue('mock,csv,data'),
    })),
}));

const amqpMock = await import('amqplib');
const productRepository = await import('../../repositories/product.repository.js');

describe('Report Worker', () => {
    let mockChannel: any;

    beforeEach(() => {
        mockChannel = {
            assertQueue: jest.fn(),
            consume: jest.fn(),
            ack: jest.fn(),
        };
        const mockConnection = {
            createChannel: jest.fn().mockResolvedValue(mockChannel),
        };
        (amqpMock.default.connect as jest.Mock).mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should start worker and assert queue', async () => {
        // Import will trigger startWorker if it's self-executing
        await import('../../workers/report.worker.js');

        expect(amqpMock.default.connect).toHaveBeenCalled();
        expect(mockChannel.assertQueue).toHaveBeenCalledWith('report_queue', { durable: true });
    });
});
