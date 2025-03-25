-- Add custom order fields to products table
DO $$
BEGIN
    -- Add is_custom_order column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_custom_order') THEN
        ALTER TABLE products ADD COLUMN is_custom_order boolean DEFAULT false;
    END IF;

    -- Add requires_impression_kit column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'requires_impression_kit') THEN
        ALTER TABLE products ADD COLUMN requires_impression_kit boolean DEFAULT false;
    END IF;

    -- Add base_production_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'base_production_time') THEN
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

-- Add trigger for updating updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_custom_orders_updated_at') THEN
        CREATE TRIGGER set_custom_orders_updated_at
            BEFORE UPDATE ON custom_orders
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable read access for authenticated users" ON custom_orders;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON custom_orders;
    DROP POLICY IF EXISTS "Enable update for admin users" ON custom_orders;

    -- Create new policies
    CREATE POLICY "Enable read access for authenticated users"
        ON custom_orders FOR SELECT
        TO authenticated
        USING (true);

    CREATE POLICY "Enable insert for authenticated users"
        ON custom_orders FOR INSERT
        TO authenticated
        WITH CHECK (true);

    CREATE POLICY "Enable update for admin users"
        ON custom_orders FOR UPDATE
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = true
        ));
END $$; 