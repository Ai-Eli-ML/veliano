#!/bin/bash

# Log file for operations
log_file="metadata-exports-fixes-log.txt"
echo "Metadata Exports Fixes Log - $(date)" > "$log_file"
echo "=================================" >> "$log_file"

# Function to log and display messages
log_message() {
  echo "$1"
  echo "$(date +"%H:%M:%S") - $1" >> "$log_file"
}

log_message "Starting metadata exports fixes..."

# Fix metadata exports in client components
find ./app -type f -name "*.tsx" | xargs grep -l '"use client"' | while read -r file; do
  # Check if the file has metadata exports
  if grep -q "export.*metadata" "$file" || grep -q "export.*generateMetadata" "$file"; then
    log_message "Found metadata export in client component: $file"
    
    # Create directory for metadata file
    dir=$(dirname "$file")
    metadata_file="$dir/metadata.ts"
    
    # Create metadata file if it doesn't exist
    if [ ! -f "$metadata_file" ]; then
      log_message "Creating metadata file: $metadata_file"
      
      # Add imports
      echo 'import type { Metadata } from "next"' > "$metadata_file"
      
      # Add any database imports if needed
      if grep -q "supabase" "$file"; then
        echo 'import { createClient } from "@/lib/supabase/client"' >> "$metadata_file"
      fi
      
      if grep -q "Database" "$file"; then
        echo 'import type { Database } from "@/types/supabase"' >> "$metadata_file"
      fi
      
      echo "" >> "$metadata_file"
      
      # Extract and add interfaces/types if needed
      if grep -q "interface.*Props" "$file"; then
        grep -A 5 "interface.*Props" "$file" | grep -v "use client" >> "$metadata_file"
        echo "" >> "$metadata_file"
      fi
      
      # Extract metadata or generateMetadata
      if grep -q "export const metadata" "$file"; then
        sed -n '/export const metadata/,/}/p' "$file" >> "$metadata_file"
      elif grep -q "export async function generateMetadata" "$file"; then
        sed -n '/export async function generateMetadata/,/^}/p' "$file" >> "$metadata_file"
      fi
    fi
    
    # Create a temporary file to modify the original
    temp_file=$(mktemp)
    
    # Remove metadata exports from client component
    sed '/export const metadata/,/}/d' "$file" | sed '/export async function generateMetadata/,/^}/d' > "$temp_file"
    
    # Remove metadata import if not used elsewhere
    if ! grep -q "Metadata.*=" "$temp_file"; then
      sed -i '' '/import.*Metadata/d' "$temp_file"
    fi
    
    # Replace the original file with the modified version
    mv "$temp_file" "$file"
    
    log_message "Removed metadata export from: $file"
  fi
done

# Fix syntax errors in auth pages
find ./app/\(auth\) -type f -name "*.tsx" | while read -r file; do
  if grep -q "title:" "$file" && grep -q "description:" "$file"; then
    log_message "Fixing syntax in auth page: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Extract metadata content
    metadata_content=$(sed -n '/title:/,/}/p' "$file")
    
    # Remove the metadata content from the file
    sed '/title:/,/}/d' "$file" > "$temp_file"
    
    # Add proper metadata export at the top
    echo 'import type { Metadata } from "next"' > "$temp_file.new"
    echo "" >> "$temp_file.new"
    echo "export const metadata: Metadata = {" >> "$temp_file.new"
    echo "$metadata_content" >> "$temp_file.new"
    echo "" >> "$temp_file.new"
    echo '"use client"' >> "$temp_file.new"
    echo "" >> "$temp_file.new"
    
    # Add the rest of the file
    cat "$temp_file" >> "$temp_file.new"
    
    # Replace the original file
    mv "$temp_file.new" "$file"
    
    log_message "Fixed syntax in: $file"
  fi
done

log_message "Completed metadata exports fixes" 