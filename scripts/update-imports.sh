#!/bin/bash

# Find all TypeScript and TypeScript React files that import createServerSupabaseClient from @/lib/supabase
FILES=$(find . -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*createServerSupabaseClient.*from.*@/lib/supabase")

# Loop through each file and update the import
for file in $FILES; do
  echo "Updating $file"
  # Replace the import statement
  sed -i '' 's/import { createServerSupabaseClient } from "@\/lib\/supabase"/import { createServerSupabaseClient } from "@\/lib\/supabase-server"/g' "$file"
  sed -i '' 's/import { createServerSupabaseClient, /import { /g' "$file"
  sed -i '' 's/import {createServerSupabaseClient, /import {/g' "$file"
done

echo "All imports updated!" 