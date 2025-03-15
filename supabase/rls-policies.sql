-- RLS Policies for e-commerce application
-- This file contains recommended RLS policies for your Supabase tables
-- You can apply these policies in the Supabase dashboard SQL editor

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_transactions ENABLE ROW LEVEL SECURITY;

-- User table policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Categories table policies
-- Anyone can view categories
CREATE POLICY "Anyone can view categories" 
ON categories FOR SELECT 
USING (true);

-- Only admins can create/update/delete categories
CREATE POLICY "Only admins can create categories" 
ON categories FOR INSERT 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY "Only admins can update categories" 
ON categories FOR UPDATE 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY "Only admins can delete categories" 
ON categories FOR DELETE 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

-- Products table policies
-- Anyone can view active products
CREATE POLICY "Anyone can view active products" 
ON products FOR SELECT 
USING (status = 'active');

-- Admins can view all products
CREATE POLICY "Admins can view all products" 
ON products FOR SELECT 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

-- Only admins can create/update/delete products
CREATE POLICY "Only admins can create products" 
ON products FOR INSERT 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY "Only admins can update products" 
ON products FOR UPDATE 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

CREATE POLICY "Only admins can delete products" 
ON products FOR DELETE 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

-- Cart policies
-- Users can view their own cart
CREATE POLICY "Users can view own cart" 
ON carts FOR SELECT 
USING (user_id = auth.uid());

-- Users can insert their own cart
CREATE POLICY "Users can insert own cart" 
ON carts FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Users can update their own cart
CREATE POLICY "Users can update own cart" 
ON carts FOR UPDATE 
USING (user_id = auth.uid());

-- Users can delete their own cart
CREATE POLICY "Users can delete own cart" 
ON carts FOR DELETE 
USING (user_id = auth.uid());

-- Cart items policies
-- Users can view their own cart items
CREATE POLICY "Users can view own cart items" 
ON cart_items FOR SELECT 
USING ((SELECT user_id FROM carts WHERE id = cart_id) = auth.uid());

-- Users can insert items into their own cart
CREATE POLICY "Users can insert own cart items" 
ON cart_items FOR INSERT 
WITH CHECK ((SELECT user_id FROM carts WHERE id = cart_id) = auth.uid());

-- Users can update items in their own cart
CREATE POLICY "Users can update own cart items" 
ON cart_items FOR UPDATE 
USING ((SELECT user_id FROM carts WHERE id = cart_id) = auth.uid());

-- Users can delete items from their own cart
CREATE POLICY "Users can delete own cart items" 
ON cart_items FOR DELETE 
USING ((SELECT user_id FROM carts WHERE id = cart_id) = auth.uid());

-- Order policies
-- Users can view their own orders
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT 
USING (user_id = auth.uid());

-- Admins can view all orders
CREATE POLICY "Admins can view all orders" 
ON orders FOR SELECT 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

-- Users can create their own orders
CREATE POLICY "Users can create own orders" 
ON orders FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Only admins can update orders
CREATE POLICY "Only admins can update orders" 
ON orders FOR UPDATE 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

-- Affiliate policies
-- Users can view their own affiliate info
CREATE POLICY "Users can view own affiliate info" 
ON affiliates FOR SELECT 
USING (user_id = auth.uid());

-- Admins can view all affiliate info
CREATE POLICY "Admins can view all affiliate info" 
ON affiliates FOR SELECT 
USING ((SELECT is_admin FROM users WHERE id = auth.uid()));

-- Functions to manage row level security
-- Function to check if user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT is_admin FROM users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 