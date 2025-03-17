#!/bin/bash

# Log file for operations
log_file="server-imports-fixes-log.txt"
echo "Server Imports Fixes Log - $(date)" > "$log_file"
echo "=================================" >> "$log_file"

# Function to log and display messages
log_message() {
  echo "$1"
  echo "$(date +"%H:%M:%S") - $1" >> "$log_file"
}

log_message "Starting server imports fixes..."

# Fix server component imports in client components
find ./app -type f -name "*.tsx" | xargs grep -l '"use client"' | while read -r file; do
  # Check if the file has server-only imports
  if grep -q "import.*next/headers" "$file"; then
    log_message "Found server-only imports in client component: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Remove the "use client" directive
    grep -v '"use client"' "$file" > "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    log_message "Removed 'use client' directive from: $file"
  fi
  
  # Check for duplicate createClient imports
  if grep -c "import.*createClient" "$file" | grep -q -v "^1$"; then
    log_message "Found duplicate createClient imports in: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Keep "use client" directive if present
    if grep -q '"use client"' "$file"; then
      echo '"use client"' > "$temp_file"
      echo "" >> "$temp_file"
    fi
    
    # Add all imports except duplicate createClient
    awk '
    BEGIN { seen_client = 0 }
    /import.*createClient.*lib\/supabase\/client/ {
      if (seen_client == 0) {
        print
        seen_client = 1
      }
      next
    }
    /import.*createClient/ {
      if (seen_client == 0) {
        print
        seen_client = 1
      }
      next
    }
    /^import/ { print }
    ' "$file" >> "$temp_file"
    
    echo "" >> "$temp_file"
    
    # Add the rest of the file without imports and "use client"
    sed '/^import/d' "$file" | grep -v '"use client"' >> "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    log_message "Fixed duplicate createClient imports in: $file"
  fi
done

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
done

log_message "Completed server imports fixes" 