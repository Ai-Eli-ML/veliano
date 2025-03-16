#!/bin/bash

# Find all page.tsx files
find ./app -type f -name "page.tsx" | while read -r file; do
  # Create a temporary file
  temp_file=$(mktemp)

  # Remove "use client" directive and metadata export
  grep -v '"use client"' "$file" | grep -v 'export const metadata' > "$temp_file"

  # Add metadata export at the top
  if grep -q "metadata = {" "$file"; then
    metadata_content=$(sed -n '/metadata = {/,/}/p' "$file")
    echo "export const metadata = $metadata_content" > "$temp_file.new"
    echo "" >> "$temp_file.new"
    echo '"use client"' >> "$temp_file.new"
    echo "" >> "$temp_file.new"
    cat "$temp_file" >> "$temp_file.new"
    mv "$temp_file.new" "$temp_file"
  fi

  # Replace the original file with the temporary file
  mv "$temp_file" "$file"
done 