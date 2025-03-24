
-- Product view history for generating recommendations
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product recommendation relevance scores
CREATE TABLE IF NOT EXISTS product_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  relevance_score DECIMAL NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('similar', 'frequently_bought_together', 'viewed_also_viewed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, recommended_product_id, recommendation_type)
);

-- Custom recommended products (manually curated)
CREATE TABLE IF NOT EXISTS curated_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, recommended_product_id)
);

-- Enable RLS and add policies
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE curated_recommendations ENABLE ROW LEVEL SECURITY;

-- Product views policies
CREATE POLICY "Users can view their own view history"
  ON product_views FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Users can insert their own view history"
  ON product_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Product recommendations policies (mainly for admin use, but readable by all)
CREATE POLICY "Anyone can view product recommendations"
  ON product_recommendations FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage product recommendations"
  ON product_recommendations FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Curated recommendations policies
CREATE POLICY "Anyone can view curated recommendations"
  ON curated_recommendations FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage curated recommendations"
  ON curated_recommendations FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_product_id ON product_recommendations(product_id);
CREATE INDEX IF NOT EXISTS idx_curated_recommendations_product_id ON curated_recommendations(product_id);
