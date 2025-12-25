import amqp from 'amqplib';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import * as jobRepository from '../repositories/job.repository.js';
import * as productRepository from '../repositories/product.repository.js';
import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';
import { QUEUES } from '../services/rabbitmq.service.js';

async function startWorker() {
    console.log('Report worker starting up...');
    const conn = await amqp.connect(env.rabbitmqUrl);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUES.REPORT, { durable: true });

    if (!fs.existsSync('reports')) {
        fs.mkdirSync('reports');
    }

    channel.consume(QUEUES.REPORT, async (msg) => {
        if (!msg) return;

        const { jobId, format } = JSON.parse(msg.content.toString());
        console.log(`Processing report job: ${jobId} (${format})`);

        try {
            await jobRepository.updateStatus(jobId, 'PROCESSING');

            const { products } = await productRepository.findAll({ limit: 1000000 });

            const fileName = `report_${jobId}.${format}`;
            const filePath = path.join('reports', fileName);

            if (format === 'csv') {
                const parser = new Parser();
                const csv = parser.parse(products);
                fs.writeFileSync(filePath, csv);
            } else if (format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const sheet = workbook.addWorksheet('Products');
                sheet.columns = [
                    { header: 'ID', key: 'id' },
                    { header: 'UUID', key: 'uuid' },
                    { header: 'Name', key: 'name' },
                    { header: 'Price', key: 'price' },
                    { header: 'Category', key: 'category_name' },
                    { header: 'Created At', key: 'created_at' }
                ];
                products.forEach(p => sheet.addRow(p));
                await workbook.xlsx.writeFile(filePath);
            }

            console.log(`Report generated at: ${filePath}. Updating job status...`);
            await jobRepository.updateStatus(jobId, 'COMPLETED', products.length, undefined, filePath);
            console.log(`Job ${jobId} marked as COMPLETED.`);

            channel.ack(msg);
        } catch (err) {
            console.error(`ERROR in report worker for job ${jobId}:`, err);
            await jobRepository.updateStatus(jobId, 'FAILED', undefined, String(err));
            channel.ack(msg);
        }
    });

    console.log('Report generation worker running and waiting for messages...');
}

startWorker().catch(err => {
    console.error('CRITICAL: Report worker failed to start:', err);
});
