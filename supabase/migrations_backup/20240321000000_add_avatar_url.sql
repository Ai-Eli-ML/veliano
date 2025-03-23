-- Add avatar_url column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comment to the column
COMMENT ON COLUMN profiles.avatar_url IS 'URL of the user''s avatar image';

-- Update RLS policies to allow users to update their own avatar_url
CREATE POLICY "Users can update their own avatar_url"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow public read access to avatar_url
CREATE POLICY "Avatar URLs are publicly viewable"
ON profiles
FOR SELECT
USING (true);

-- Add validation for avatar_url format
ALTER TABLE profiles
ADD CONSTRAINT avatar_url_format CHECK (
  avatar_url IS NULL OR 
  avatar_url ~ '^https?://.+' -- Ensures URL starts with http:// or https://
); 