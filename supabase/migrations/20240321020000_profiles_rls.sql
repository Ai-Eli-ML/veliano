-- Enable RLS for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Admin access policy
CREATE POLICY "Admin full access" ON profiles
FOR ALL USING ( EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND is_admin = true
)) WITH CHECK (true);

-- User self-service policy
CREATE POLICY "User self-service" ON profiles
FOR ALL USING (id = auth.uid()) 
WITH CHECK (id = auth.uid()); 