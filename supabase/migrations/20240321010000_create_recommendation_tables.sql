-- Create product_relations table for storing relationships between products
CREATE TABLE IF NOT EXISTS product_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  related_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('similar', 'complementary', 'frequently_bought_together')),
  score FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, related_product_id, relation_type)
);

-- Create analytics_events table for tracking recommendation interactions
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_relations_product_id ON product_relations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_relations_related_product_id ON product_relations(related_product_id);
CREATE INDEX IF NOT EXISTS idx_product_relations_relation_type ON product_relations(relation_type);
CREATE INDEX IF NOT EXISTS idx_product_relations_score ON product_relations(score);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_relations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_product_relations_updated_at
    BEFORE UPDATE ON product_relations
    FOR EACH ROW
    EXECUTE FUNCTION update_product_relations_updated_at();

-- Add RLS policies
ALTER TABLE product_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow read access to product relations for all authenticated users
CREATE POLICY "Allow read access to product relations"
  ON product_relations FOR SELECT
  TO authenticated
  USING (true);

-- Allow insert/update access to product relations for admin users only
CREATE POLICY "Allow insert/update access to product relations for admin users"
  ON product_relations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow read access to analytics events for admin users only
CREATE POLICY "Allow read access to analytics events for admin users"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Allow insert access to analytics events for authenticated users
CREATE POLICY "Allow insert access to analytics events for authenticated users"
  ON analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE product_relations IS 'Stores relationships between products for recommendations';
COMMENT ON TABLE analytics_events IS 'Tracks user interactions with recommendations';
COMMENT ON COLUMN product_relations.relation_type IS 'Type of relationship (e.g., similar_style, frequently_bought_together)';
COMMENT ON COLUMN product_relations.score IS 'Strength of relationship between products (0-1)';
COMMENT ON COLUMN analytics_events.event_type IS 'Type of event (e.g., recommendation_click, recommendation_view)';
COMMENT ON COLUMN analytics_events.metadata IS 'Additional event data in JSON format'; 