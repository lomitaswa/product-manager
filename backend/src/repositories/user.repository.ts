import { pool } from "../config/db.js";

export const findByEmail = async (email: string) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    );
    return result.rows[0];
};

export const create = async (name: string, email: string, hashedPassword: string) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email`,
        [name, email, hashedPassword]
    );
    return result.rows[0];
};

export const findById = async (id: string) => {
    const result = await pool.query(
        `SELECT name, id, email from users where id = $1`,
        [id]
    );
    return result.rows[0];
};
