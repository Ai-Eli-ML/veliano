-- Create recommendation views table
CREATE TABLE IF NOT EXISTS recommendation_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  source TEXT NOT NULL,
  recommendation_type TEXT CHECK (recommendation_type IN ('similar', 'frequently_bought_together', 'viewed_also_viewed')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recommendation clicks table
CREATE TABLE IF NOT EXISTS recommendation_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('similar', 'frequently_bought_together', 'viewed_also_viewed')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create recommendation conversions table
CREATE TABLE IF NOT EXISTS recommendation_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('similar', 'frequently_bought_together', 'viewed_also_viewed')),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recommendation_views_product_id ON recommendation_views(product_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_views_user_id ON recommendation_views(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_views_timestamp ON recommendation_views(timestamp);

CREATE INDEX IF NOT EXISTS idx_recommendation_clicks_product_id ON recommendation_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_clicks_recommended_product_id ON recommendation_clicks(recommended_product_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_clicks_user_id ON recommendation_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_clicks_timestamp ON recommendation_clicks(timestamp);

CREATE INDEX IF NOT EXISTS idx_recommendation_conversions_product_id ON recommendation_conversions(product_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_conversions_recommended_product_id ON recommendation_conversions(recommended_product_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_conversions_user_id ON recommendation_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_conversions_order_id ON recommendation_conversions(order_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_conversions_timestamp ON recommendation_conversions(timestamp);

-- Enable Row Level Security
ALTER TABLE recommendation_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_conversions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access to recommendation_views"
  ON recommendation_views FOR SELECT
  USING (true);

CREATE POLICY "Insert access for authenticated users to recommendation_views"
  ON recommendation_views FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Public read access to recommendation_clicks"
  ON recommendation_clicks FOR SELECT
  USING (true);

CREATE POLICY "Insert access for authenticated users to recommendation_clicks"
  ON recommendation_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Public read access to recommendation_conversions"
  ON recommendation_conversions FOR SELECT
  USING (true);

CREATE POLICY "Insert access for authenticated users to recommendation_conversions"
  ON recommendation_conversions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create view for recommendation analytics
CREATE OR REPLACE VIEW recommendation_analytics AS
WITH view_stats AS (
  SELECT
    rv.product_id,
    rv.recommendation_type,
    COUNT(*) as view_count,
    COUNT(DISTINCT rv.user_id) as unique_viewers
  FROM recommendation_views rv
  GROUP BY rv.product_id, rv.recommendation_type
),
click_stats AS (
  SELECT
    rc.product_id,
    rc.recommendation_type,
    COUNT(*) as click_count,
    COUNT(DISTINCT rc.user_id) as unique_clickers
  FROM recommendation_clicks rc
  GROUP BY rc.product_id, rc.recommendation_type
),
conversion_stats AS (
  SELECT
    rcv.product_id,
    rcv.recommendation_type,
    COUNT(*) as conversion_count,
    COUNT(DISTINCT rcv.user_id) as unique_converters,
    SUM(p.price) as total_revenue
  FROM recommendation_conversions rcv
  JOIN products p ON p.id = rcv.product_id
  GROUP BY rcv.product_id, rcv.recommendation_type
)
SELECT
  COALESCE(v.product_id, c.product_id, cv.product_id) as product_id,
  COALESCE(v.recommendation_type, c.recommendation_type, cv.recommendation_type) as recommendation_type,
  COALESCE(v.view_count, 0) as view_count,
  COALESCE(v.unique_viewers, 0) as unique_viewers,
  COALESCE(c.click_count, 0) as click_count,
  COALESCE(c.unique_clickers, 0) as unique_clickers,
  COALESCE(cv.conversion_count, 0) as conversion_count,
  COALESCE(cv.unique_converters, 0) as unique_converters,
  COALESCE(cv.total_revenue, 0) as total_revenue,
  CASE
    WHEN COALESCE(v.view_count, 0) > 0 THEN
      ROUND((COALESCE(c.click_count, 0)::numeric / v.view_count::numeric) * 100, 2)
    ELSE 0
  END as click_through_rate,
  CASE
    WHEN COALESCE(c.click_count, 0) > 0 THEN
      ROUND((COALESCE(cv.conversion_count, 0)::numeric / c.click_count::numeric) * 100, 2)
    ELSE 0
  END as conversion_rate
FROM view_stats v
FULL OUTER JOIN click_stats c ON v.product_id = c.product_id AND v.recommendation_type = c.recommendation_type
FULL OUTER JOIN conversion_stats cv ON COALESCE(v.product_id, c.product_id) = cv.product_id 
  AND COALESCE(v.recommendation_type, c.recommendation_type) = cv.recommendation_type; 