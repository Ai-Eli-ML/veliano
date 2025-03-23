-- Add missing fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS compare_at_price numeric,
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Set default value for stock_quantity
ALTER TABLE products
ALTER COLUMN stock_quantity SET DEFAULT 0;

-- Rename stock_quantity to inventory_quantity
ALTER TABLE products
RENAME COLUMN stock_quantity TO inventory_quantity;

-- Add missing fields to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES categories(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS products_sku_idx ON products(sku);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products(is_featured) WHERE is_featured = true; 