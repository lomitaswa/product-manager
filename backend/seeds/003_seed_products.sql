INSERT INTO products (name, image_url, price, category_id)
SELECT
  p.name,
  p.image_url,
  p.price,
  c.id
FROM (
  VALUES
    ('iPhone 15', 'https://example.com/iphone.jpg', 79999.00, 'Electronics'),
    ('MacBook Air', 'https://example.com/macbook.jpg', 119999.00, 'Electronics'),
    ('Running Shoes', 'https://example.com/shoes.jpg', 4999.00, 'Sports'),
    ('Microwave Oven', 'https://example.com/microwave.jpg', 15999.00, 'Home Appliances'),
    ('JavaScript Guide', 'https://example.com/jsbook.jpg', 899.00, 'Books'),
    ('Cotton T-Shirt', 'https://example.com/tshirt.jpg', 699.00, 'Clothing')
) AS p(name, image_url, price, category_name)
JOIN categories c ON c.name = p.category_name
ON CONFLICT DO NOTHING;
