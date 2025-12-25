BEGIN;
CREATE TABLE async_jobs (
    id BIGSERIAL PRIMARY KEY,
    job_type VARCHAR(30) NOT NULL, -- BULK_UPLOAD / REPORT
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    total_records INT DEFAULT 0,
    processed_records INT DEFAULT 0,
    failed_records INT DEFAULT 0,
    input_file_path TEXT,
    result_file_path TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_async_jobs_status ON async_jobs(status);
CREATE INDEX idx_async_jobs_type ON async_jobs(job_type);
COMMIT;