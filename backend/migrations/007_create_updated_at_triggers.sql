CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_async_jobs_updated
BEFORE UPDATE ON async_jobs
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();