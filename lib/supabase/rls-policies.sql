-- Profiles table policies
-- Enable RLS on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to view basic profile data
CREATE POLICY "Allow users to view profiles" 
ON profiles FOR SELECT 
TO authenticated 
USING (true);

-- Allow users to manage their own profile
CREATE POLICY "Allow users to insert their own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to delete their own profile (if needed)
CREATE POLICY "Allow users to delete own profile" 
ON profiles FOR DELETE 
TO authenticated 
USING (auth.uid() = id);

-- Allow service role or system processes to manage all profiles
CREATE POLICY "Allow system to manage all profiles" 
ON profiles 
TO service_role 
USING (true)
WITH CHECK (true); 