import { pool } from "../config/db.js";
import { CreateCategoryDto } from "../dtos/category.dto.js";

export const findById = async (id: string) => {
    const result = await pool.query(
        `SELECT id, name from categories where id = $1`,
        [id]
    );
    return result.rows[0];
};

export const update = async (id: string, name: string) => {
    const result = await pool.query(
        `UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name`,
        [name, id]
    );
    return result.rows[0];
};

export const deleteById = async (id: string) => {
    const result = await pool.query(
        `DELETE FROM categories WHERE id = $1`,
        [id]
    );
    return result.rowCount;
};

export const create = async (categoryData: CreateCategoryDto) => {
    const { name } = categoryData;
    const result = await pool.query(
        `INSERT into categories (name) values($1) RETURNING id, name`,
        [name]
    );
    return result.rows[0];
};

export const findAll = async () => {
    const result = await pool.query(`SELECT id, name FROM categories ORDER BY name ASC`);
    return result.rows;
};
