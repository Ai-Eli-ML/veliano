-- Add the grillz_specifications table that was missing in the generated types

-- Create enum types for grillz specifications
CREATE TYPE grillz_material AS ENUM ('gold', 'silver', 'platinum', 'rainbow_gold', 'diamond_encrusted');
CREATE TYPE grillz_style AS ENUM ('full_set', 'top_only', 'bottom_only', 'fangs', 'custom');
CREATE TYPE teeth_position AS ENUM ('top', 'bottom', 'both');

-- Create grillz_specifications table
CREATE TABLE grillz_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  material grillz_material NOT NULL,
  style grillz_style NOT NULL,
  teeth_position teeth_position NOT NULL,
  teeth_count INTEGER NOT NULL,
  diamond_options JSONB,
  customization_options JSONB NOT NULL,
  base_production_time_days INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to grillz_specifications table
ALTER TABLE grillz_specifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Admin users can manage grillz_specifications" ON grillz_specifications;
CREATE POLICY "Admin users can manage grillz_specifications"
ON grillz_specifications
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Anyone can view grillz_specifications" ON grillz_specifications;
CREATE POLICY "Anyone can view grillz_specifications"
ON grillz_specifications
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Public users can view grillz_specifications" ON grillz_specifications;
CREATE POLICY "Public users can view grillz_specifications"
ON grillz_specifications
FOR SELECT
TO anon
USING (true);

-- Index for faster lookups
CREATE INDEX grillz_specifications_product_id_idx ON grillz_specifications(product_id); 