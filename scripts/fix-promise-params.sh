#!/bin/bash

# Find all .tsx files with Promise<> params issues
find ./app -type f -name "*.tsx" | xargs grep -l "params: Promise<" | while read -r file; do
  echo "Processing $file"
  
  # Create a temporary file
  temp_file=$(mktemp)
  
  # Fix Promise<> in client components
  if grep -q '"use client"' "$file"; then
    # Client component - remove Promise<>
    sed 's/params: Promise<\(.*\)>/params: \1/g' "$file" | \
    sed 's/searchParams: Promise<\(.*\)>/searchParams: \1/g' > "$temp_file"
    
    # Fix useEffect with await params
    sed -i '' 's/await props\.params/props.params/g' "$temp_file"
    sed -i '' 's/await props\.searchParams/props.searchParams/g' "$temp_file"
  else
    # Server component - keep Promise<> but fix async handling 
    cat "$file" > "$temp_file"
  fi
  
  # Replace the original file with the temporary file
  mv "$temp_file" "$file"
  
  echo "Fixed $file"
done

echo "Completed fixing Promise params issues" 