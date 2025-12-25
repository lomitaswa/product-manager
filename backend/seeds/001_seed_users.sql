INSERT INTO users (name, email, password_hash)
VALUES
  ('admin', 'admin@example.com', '$2b$10$QwZq7YpZcVZp8n2ZrGkJ8O9nQk3B0E2U6Yv9ZkzJkH8pZ6l5G5F5y'),
  ('user1', 'user1@example.com', '$2b$10$QwZq7YpZcVZp8n2ZrGkJ8O9nQk3B0E2U6Yv9ZkzJkH8pZ6l5G5F5y')
ON CONFLICT (email) DO NOTHING;


