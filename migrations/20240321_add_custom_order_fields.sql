-- Add custom order fields to products table
ALTER TABLE products
ADD COLUMN is_custom_order boolean DEFAULT false,
ADD COLUMN requires_impression_kit boolean DEFAULT false,
ADD COLUMN base_production_time integer;

-- Create order status enum
CREATE TYPE order_status AS ENUM (
  'pending',
  'impression_kit_sent',
  'impression_received',
  'in_design',
  'in_production',
  'completed'
);

-- Create simple custom orders table
CREATE TABLE custom_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  status order_status NOT NULL DEFAULT 'pending',
  customer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS policies
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins have full access to custom orders" ON custom_orders
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

-- Users can view their own orders
CREATE POLICY "Users can view their own custom orders" ON custom_orders
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM orders WHERE id = custom_orders.order_id
    )
  ); 