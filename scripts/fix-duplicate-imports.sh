#!/bin/bash

# Initialize log file
LOG_FILE="duplicate-imports-fixes-log.txt"
echo "Starting duplicate imports fixes at $(date)" > "$LOG_FILE"

# Function to log messages
log_message() {
  echo "$1" | tee -a "$LOG_FILE"
}

# List of admin pages to fix
ADMIN_PAGES=(
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

# Fix each admin page
for file in "${ADMIN_PAGES[@]}"; do
  if [ -f "$file" ]; then
    log_message "Fixing duplicate imports in $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Extract the "use client" directive if it exists
    if grep -q "\"use client\"" "$file"; then
      echo "\"use client\"" > "$temp_file"
      echo "" >> "$temp_file"
    else
      # Initialize empty file
      > "$temp_file"
    fi
    
    # Extract all import statements (only the first occurrence of each)
    grep -n "^import " "$file" | sort -n | uniq -f 1 | sort -n | cut -d: -f2- >> "$temp_file"
    
    # Add a blank line after imports
    echo "" >> "$temp_file"
    
    # Extract the rest of the file after imports (excluding any duplicate component imports)
    in_imports=false
    component_imports_end=$(grep -n "SelectValue," "$file" | tail -1 | cut -d: -f1)
    
    if [ -z "$component_imports_end" ]; then
      component_imports_end=$(grep -n "TableRow," "$file" | tail -1 | cut -d: -f1)
    fi
    
    if [ -z "$component_imports_end" ]; then
      component_imports_end=0
    fi
    
    # Add 1 to component_imports_end to get the line after the last import
    component_imports_end=$((component_imports_end + 1))
    
    # Extract content after the duplicate imports
    if [ "$component_imports_end" -gt 0 ]; then
      tail -n +$component_imports_end "$file" | grep -v "^import " | grep -v "^  [A-Za-z]" >> "$temp_file"
    else
      # If we couldn't find component imports, just get everything after the regular imports
      awk 'BEGIN{found=0} /^import /{ if(!found) found=1 } { if(!found) print }' "$file" > /dev/null
      awk 'BEGIN{found=0} /^import /{ if(!found) found=1 } { if(found && !/^import /) print }' "$file" | grep -v "^  [A-Za-z]" >> "$temp_file"
    fi
    
    # Replace the original file with the fixed version
    mv "$temp_file" "$file"
    log_message "Fixed duplicate imports in $file"
  else
    log_message "File not found: $file"
  fi
done

log_message "Completed duplicate imports fixes at $(date)" 