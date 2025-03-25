-- Create search_logs table for analytics
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query TEXT NOT NULL,
  result_count INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for search_logs
CREATE INDEX IF NOT EXISTS idx_search_logs_query ON search_logs(query);
CREATE INDEX IF NOT EXISTS idx_search_logs_session_id ON search_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_user_id ON search_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_created_at ON search_logs(created_at);

-- Create search_analytics view
CREATE OR REPLACE VIEW search_analytics AS
WITH query_stats AS (
  SELECT
    query,
    COUNT(*) as search_count,
    AVG(result_count) as avg_results,
    COUNT(DISTINCT session_id) as unique_searchers,
    MAX(created_at) as last_searched_at
  FROM search_logs
  GROUP BY query
)
SELECT
  query,
  search_count,
  avg_results,
  unique_searchers,
  last_searched_at,
  CASE
    WHEN search_count > 0 THEN
      (avg_results::float / search_count) * unique_searchers
    ELSE 0
  END as relevance_score
FROM query_stats
ORDER BY search_count DESC;

-- Enable Row Level Security
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public insert access to search_logs"
  ON search_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin read access to search_logs"
  ON search_logs FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM admin_users
  ));

-- Create function to get popular searches
CREATE OR REPLACE FUNCTION get_popular_searches(
  time_window INTERVAL DEFAULT INTERVAL '7 days',
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  query TEXT,
  search_count BIGINT,
  avg_results NUMERIC,
  unique_searchers BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sl.query,
    COUNT(*) as search_count,
    AVG(sl.result_count) as avg_results,
    COUNT(DISTINCT sl.session_id) as unique_searchers
  FROM search_logs sl
  WHERE sl.created_at >= NOW() - time_window
  GROUP BY sl.query
  ORDER BY search_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get search suggestions
CREATE OR REPLACE FUNCTION get_search_suggestions(
  partial_query TEXT,
  limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
  query TEXT,
  search_count BIGINT,
  last_searched_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sl.query,
    COUNT(*) as search_count,
    MAX(sl.created_at) as last_searched_at
  FROM search_logs sl
  WHERE sl.query ILIKE partial_query || '%'
  GROUP BY sl.query
  ORDER BY search_count DESC, last_searched_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Add full-text search capabilities to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING gin(search_vector);

-- Create function for full-text product search
CREATE OR REPLACE FUNCTION search_products(
  search_query TEXT,
  category_filter UUID DEFAULT NULL,
  min_price NUMERIC DEFAULT NULL,
  max_price NUMERIC DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price NUMERIC,
  category_id UUID,
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
    ts_rank(p.search_vector, websearch_to_tsquery('english', search_query)) as rank
  FROM products p
  WHERE
    p.search_vector @@ websearch_to_tsquery('english', search_query)
    AND (category_filter IS NULL OR p.category_id = category_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
  ORDER BY rank DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql; 