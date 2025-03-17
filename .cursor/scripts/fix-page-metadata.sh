#!/bin/bash

# Find all page.tsx files
find ./app -type f -name "page.tsx" | while read -r file; do
  # Skip files that don't have metadata
  if ! grep -q "metadata" "$file"; then
    continue
  fi

  # Create a temporary file
  temp_file=$(mktemp)

  # Add imports and metadata at the top
  echo 'import type { Metadata } from "next"' > "$temp_file"
  
  # Copy all other imports
  grep "^import" "$file" >> "$temp_file"
  echo "" >> "$temp_file"

  # Extract and add metadata
  sed -n '/metadata = {/,/}/p' "$file" | sed 's/metadata = {/metadata: Metadata = {/' >> "$temp_file"
  echo "" >> "$temp_file"

  # Add use client directive
  echo '"use client"' >> "$temp_file"
  echo "" >> "$temp_file"

  # Add the rest of the file, excluding imports and metadata
  sed '1,/metadata = {/d' "$file" | sed '1,/}/d' >> "$temp_file"

  # Replace the original file with the temporary file
  mv "$temp_file" "$file"
done 