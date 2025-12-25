INSERT INTO async_jobs (
  job_type,
  status,
  total_records,
  processed_records,
  failed_records,
  input_file_path,
  result_file_path
)
VALUES
  ('BULK_UPLOAD', 'COMPLETED', 100, 98, 2, 'uploads/sample_products.csv', NULL),
  ('REPORT', 'COMPLETED', 0, 0, 0, NULL, 'reports/products_report.csv'),
  ('BULK_UPLOAD', 'PROCESSING', 500, 120, 1, 'uploads/large_file.csv', NULL)
ON CONFLICT DO NOTHING;
