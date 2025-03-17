#!/bin/bash

# Find all TypeScript and TypeScript React files that import createServerSupabaseClient
FILES=$(find . -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*createServerSupabaseClient.*from")

# Loop through each file
for file in $FILES; do
  echo "Processing file: $file"
  
  # Add await to all instances of createServerSupabaseClient()
  sed -i '' 's/const supabase = createServerSupabaseClient()/const supabase = await createServerSupabaseClient()/g' "$file"
  sed -i '' 's/let supabase = createServerSupabaseClient()/let supabase = await createServerSupabaseClient()/g' "$file"
  sed -i '' 's/var supabase = createServerSupabaseClient()/var supabase = await createServerSupabaseClient()/g' "$file"
  
  # Handle edge cases where the result is immediately awaited
  sed -i '' 's/await createServerSupabaseClient()/await createServerSupabaseClient()/g' "$file"
  
  echo "Updated file: $file"
done

echo "All files updated successfully!" 