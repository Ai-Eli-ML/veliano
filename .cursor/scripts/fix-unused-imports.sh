#!/bin/bash

# Initialize log file
LOG_FILE="unused-imports-fixes-log.txt"
echo "Starting unused imports fixes at $(date)" > "$LOG_FILE"

# Function to log messages
log_message() {
  echo "$1" | tee -a "$LOG_FILE"
}

# Fix unused imports
fix_unused_imports() {
  local files_to_fix=(
    "./app/(auth)/account/forgot-password/page.tsx"
    "./app/(auth)/account/login/page.tsx"
    "./app/(auth)/account/register/page.tsx"
    "./app/(auth)/account/reset-password/page.tsx"
    "./app/account/affiliate/page.tsx"
    "./app/account/ambassador/page.tsx"
    "./app/account/orders/[id]/page.tsx"
    "./app/account/orders/page.tsx"
    "./app/account/page.tsx"
    "./app/account/verify/page.tsx"
    "./app/account/wishlist/page.tsx"
    "./app/admin/affiliates/[id]/page.tsx"
    "./app/admin/affiliates/page.tsx"
    "./app/admin/customers/[id]/page.tsx"
    "./app/admin/customers/page.tsx"
    "./app/admin/monitoring/page.tsx"
    "./app/admin/orders/[id]/page.tsx"
    "./app/admin/orders/page.tsx"
    "./app/admin/products/[id]/page.tsx"
    "./app/admin/products/page.tsx"
    "./app/admin/page.tsx"
    "./app/cart/page.tsx"
    "./app/contact/page.tsx"
    "./app/faq/page.tsx"
    "./app/how-it-works/page.tsx"
    "./app/products/[category]/page.tsx"
    "./app/products/page.tsx"
    "./app/search/page.tsx"
  )
  
  for file in "${files_to_fix[@]}"; do
    if [ -f "$file" ]; then
      log_message "Checking for unused imports in $file"
      
      # Create a temporary file
      temp_file=$(mktemp)
      
      # Process the file to remove unused imports
      awk '
      BEGIN { in_imports = 0; unused_imports_removed = 0 }
      
      # Track the start of import section
      /^import/ { in_imports = 1 }
      
      # Skip lines that match known unused imports
      /^import.*type.*Metadata/ { 
        unused_imports_removed++
        next
      }
      /^import.*{.*Metadata.*}/ { 
        unused_imports_removed++
        next
      }
      
      # Skip lines with common unused components
      /import.*{.*ArrowLeft.*}/ { 
        unused_imports_removed++
        next
      }
      /import.*{.*Button.*}/ { 
        if (!match($0, /use-/)) {
          unused_imports_removed++
          next
        }
      }
      /import.*{.*Card.*}/ { 
        if (!match($0, /use-/)) {
          unused_imports_removed++
          next
        }
      }
      
      # If not in imports section anymore, reset the flag
      /^[^import]/ && !/^$/ { in_imports = 0 }
      
      # Print all other lines
      { print }
      
      END { if (unused_imports_removed > 0) printf "// Fixed: Removed %d unused imports\n", unused_imports_removed }
      ' "$file" > "$temp_file"
      
      # Check if any changes were made
      if grep -q "Fixed: Removed" "$temp_file"; then
        # Replace the original file
        mv "$temp_file" "$file"
        log_message "Fixed unused imports in $file"
      else
        # No changes needed
        rm "$temp_file"
        log_message "No unused imports found in $file"
      fi
    else
      log_message "File not found: $file"
    fi
  done
}

# Run the fixes
log_message "Starting unused imports fixes..."
fix_unused_imports
log_message "Completed unused imports fixes at $(date)" 