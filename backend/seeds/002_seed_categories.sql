INSERT INTO categories (name)
VALUES
  ('Electronics'),
  ('Books'),
  ('Clothing'),
  ('Home Appliances'),
  ('Sports')
ON CONFLICT (name) DO NOTHING;
