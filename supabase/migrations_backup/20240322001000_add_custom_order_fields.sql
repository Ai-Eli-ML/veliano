-- Idempotent migration (safe to run multiple times)

-- Add custom order fields to products table if they don't exist
DO $$ 
BEGIN
    -- Check if columns exist before adding them
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'products' AND column_name = 'is_custom_order') THEN
        ALTER TABLE products ADD COLUMN is_custom_order boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'products' AND column_name = 'requires_impression_kit') THEN
        ALTER TABLE products ADD COLUMN requires_impression_kit boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'products' AND column_name = 'base_production_time') THEN
        ALTER TABLE products ADD COLUMN base_production_time integer;
    END IF;
END $$;

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

-- Create custom orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS custom_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  status order_status NOT NULL DEFAULT 'pending',
  customer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS policies (safe to run multiple times)
DO $$ 
BEGIN
    -- Enable RLS
    ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Admins have full access to custom orders" ON custom_orders;
    DROP POLICY IF EXISTS "Users can view their own custom orders" ON custom_orders;

    -- Create new policies
    CREATE POLICY "Admins have full access to custom orders" ON custom_orders
      FOR ALL
      TO authenticated
      USING (auth.uid() IN (SELECT user_id FROM admin_users))
      WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

    CREATE POLICY "Users can view their own custom orders" ON custom_orders
      FOR SELECT
      TO authenticated
      USING (
        auth.uid() IN (
          SELECT user_id FROM orders WHERE id = custom_orders.order_id
        )
      );
END $$; 