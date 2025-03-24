
-- Search indices for products
CREATE INDEX IF NOT EXISTS idx_products_search ON products 
USING GIN (to_tsvector('english', name || ' ' || description));

-- Search history for tracking popular searches
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  search_query TEXT NOT NULL,
  result_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Popular search terms (updated periodically by a job)
CREATE TABLE IF NOT EXISTS popular_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  search_term TEXT UNIQUE NOT NULL,
  search_count INTEGER NOT NULL,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and add policies
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_searches ENABLE ROW LEVEL SECURITY;

-- Search history policies
CREATE POLICY "Users can insert their own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Popular searches policies (readable by all)
CREATE POLICY "Anyone can view popular searches"
  ON popular_searches FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage popular searches"
  ON popular_searches FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Full-text search function for products
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  category_id UUID,
  image_url TEXT,
  stock_quantity INTEGER,
  is_featured BOOLEAN,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.category_id,
    p.image_url,
    p.stock_quantity,
    p.is_featured,
    ts_rank(to_tsvector('english', p.name || ' ' || p.description), to_tsquery('english', search_term)) AS rank
  FROM
    products p
  WHERE
    to_tsvector('english', p.name || ' ' || p.description) @@ to_tsquery('english', search_term)
  ORDER BY
    rank DESC;
END;
$$ LANGUAGE plpgsql;
