#!/bin/bash

# Find all TypeScript and JavaScript files in the app directory
find ./app -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
  # Skip files that don't need "use client"
  if [[ "$file" == *"/api/"* ]] || [[ "$file" == *".d.ts" ]] || [[ "$file" == *"types.ts" ]]; then
    continue
  fi

  # Create a temporary file
  temp_file=$(mktemp)

  # Add "use client" directive at the top if it doesn't exist
  echo '"use client"' > "$temp_file"
  echo "" >> "$temp_file"

  # Remove any existing "use client" directive and append the rest of the file
  grep -v '"use client"' "$file" >> "$temp_file"

  # Replace the original file with the temporary file
  mv "$temp_file" "$file"
done 