-- Create ab_test_assignments table
CREATE TABLE IF NOT EXISTS ab_test_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ab_test_conversions table
CREATE TABLE IF NOT EXISTS ab_test_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  revenue NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_test_id ON ab_test_assignments(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user_id ON ab_test_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_session_id ON ab_test_assignments(session_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_variant ON ab_test_assignments(variant);

CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_test_id ON ab_test_conversions(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_user_id ON ab_test_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_session_id ON ab_test_conversions(session_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_conversions_variant ON ab_test_conversions(variant);

-- Enable Row Level Security
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_conversions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access to ab_test_assignments"
  ON ab_test_assignments FOR SELECT
  USING (true);

CREATE POLICY "Insert access for authenticated users to ab_test_assignments"
  ON ab_test_assignments FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Public read access to ab_test_conversions"
  ON ab_test_conversions FOR SELECT
  USING (true);

CREATE POLICY "Insert access for authenticated users to ab_test_conversions"
  ON ab_test_conversions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create function to get A/B test results
CREATE OR REPLACE FUNCTION get_ab_test_results(test_id TEXT)
RETURNS TABLE (
  variant TEXT,
  assignments BIGINT,
  conversions BIGINT,
  total_revenue NUMERIC,
  conversion_rate NUMERIC,
  average_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH assignments AS (
    SELECT 
      a.variant,
      COUNT(DISTINCT COALESCE(a.user_id::text, a.session_id)) as total_assignments
    FROM ab_test_assignments a
    WHERE a.test_id = $1
    GROUP BY a.variant
  ),
  conversions AS (
    SELECT 
      c.variant,
      COUNT(DISTINCT COALESCE(c.user_id::text, c.session_id)) as total_conversions,
      SUM(c.revenue) as total_revenue
    FROM ab_test_conversions c
    WHERE c.test_id = $1
    GROUP BY c.variant
  )
  SELECT 
    a.variant,
    a.total_assignments as assignments,
    COALESCE(c.total_conversions, 0) as conversions,
    COALESCE(c.total_revenue, 0) as total_revenue,
    CASE 
      WHEN a.total_assignments > 0 
      THEN ROUND((COALESCE(c.total_conversions, 0)::numeric / a.total_assignments::numeric) * 100, 2)
      ELSE 0 
    END as conversion_rate,
    CASE 
      WHEN COALESCE(c.total_conversions, 0) > 0 
      THEN ROUND(COALESCE(c.total_revenue, 0) / c.total_conversions, 2)
      ELSE 0 
    END as average_revenue
  FROM assignments a
  LEFT JOIN conversions c ON a.variant = c.variant
  ORDER BY conversion_rate DESC;
END;
$$ LANGUAGE plpgsql; 