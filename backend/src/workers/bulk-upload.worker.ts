import amqp from 'amqplib';
import fs from 'fs';
import csv from 'csv-parser';
import ExcelJS from 'exceljs';
import path from 'path';
import { env } from '../config/env.js';
import * as jobRepository from '../repositories/job.repository.js';
import * as productRepository from '../repositories/product.repository.js';
import { CreateProductDto } from '../dtos/product.dto.js';

const QUEUE = 'bulk_upload_queue';
const BATCH_SIZE = 500;

async function startWorker() {
    try {
        const conn = await amqp.connect(env.rabbitmqUrl);
        const channel = await conn.createChannel();
        await channel.assertQueue(QUEUE, { durable: true });
        await channel.prefetch(1);

        console.log('Bulk upload worker running');

        channel.consume(QUEUE, async (msg) => {
            if (!msg) return;

            const { jobId, filePath, originalName } = JSON.parse(msg.content.toString());
            console.log(`[Job ${jobId}] Starting bulk upload for: ${filePath} (Original: ${originalName})`);

            try {
                await jobRepository.updateStatus(jobId, 'PROCESSING');

                if (!fs.existsSync(filePath)) {
                    throw new Error(`File not found: ${filePath}`);
                }

                const ext = path.extname(originalName || filePath).toLowerCase();
                let processedCount = 0;

                if (ext === '.csv') {
                    processedCount = await processCSV(filePath);
                } else if (ext === '.xlsx') {
                    processedCount = await processXLSX(filePath);
                } else {
                    throw new Error(`Unsupported file format: ${ext}`);
                }

                await jobRepository.updateStatus(jobId, 'COMPLETED', processedCount);
                console.log(`[Job ${jobId}] Completed. Processed ${processedCount} records.`);

                fs.unlinkSync(filePath);
            } catch (err: any) {
                console.error(`[Job ${jobId}] Failed:`, err);
                await jobRepository.updateStatus(jobId, 'FAILED', undefined, err.message);
            } finally {
                channel.ack(msg);
            }
        });
    } catch (err) {
        console.error('Worker failed to start:', err);
        process.exit(1);
    }
}

async function processCSV(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        let batch: CreateProductDto[] = [];
        let totalCount = 0;
        let activePromises: Promise<any>[] = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const product: CreateProductDto = {
                    name: row.name,
                    price: parseFloat(row.price),
                    category_id: row.category_id,
                    image_url: row.image_url || null
                };

                if (product.name && !isNaN(product.price) && product.category_id) {
                    batch.push(product);
                    totalCount++;

                    if (batch.length >= BATCH_SIZE) {
                        const currentBatch = [...batch];
                        batch = [];
                        activePromises.push(productRepository.bulkCreate(currentBatch));
                    }
                }
            })
            .on('end', async () => {
                try {
                    if (batch.length > 0) {
                        activePromises.push(productRepository.bulkCreate(batch));
                    }
                    await Promise.all(activePromises);
                    resolve(totalCount);
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', reject);
    });
}

async function processXLSX(filePath: string): Promise<number> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
        throw new Error('Worksheet not found in XLSX file');
    }

    let batch: CreateProductDto[] = [];
    let totalCount = 0;

    const rows: any[] = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const values = row.values as any[];

        const product: CreateProductDto = {
            name: values[1],
            price: parseFloat(values[2]),
            image_url: values[3] || null,
            category_id: values[4]
        };

        if (product.name && !isNaN(product.price) && product.category_id) {
            batch.push(product);
            totalCount++;

            if (batch.length >= BATCH_SIZE) {
                rows.push([...batch]);
                batch = [];
            }
        }
    });

    if (batch.length > 0) {
        rows.push(batch);
    }

    for (const b of rows) {
        await productRepository.bulkCreate(b);
    }

    return totalCount;
}

startWorker();
