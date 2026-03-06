# Module 4: Creating the Database Schema and Dummy Data

[← Setting Up Supabase](03-setting-up-supabase.md) | [Next: Building Your First MCP Server →](05-building-your-first-mcp-server.md)

---

## Step 1: Create the Migration

Create a new migration file for our schema:

```bash
supabase migration new create_inventory_schema
```

This creates a file at `supabase/migrations/<timestamp>_create_inventory_schema.sql`. Open it and add:

```sql
-- ============================================
-- Product Inventory Schema for MCP Server
-- ============================================

-- Categories table
CREATE TABLE categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  sku TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sales table
CREATE TABLE sales (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_revenue DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sale_date TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_sales_product ON sales(product_id);
CREATE INDEX idx_sales_date ON sales(sale_date);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Useful view: products with category names
CREATE VIEW products_with_categories AS
SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  c.name AS category,
  p.stock_quantity,
  p.sku,
  p.is_active,
  p.created_at,
  p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Useful view: sales summary by product
CREATE VIEW sales_summary AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  c.name AS category,
  COUNT(s.id) AS total_orders,
  COALESCE(SUM(s.quantity), 0) AS total_units_sold,
  COALESCE(SUM(s.total_revenue), 0) AS total_revenue,
  p.stock_quantity AS current_stock,
  p.price AS current_price
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN sales s ON p.id = s.product_id
GROUP BY p.id, p.name, c.name, p.stock_quantity, p.price;
```

## Step 2: Create Seed Data

Create the file `supabase/seed.sql`:

