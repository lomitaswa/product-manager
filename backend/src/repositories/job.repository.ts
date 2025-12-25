import { pool } from "../config/db.js";

export const createJob = async (jobType: string, status: string, inputFilePath?: string, format?: string) => {
    const result = await pool.query(
        `INSERT INTO async_jobs (job_type, status, input_file_path, format)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [jobType, status, inputFilePath, format]
    );
    return result.rows[0];
};

export const updateStatus = async (jobId: number, status: string, processedRecords?: number, errorMessage?: string, resultFilePath?: string) => {
    let query = `UPDATE async_jobs SET status=$1`;
    const params: any[] = [status];

    if (processedRecords !== undefined) {
        query += `, processed_records=$${params.length + 1}`;
        params.push(processedRecords);
    }

    if (errorMessage !== undefined) {
        query += `, error_message=$${params.length + 1}`;
        params.push(errorMessage);
    }

    if (resultFilePath !== undefined) {
        query += `, result_file_path=$${params.length + 1}`;
        params.push(resultFilePath);
    }

    query += ` WHERE id=$${params.length + 1}`;
    params.push(jobId);

    console.log('Executing UPDATE with params:', params);
    await pool.query(query, params);
};

export const findById = async (id: number) => {
    const result = await pool.query(
        `SELECT * FROM async_jobs WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

export const findAll = async (jobType?: string, page: number = 1, limit: number = 10, sortBy: string = 'created_at', sortOrder: 'ASC' | 'DESC' = 'DESC') => {
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM async_jobs`;
    const params: any[] = [];

    const validSortColumns = ['id', 'created_at', 'status', 'job_type', 'format'];
    const sortCol = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    if (jobType) {
        query += ` WHERE job_type = $1`;
        params.push(jobType);
    }

    query += ` ORDER BY ${sortCol} ${order} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
};

export const countAll = async (jobType?: string) => {
    let query = `SELECT COUNT(*) FROM async_jobs`;
    const params: any[] = [];

    if (jobType) {
        query += ` WHERE job_type = $1`;
        params.push(jobType);
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count, 10);
};

export const deleteJob = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM async_jobs WHERE id = $1`,
        [id]
    );
    return result.rowCount;
};
