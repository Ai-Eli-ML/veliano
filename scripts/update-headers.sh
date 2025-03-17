#!/bin/bash

# Find all TypeScript and TypeScript React files that import headers from next/headers
FILES=$(find ./app -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*headers.*from.*next/headers")

# Loop through each file
for file in $FILES; do
  echo "Processing file: $file"
  
  # Replace direct headers() calls with awaited version
  sed -i '' 's/headers()/await headers()/g' "$file"
  sed -i '' 's/const headersList = await headers()/const headersList = await headers()/g' "$file"
  
  echo "Updated file: $file"
done

echo "All files updated successfully!" 