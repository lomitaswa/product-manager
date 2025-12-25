import { Pool } from 'pg';
import { env } from './env.js';

export const pool = new Pool({
    ...env.db,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

export async function initDB() {
    try {
        await pool.query('SELECT 1');
        console.log('PostgreSQL connected');
    } catch (err) {
        console.error('Failed to connect to PostgreSQL', err);
        process.exit(1);
    }
}