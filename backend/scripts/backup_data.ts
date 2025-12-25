import { pool } from '../src/config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backup = async () => {
    try {
        console.log('Starting backup...');
        const categories = await pool.query('SELECT * FROM categories');
        const products = await pool.query('SELECT * FROM products');

        const data = {
            categories: categories.rows,
            products: products.rows
        };

        const backupPath = path.join(__dirname, '../seeds/backup_data.json');
        fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
        console.log(`Backup successful! Data saved to ${backupPath}`);
        process.exit(0);
    } catch (error) {
        console.error('Backup failed:', error);
        process.exit(1);
    }
};

backup();
