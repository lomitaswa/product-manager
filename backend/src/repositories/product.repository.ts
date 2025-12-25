import { pool } from "../config/db.js";
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from "../dtos/product.dto.js";

export const findAll = async (filters: ProductFilterDto) => {
    const { category_id, search, sortBy, sortOrder = 'desc', page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    let query = `
        SELECT p.*, c.name as category_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
    `;
    const params: any[] = [];

    if (category_id) {
        query += ` AND p.category_id = $${params.length + 1}`;
        params.push(category_id);
    }

    if (search) {
        query += ` AND (p.name ILIKE $${params.length + 1} OR c.name ILIKE $${params.length + 1})`;
        params.push(`%${search}%`);
    }

    const sortField = sortBy === 'price' ? 'p.price' : (sortBy === 'name' ? 'p.name' : 'p.created_at');
    query += ` ORDER BY ${sortField} ${sortOrder === 'asc' ? 'ASC' : 'DESC'}`;

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    let countQuery = `
        SELECT COUNT(*) 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
    `;
    const countParams: any[] = [];
    if (category_id) {
        countQuery += ` AND p.category_id = $${countParams.length + 1}`;
        countParams.push(category_id);
    }
    if (search) {
        countQuery += ` AND (p.name ILIKE $${countParams.length + 1} OR c.name ILIKE $${countParams.length + 1})`;
        countParams.push(`%${search}%`);
    }

    const [result, countResult] = await Promise.all([
        pool.query(query, params),
        pool.query(countQuery, countParams)
    ]);

    return {
        products: result.rows,
        total: parseInt(countResult.rows[0].count),
        page,
        limit
    };
};

export const findById = async (id: string) => {
    const result = await pool.query(
        `SELECT * FROM products WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

export const findByUuid = async (uuid: string) => {
    const result = await pool.query(
        `SELECT * FROM products WHERE uuid = $1`,
        [uuid]
    );
    return result.rows[0];
};

export const create = async (productData: CreateProductDto) => {
    const { name, image_url, price, category_id } = productData;
    const result = await pool.query(
        `INSERT INTO products (name, image_url, price, category_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, image_url, price, category_id]
    );
    return result.rows[0];
};

export const bulkCreate = async (products: CreateProductDto[]) => {
    if (products.length === 0) return [];

    const values: any[] = [];
    const placeholders = products.map((p, i) => {
        const offset = i * 4;
        values.push(p.name, p.image_url || null, p.price, p.category_id);
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
    }).join(', ');

    const query = `
        INSERT INTO products (name, image_url, price, category_id)
        VALUES ${placeholders}
        RETURNING id
    `;

    const result = await pool.query(query, values);
    return result.rows;
};


export const update = async (id: string, productData: UpdateProductDto) => {
    const fields = Object.keys(productData).filter(key => productData[key as keyof UpdateProductDto] !== undefined);
    if (fields.length === 0) return await findById(id);

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const params = fields.map(field => productData[field as keyof UpdateProductDto]);

    const query = `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`;
    params.push(id);

    const result = await pool.query(query, params);
    return result.rows[0];
};

export const deleteById = async (id: string) => {
    const result = await pool.query(
        `DELETE FROM products WHERE id = $1`,
        [id]
    );
    return result.rowCount;
};
