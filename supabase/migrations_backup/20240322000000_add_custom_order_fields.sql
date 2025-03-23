-- Add custom order fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_custom_order boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_impression_kit boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS base_production_time integer;

-- Create order status enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM (
          'pending',
          'impression_kit_sent',
          'impression_received',
          'in_design',
          'in_production',
          'completed'
        );
    END IF;
END $$;

-- Create simple custom orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS custom_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  status order_status NOT NULL DEFAULT 'pending',
  customer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS policies if table is newly created
DO $$ 
BEGIN
    -- Enable RLS on custom_orders
    ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies to avoid errors if we're re-running
    DROP POLICY IF EXISTS "Admins have full access to custom orders" ON custom_orders;
    DROP POLICY IF EXISTS "Users can view their own custom orders" ON custom_orders;

    -- Create policies
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
END $$; 