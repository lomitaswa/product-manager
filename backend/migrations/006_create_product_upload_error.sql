BEGIN;
CREATE TABLE product_upload_errors (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    row_number INT NOT NULL,
    error_message TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_upload_errors_job
        FOREIGN KEY (job_id)
        REFERENCES async_jobs(id)
        ON DELETE CASCADE
);
COMMIT;