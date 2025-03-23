-- Migration: Add custom orders functionality
-- Based on schema reference from database-schema-reference.mdc

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    address jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add custom order fields to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_custom_order boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_impression_kit boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS base_production_time integer;

-- Create order status type
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

-- Create custom orders table matching schema reference
CREATE TABLE IF NOT EXISTS custom_orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number text NOT NULL UNIQUE,
    customer_id uuid REFERENCES customers(id) NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    total_price numeric NOT NULL CHECK (total_price >= 0),
    impression_kit_status text NOT NULL DEFAULT 'not_sent',
    impression_kit_tracking text,
    teeth_selection jsonb NOT NULL,
    material text NOT NULL,
    design_details text,
    estimated_completion_date timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add RLS policies
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins have full access to custom orders" ON custom_orders;
DROP POLICY IF EXISTS "Users can view their own custom orders" ON custom_orders;
DROP POLICY IF EXISTS "Admins have full access to customers" ON customers;
DROP POLICY IF EXISTS "Users can view their own customer profile" ON customers;
DROP POLICY IF EXISTS "Admins have full access to admin_users" ON admin_users;

-- Create policies for custom_orders
CREATE POLICY "Admins have full access to custom orders" ON custom_orders
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Users can view their own custom orders" ON custom_orders
    FOR SELECT
    TO authenticated
    USING (auth.uid() IN (
        SELECT user_id FROM customers WHERE id = custom_orders.customer_id
    ));

-- Create policies for customers
CREATE POLICY "Admins have full access to customers" ON customers
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Users can view their own customer profile" ON customers
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Create policies for admin_users
CREATE POLICY "Admins have full access to admin_users" ON admin_users
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users)); 