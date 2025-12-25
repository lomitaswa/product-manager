import amqp, { Channel, ChannelModel } from 'amqplib';
import { env } from '../config/env.js';

let connection: ChannelModel;
let channel: Channel;

export const QUEUES = {
    BULK_UPLOAD: 'bulk_upload_queue',
    REPORT: 'report_queue'
};

export async function initRabbitMQ() {
    try {
        console.log('Connecting to RabbitMQ at:', env.rabbitmqUrl);
        connection = await amqp.connect(env.rabbitmqUrl);
        console.log('RabbitMQ connection established');

        channel = await connection.createChannel();
        console.log('RabbitMQ channel created');

        await channel.assertQueue(QUEUES.BULK_UPLOAD, { durable: true });
        await channel.assertQueue(QUEUES.REPORT, { durable: true });

        console.log('RabbitMQ queues asserted');
    } catch (err) {
        console.error('FAILED to initialize RabbitMQ:', err);
        throw err;
    }
}

export async function publish(queue: string, payload: any) {
    if (!channel) {
        console.error('PUBLISH FAILED: RabbitMQ channel is undefined');
        throw new Error('RabbitMQ channel not initialized. Call initRabbitMQ first.');
    }
    console.log(`Publishing to ${queue}:`, payload);
    const sent = channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
    );
    if (!sent) {
        console.warn('RabbitMQ sendToQueue returned false (buffer full?)');
    }
}
