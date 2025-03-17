#!/bin/bash

# Log file for operations
log_file="multiline-imports-fixes-log.txt"
echo "Multiline Imports Fixes Log - $(date)" > "$log_file"
echo "=================================" >> "$log_file"

# Function to log and display messages
log_message() {
  echo "$1"
  echo "$(date +"%H:%M:%S") - $1" >> "$log_file"
}

log_message "Starting multiline imports fixes..."

# Fix multi-line import statements
find ./app -type f -name "*.tsx" | while read -r file; do
  # Check for multi-line import statements
  if grep -q "} from" "$file"; then
    log_message "Found multi-line import statement in: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Keep "use client" directive if present
    if grep -q '"use client"' "$file"; then
      echo '"use client"' > "$temp_file"
      echo "" >> "$temp_file"
    fi
    
    # Process the file line by line
    awk '
    BEGIN { in_import = 0; import_from = ""; import_items = ""; }
    
    # Start of a multi-line import
    /^[^\/]*{/ && !in_import && !/} from/ {
      in_import = 1
      import_items = substr($0, index($0, "{"))
      next
    }
    
    # Middle of a multi-line import
    in_import && !/} from/ {
      import_items = import_items " " $0
      next
    }
    
    # End of a multi-line import
    in_import && /} from/ {
      import_from = $0
      gsub(/^[^"]*"/, "\"", import_from)
      print "import " import_items " " import_from
      in_import = 0
      import_items = ""
      import_from = ""
      next
    }
    
    # Single-line import
    /^import/ && /} from/ && !in_import {
      print
      next
    }
    
    # Not an import line
    !/^import/ || in_import {
      print
    }
    ' "$file" > "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    log_message "Fixed multi-line import statement in: $file"
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
    log_message "Fixing admin page with manual approach: $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Keep "use client" directive if present
    if grep -q '"use client"' "$file"; then
      echo '"use client"' > "$temp_file"
      echo "" >> "$temp_file"
    fi
    
    # Extract all single-line imports
    grep "^import.*from" "$file" | grep -v "{" | grep -v "}" >> "$temp_file"
    
    # Add imports for UI components
    if grep -q "from \"@/components/ui/table\"" "$file"; then
      echo 'import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"' >> "$temp_file"
    fi
    
    if grep -q "from \"@/components/ui/select\"" "$file"; then
      echo 'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"' >> "$temp_file"
    fi
    
    if grep -q "from \"lucide-react\"" "$file"; then
      echo 'import { ArrowLeft, User, DollarSign, Package, Settings, Users, ShoppingCart, LogOut, UserPlus, LineChart } from "lucide-react"' >> "$temp_file"
    fi
    
    echo "" >> "$temp_file"
    
    # Add the rest of the file without imports and "use client"
    sed '/^import/d' "$file" | grep -v '"use client"' | grep -v "^}.*from" >> "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$file"
    
    log_message "Fixed admin page with manual approach: $file"
  fi
done

log_message "Completed multiline imports fixes" 