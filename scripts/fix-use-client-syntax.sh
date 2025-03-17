#!/bin/bash

# Log file for operations
log_file="use-client-syntax-fixes-log.txt"
echo "Use Client Syntax Fixes Log - $(date)" > "$log_file"
echo "=================================" >> "$log_file"

# Function to log and display messages
log_message() {
  echo "$1"
  echo "$(date +"%H:%M:%S") - $1" >> "$log_file"
}

log_message "Starting use client syntax fixes..."

# Find all files with "use client" directive
find ./app -type f -name "*.tsx" | xargs grep -l "\"use client\"" | while read -r file; do
  log_message "Checking $file"
  
  # Check if there's a syntax error pattern
  if grep -q "\"use client\";" "$file" || ! grep -q "\"use client\"\s*$" "$file"; then
    log_message "Fixing syntax in $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Fix the "use client" directive to ensure it's properly isolated
    awk '{
      if ($0 ~ /"use client"/) {
        # Remove any semicolons or other characters after "use client"
        sub(/;.*$/, "", $0)
        # Print just the "use client" directive
        print "\"use client\""
        # Print an empty line for separation
        print ""
      } else {
        print $0
      }
    }' "$file" > "$temp_file"
    
    # Replace the original file with the fixed version
    mv "$temp_file" "$file"
    log_message "Fixed $file"
  fi
done

# Now fix JSX elements after use client to ensure they have proper spacing
find ./app -type f -name "*.tsx" | xargs grep -l "\"use client\"" | while read -r file; do
  # Check for JSX without proper spacing after imports
  if grep -q "import.*from.*\".*\"\s*<" "$file"; then
    log_message "Fixing JSX spacing in $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Add proper spacing before JSX elements
    awk '{
      if ($0 ~ /import.*from.*".*"/ && $0 ~ /</) {
        # Split the line at the JSX start
        import_part = $0
        sub(/<.*$/, "", import_part)
        jsx_part = $0
        sub(/^.*import.*from.*".*"/, "", jsx_part)
        # Print the import and JSX parts with a blank line between
        print import_part
        print ""
        print jsx_part
      } else {
        print $0
      }
    }' "$file" > "$temp_file"
    
    # Replace the original file with the fixed version
    mv "$temp_file" "$file"
    log_message "Fixed JSX spacing in $file"
  fi
done

log_message "Completed use client syntax fixes" 