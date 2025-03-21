-- Enable RLS for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Admin access policy
CREATE POLICY "Admins can manage all profiles" ON profiles
FOR ALL USING ( EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND is_admin = true
));

-- User self-service policy
CREATE POLICY "Users can manage their own profile" ON profiles
FOR ALL USING (id = auth.uid()); 