-- Create function to set default address
CREATE OR REPLACE FUNCTION set_default_address(p_address_id UUID, p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First, set all addresses for the user to non-default
  UPDATE addresses
  SET is_default = false
  WHERE user_id = p_user_id;
  
  -- Then set the specified address as default
  UPDATE addresses
  SET is_default = true
  WHERE id = p_address_id AND user_id = p_user_id;
  
  -- Verify the update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Address not found or does not belong to user';
  END IF;
END;
$$;

-- Create RLS policies for addresses table
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own addresses"
  ON addresses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON addresses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON addresses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON addresses
  FOR DELETE
  USING (auth.uid() = user_id);