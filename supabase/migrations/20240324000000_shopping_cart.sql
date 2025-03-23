-- Create cart table
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  CONSTRAINT cart_user_or_session_check CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create index for efficient lookup
CREATE INDEX IF NOT EXISTS cart_items_cart_id_idx ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS cart_items_product_id_idx ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS carts_user_id_idx ON carts(user_id);
CREATE INDEX IF NOT EXISTS carts_session_id_idx ON carts(session_id);

-- Create a composite unique constraint to prevent duplicate items
CREATE UNIQUE INDEX IF NOT EXISTS cart_items_cart_product_variant_unique 
ON cart_items(cart_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::UUID));

-- Enable Row Level Security
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow users to view their own carts" ON carts;
DROP POLICY IF EXISTS "Allow users to create their own carts" ON carts;
DROP POLICY IF EXISTS "Allow users to update their own carts" ON carts;
DROP POLICY IF EXISTS "Allow users to delete their own carts" ON carts;
DROP POLICY IF EXISTS "Allow admins to view all carts" ON carts;
DROP POLICY IF EXISTS "Allow admins to create carts" ON carts;
DROP POLICY IF EXISTS "Allow admins to update carts" ON carts;
DROP POLICY IF EXISTS "Allow admins to delete carts" ON carts;
DROP POLICY IF EXISTS "Allow public access with session_id" ON carts;

DROP POLICY IF EXISTS "Allow users to view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow users to create their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow users to update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow users to delete their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow admins to view all cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow admins to create cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow admins to update cart items" ON cart_items;
DROP POLICY IF EXISTS "Allow admins to delete cart items" ON cart_items;

-- Create policies for carts table
CREATE POLICY "Allow users to view their own carts" 
ON carts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create their own carts" 
ON carts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own carts" 
ON carts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own carts" 
ON carts FOR DELETE 
USING (auth.uid() = user_id);

-- Admin policies for carts
CREATE POLICY "Allow admins to view all carts" 
ON carts FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Allow admins to create carts" 
ON carts FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Allow admins to update carts" 
ON carts FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Allow admins to delete carts" 
ON carts FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

-- Public access with session_id
CREATE POLICY "Allow public access with session_id" 
ON carts FOR ALL 
USING (session_id IS NOT NULL)
WITH CHECK (session_id IS NOT NULL);

-- Create policies for cart_items table
CREATE POLICY "Allow users to view their own cart items" 
ON cart_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM carts 
  WHERE carts.id = cart_items.cart_id 
  AND carts.user_id = auth.uid()
));

CREATE POLICY "Allow users to create their own cart items" 
ON cart_items FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM carts 
  WHERE carts.id = cart_items.cart_id 
  AND carts.user_id = auth.uid()
));

CREATE POLICY "Allow users to update their own cart items" 
ON cart_items FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM carts 
  WHERE carts.id = cart_items.cart_id 
  AND carts.user_id = auth.uid()
));

CREATE POLICY "Allow users to delete their own cart items" 
ON cart_items FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM carts 
  WHERE carts.id = cart_items.cart_id 
  AND carts.user_id = auth.uid()
));

-- Admin policies for cart_items
CREATE POLICY "Allow admins to view all cart items" 
ON cart_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Allow admins to create cart items" 
ON cart_items FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Allow admins to update cart items" 
ON cart_items FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Allow admins to delete cart items" 
ON cart_items FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE user_id = auth.uid()
));

-- Create policies for session-based cart items
CREATE POLICY "Allow session-based cart items access" 
ON cart_items FOR ALL 
USING (EXISTS (
  SELECT 1 FROM carts 
  WHERE carts.id = cart_items.cart_id 
  AND carts.session_id IS NOT NULL
))
WITH CHECK (EXISTS (
  SELECT 1 FROM carts 
  WHERE carts.id = cart_items.cart_id 
  AND carts.session_id IS NOT NULL
)); 