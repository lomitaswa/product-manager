import { pool } from '../src/config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reset = async () => {
    try {
        console.log('⚠ DESTRUCTIVE ACTION: Resetting Database...');

        console.log('Dropping tables...');
        await pool.query(`
            DROP TABLE IF EXISTS async_jobs CASCADE;
            DROP TABLE IF EXISTS product_upload_errors CASCADE;
            DROP TABLE IF EXISTS products CASCADE;
            DROP TABLE IF EXISTS categories CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
        `);
        console.log('✔ Tables dropped.');

        const migrationsDir = path.join(__dirname, '../migrations');
        const files = fs.readdirSync(migrationsDir).sort();

        for (const file of files) {
            if (file.endsWith('.sql')) {
                console.log(`Executing migration: ${file}`);
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                await pool.query(sql);
            }
        }

        console.log('✔ All migrations applied.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Reset failed:', error);
        process.exit(1);
    }
};

reset();
