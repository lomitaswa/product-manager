import { pool } from '../src/config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const restore = async () => {
    try {
        console.log('Starting restore...');
        const backupPath = path.join(__dirname, '../seeds/backup_data.json');

        if (!fs.existsSync(backupPath)) {
            console.error('Backup file not found!');
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        const { categories, products } = data;

        const categoryMap = new Map<string, string>();

        console.log(`Restoring ${categories.length} categories...`);
        for (const cat of categories) {
            const newUuid = uuidv4();
            categoryMap.set(cat.id, newUuid);

            await pool.query(
                `INSERT INTO categories (id, name, created_at, updated_at) VALUES ($1, $2, $3, $4)`,
                [newUuid, cat.name, cat.created_at, cat.updated_at]
            );
        }

        console.log(`Restoring ${products.length} products...`);
        for (const prod of products) {
            const newUuid = uuidv4();
            const newCategoryId = categoryMap.get(prod.category_id);

            if (!newCategoryId) {
                console.warn(`Skipping product ${prod.name} (Old ID: ${prod.id}): Category ID ${prod.category_id} not found.`);
                continue;
            }

            await pool.query(
                `INSERT INTO products (id, name, image_url, price, category_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [newUuid, prod.name, prod.image_url, prod.price, newCategoryId, prod.created_at, prod.updated_at]
            );
        }

        console.log('Restore successful!');
        process.exit(0);
    } catch (error) {
        console.error('Restore failed:', error);
        process.exit(1);
    }
};

restore();
