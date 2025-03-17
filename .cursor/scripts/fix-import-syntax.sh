#!/bin/bash

# Log file for operations
log_file="import-syntax-fixes-log.txt"
echo "Import Syntax Fixes Log - $(date)" > "$log_file"
echo "=================================" >> "$log_file"

# Function to log and display messages
log_message() {
  echo "$1"
  echo "$(date +"%H:%M:%S") - $1" >> "$log_file"
}

log_message "Starting import syntax fixes..."

# Fix syntax errors in import statements
find ./app -type f -name "*.tsx" | while read -r file; do
  # Check for syntax errors in import statements
  if grep -q "import {" "$file" && grep -q "import { import" "$file"; then
    log_message "Found syntax error in import statement: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Fix the syntax error
    sed 's/import {\s*import/import/g' "$file" > "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    log_message "Fixed syntax error in import statement: $file"
  fi
  
  # Check for broken import blocks
  if grep -q "^import {$" "$file"; then
    log_message "Found broken import block in: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Keep "use client" directive if present
    if grep -q '"use client"' "$file"; then
      echo '"use client"' > "$temp_file"
      echo "" >> "$temp_file"
    fi
    
    # Add all imports except broken ones
    grep "^import " "$file" | grep -v "^import {$" >> "$temp_file"
    echo "" >> "$temp_file"
    
    # Add the rest of the file without imports and "use client"
    sed '/^import/d' "$file" | grep -v '"use client"' >> "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    log_message "Fixed broken import block in: $file"
  fi
done

# Fix specific admin pages with syntax errors
admin_pages=(
  "./app/admin/affiliates/page.tsx"
  "./app/admin/customers/[id]/page.tsx"
  "./app/admin/customers/page.tsx"
  "./app/admin/layout.tsx"
  "./app/admin/monitoring/page.tsx"
  "./app/admin/orders/[id]/page.tsx"
  "./app/admin/orders/page.tsx"
  "./app/admin/products/[id]/page.tsx"
  "./app/admin/products/page.tsx"
)

for file in "${admin_pages[@]}"; do
  if [ -f "$file" ]; then
    log_message "Fixing admin page: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Keep "use client" directive if present
    if grep -q '"use client"' "$file"; then
      echo '"use client"' > "$temp_file"
      echo "" >> "$temp_file"
    fi
    
    # Extract all import lines and fix them
    grep "^import " "$file" | grep -v "^import {$" | sort | uniq >> "$temp_file"
    echo "" >> "$temp_file"
    
    # Add the rest of the file without imports and "use client"
    sed '/^import/d' "$file" | grep -v '"use client"' >> "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    log_message "Fixed admin page: $file"
  fi
done

log_message "Completed import syntax fixes" 