```sql
-- ============================================
-- Seed Data: Product Inventory
-- ============================================

-- Insert categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic devices, gadgets, and accessories'),
  ('Clothing', 'Apparel, footwear, and fashion accessories'),
  ('Home & Kitchen', 'Furniture, appliances, and home essentials'),
  ('Books', 'Physical and digital books across all genres'),
  ('Sports & Outdoors', 'Athletic equipment, outdoor gear, and fitness accessories');

-- Insert products
INSERT INTO products (name, description, price, category_id, stock_quantity, sku) VALUES
  -- Electronics
  ('Wireless Bluetooth Mouse', 'Ergonomic wireless mouse with USB-C receiver and 3 DPI settings', 29.99, 1, 245, 'ELEC-001'),
  ('USB-C Hub 7-in-1', 'Multi-port adapter with HDMI, USB-A, SD card reader, and ethernet', 49.99, 1, 132, 'ELEC-002'),
  ('Mechanical Keyboard', 'Full-size mechanical keyboard with Cherry MX Blue switches and RGB backlight', 89.99, 1, 78, 'ELEC-003'),
  ('Noise-Cancelling Headphones', 'Over-ear ANC headphones with 30-hour battery life and Bluetooth 5.3', 199.99, 1, 56, 'ELEC-004'),
  ('4K Webcam', 'Ultra HD webcam with auto-focus, built-in mic, and privacy shutter', 129.99, 1, 91, 'ELEC-005'),
  ('Portable SSD 1TB', 'External solid state drive with USB 3.2 Gen 2 and 1050 MB/s read speed', 89.99, 1, 167, 'ELEC-006'),
  ('Smart Power Strip', 'WiFi-enabled power strip with 4 outlets, 3 USB ports, and voice control', 34.99, 1, 203, 'ELEC-007'),

  -- Clothing
  ('Classic Fit Cotton T-Shirt', '100% organic cotton crew-neck t-shirt, available in 8 colors', 24.99, 2, 512, 'CLTH-001'),
  ('Slim Fit Chinos', 'Stretch cotton chino pants with a modern slim fit', 59.99, 2, 189, 'CLTH-002'),
  ('Waterproof Rain Jacket', 'Lightweight packable rain jacket with sealed seams and adjustable hood', 79.99, 2, 94, 'CLTH-003'),
  ('Merino Wool Sweater', 'Fine-gauge merino wool crewneck sweater, machine washable', 69.99, 2, 143, 'CLTH-004'),
  ('Running Shoes', 'Lightweight mesh running shoes with responsive cushioning', 119.99, 2, 67, 'CLTH-005'),

  -- Home & Kitchen
  ('Stainless Steel Water Bottle', 'Double-wall vacuum insulated bottle, keeps drinks cold 24h / hot 12h', 27.99, 3, 378, 'HOME-001'),
  ('Cast Iron Skillet 12"', 'Pre-seasoned cast iron skillet, oven safe to 500F', 39.99, 3, 156, 'HOME-002'),
  ('Robot Vacuum Cleaner', 'Smart robot vacuum with LIDAR navigation, app control, and auto-empty dock', 349.99, 3, 34, 'HOME-003'),
  ('Bamboo Cutting Board Set', 'Set of 3 organic bamboo cutting boards with juice grooves', 32.99, 3, 221, 'HOME-004'),
  ('LED Desk Lamp', 'Adjustable LED desk lamp with 5 brightness levels and USB charging port', 44.99, 3, 187, 'HOME-005'),

  -- Books
  ('Designing Data-Intensive Applications', 'Martin Kleppmann - The big ideas behind reliable, scalable systems', 42.99, 4, 89, 'BOOK-001'),
  ('The Pragmatic Programmer', 'David Thomas & Andrew Hunt - From journeyman to master developer', 49.99, 4, 112, 'BOOK-002'),
  ('Clean Code', 'Robert C. Martin - A handbook of agile software craftsmanship', 37.99, 4, 156, 'BOOK-003'),
  ('System Design Interview Vol. 1', 'Alex Xu - Step-by-step framework for system design questions', 35.99, 4, 201, 'BOOK-004'),
  ('Atomic Habits', 'James Clear - Tiny changes, remarkable results', 16.99, 4, 534, 'BOOK-005'),

  -- Sports & Outdoors
  ('Yoga Mat Premium', 'Non-slip TPE yoga mat, 6mm thick, with carrying strap', 34.99, 5, 267, 'SPRT-001'),
  ('Adjustable Dumbbells 50lb', 'Quick-change adjustable dumbbells, 5-50 lbs per hand', 299.99, 5, 42, 'SPRT-002'),
  ('Hiking Backpack 40L', 'Lightweight hiking backpack with rain cover and hydration sleeve', 89.99, 5, 73, 'SPRT-003'),
  ('Resistance Bands Set', 'Set of 5 latex resistance bands with door anchor and carrying bag', 22.99, 5, 345, 'SPRT-004'),
  ('Insulated Water Bottle 32oz', 'Sport water bottle with straw lid, double insulated', 24.99, 5, 189, 'SPRT-005');

-- Insert historical sales data (past 90 days)
-- We generate realistic sales patterns where popular items sell more frequently.

INSERT INTO sales (product_id, quantity, unit_price, sale_date) VALUES
  -- Electronics sales (high volume)
  (1, 3, 29.99, now() - interval '2 days'),
  (1, 1, 29.99, now() - interval '5 days'),
  (1, 2, 29.99, now() - interval '12 days'),
  (1, 5, 29.99, now() - interval '18 days'),
  (1, 1, 29.99, now() - interval '25 days'),
  (1, 4, 29.99, now() - interval '33 days'),
  (1, 2, 29.99, now() - interval '45 days'),
  (1, 3, 29.99, now() - interval '60 days'),

  (2, 2, 49.99, now() - interval '1 day'),
  (2, 1, 49.99, now() - interval '8 days'),
  (2, 3, 49.99, now() - interval '15 days'),
  (2, 1, 49.99, now() - interval '22 days'),
  (2, 2, 49.99, now() - interval '40 days'),
  (2, 4, 49.99, now() - interval '55 days'),

  (3, 1, 89.99, now() - interval '3 days'),
  (3, 2, 89.99, now() - interval '14 days'),
  (3, 1, 89.99, now() - interval '28 days'),
  (3, 3, 89.99, now() - interval '42 days'),
  (3, 1, 89.99, now() - interval '65 days'),

  (4, 1, 199.99, now() - interval '4 days'),
  (4, 1, 199.99, now() - interval '11 days'),
  (4, 2, 199.99, now() - interval '30 days'),
  (4, 1, 199.99, now() - interval '50 days'),
  (4, 1, 199.99, now() - interval '72 days'),

  (5, 2, 129.99, now() - interval '6 days'),
  (5, 1, 129.99, now() - interval '20 days'),
  (5, 3, 129.99, now() - interval '35 days'),

  (6, 4, 89.99, now() - interval '2 days'),
  (6, 2, 89.99, now() - interval '10 days'),
  (6, 3, 89.99, now() - interval '21 days'),
  (6, 1, 89.99, now() - interval '38 days'),
  (6, 5, 89.99, now() - interval '52 days'),

  (7, 3, 34.99, now() - interval '1 day'),
  (7, 2, 34.99, now() - interval '9 days'),
  (7, 4, 34.99, now() - interval '16 days'),
  (7, 1, 34.99, now() - interval '30 days'),

  -- Clothing sales
  (8, 5, 24.99, now() - interval '1 day'),
  (8, 8, 24.99, now() - interval '7 days'),
  (8, 3, 24.99, now() - interval '14 days'),
  (8, 6, 24.99, now() - interval '21 days'),
  (8, 10, 24.99, now() - interval '35 days'),
  (8, 4, 24.99, now() - interval '50 days'),
  (8, 7, 24.99, now() - interval '65 days'),

  (9, 2, 59.99, now() - interval '3 days'),
  (9, 1, 59.99, now() - interval '12 days'),
  (9, 3, 59.99, now() - interval '25 days'),
  (9, 2, 59.99, now() - interval '40 days'),

  (10, 1, 79.99, now() - interval '5 days'),
  (10, 2, 79.99, now() - interval '30 days'),
  (10, 1, 79.99, now() - interval '60 days'),

  (12, 3, 119.99, now() - interval '7 days'),
  (12, 1, 119.99, now() - interval '20 days'),
  (12, 2, 119.99, now() - interval '45 days'),

  -- Home & Kitchen sales
  (13, 4, 27.99, now() - interval '2 days'),
  (13, 6, 27.99, now() - interval '10 days'),
  (13, 3, 27.99, now() - interval '22 days'),
  (13, 5, 27.99, now() - interval '38 days'),

  (14, 2, 39.99, now() - interval '4 days'),
  (14, 1, 39.99, now() - interval '18 days'),
  (14, 3, 39.99, now() - interval '32 days'),

  (15, 1, 349.99, now() - interval '8 days'),
  (15, 1, 349.99, now() - interval '25 days'),
  (15, 1, 349.99, now() - interval '55 days'),

  (17, 3, 44.99, now() - interval '3 days'),
  (17, 2, 44.99, now() - interval '15 days'),
  (17, 4, 44.99, now() - interval '28 days'),

  -- Books sales (high volume on popular titles)
  (18, 2, 42.99, now() - interval '1 day'),
  (18, 1, 42.99, now() - interval '6 days'),
  (18, 3, 42.99, now() - interval '13 days'),
  (18, 2, 42.99, now() - interval '27 days'),

  (19, 1, 49.99, now() - interval '4 days'),
  (19, 2, 49.99, now() - interval '19 days'),

  (20, 3, 37.99, now() - interval '2 days'),
  (20, 2, 37.99, now() - interval '11 days'),
  (20, 1, 37.99, now() - interval '24 days'),
  (20, 4, 37.99, now() - interval '40 days'),

  (22, 5, 16.99, now() - interval '1 day'),
  (22, 8, 16.99, now() - interval '6 days'),
  (22, 3, 16.99, now() - interval '15 days'),
  (22, 6, 16.99, now() - interval '25 days'),
  (22, 10, 16.99, now() - interval '35 days'),
  (22, 4, 16.99, now() - interval '48 days'),
  (22, 7, 16.99, now() - interval '62 days'),

  -- Sports & Outdoors sales
  (23, 3, 34.99, now() - interval '2 days'),
  (23, 5, 34.99, now() - interval '9 days'),
  (23, 2, 34.99, now() - interval '20 days'),
  (23, 4, 34.99, now() - interval '35 days'),

  (24, 1, 299.99, now() - interval '10 days'),
  (24, 1, 299.99, now() - interval '30 days'),

  (25, 2, 89.99, now() - interval '5 days'),
  (25, 1, 89.99, now() - interval '22 days'),
  (25, 3, 89.99, now() - interval '45 days'),

  (26, 4, 22.99, now() - interval '3 days'),
  (26, 6, 22.99, now() - interval '12 days'),
  (26, 3, 22.99, now() - interval '25 days'),
  (26, 5, 22.99, now() - interval '40 days');
```

## Step 3: Apply the Migration and Seed Data

```bash
# Start the local Supabase stack
supabase start

# Apply the migration
supabase db reset
```

The `db reset` command applies all migrations and runs `seed.sql` automatically. You should see output confirming that tables were created and data was inserted.

**Verify the data:**

Open the Supabase Studio dashboard at `http://localhost:54323` (the local Studio URL printed when you ran `supabase start`), navigate to the Table Editor, and you should see:
- **categories**: 5 rows
- **products**: 27 rows
- **sales**: ~85 rows

---

[Next: Module 5 - Building Your First MCP Server →](05-building-your-first-mcp-server.md)
