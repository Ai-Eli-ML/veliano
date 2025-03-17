#!/bin/bash

# Find client components with metadata exports
find ./app -type f -name "*.tsx" | xargs grep -l '"use client"' | xargs grep -l "generateMetadata" | while read -r file; do
  echo "Processing $file"
  
  # Get directory of the file
  dir=$(dirname "$file")
  base=$(basename "$file" .tsx)
  
  # Create metadata.ts file only if it doesn't exist
  metadata_file="$dir/metadata.ts"
  if [ ! -f "$metadata_file" ]; then
    echo "Creating $metadata_file"
    
    # Extract imports needed for metadata
    echo 'import type { Metadata } from "next"' > "$metadata_file"
    grep -n "import.*Metadata" "$file" >> "$metadata_file" || true
    grep -n "import.*createClient" "$file" >> "$metadata_file" || true
    grep -n "import.*Database" "$file" >> "$metadata_file" || true
    echo "" >> "$metadata_file"
    
    # Extract generateMetadata function
    sed -n '/export async function generateMetadata/,/^}/p' "$file" >> "$metadata_file"
  fi
  
  # Create a temporary file to modify the original
  temp_file=$(mktemp)
  
  # Remove generateMetadata from the client component
  sed '/export async function generateMetadata/,/^}/d' "$file" > "$temp_file"
  
  # Remove the metadata import if it's not used elsewhere
  if ! grep -q "Metadata.*=" "$temp_file"; then
    sed -i '' '/import.*Metadata/d' "$temp_file"
  fi
  
  # Replace the original file with the temporary file
  mv "$temp_file" "$file"
  
  echo "Fixed $file"
done

echo "Completed separating metadata from client components" 