#!/bin/bash

# Script to find and fix double awaits in TypeScript/JavaScript files
# Created for debugging Next.js 15 async API issues

echo "Looking for files with potential double await issues..."

# Find files with potential double awaits
POTENTIAL_FILES=$(grep -r "await await" --include="*.ts" --include="*.tsx" --include="*.js" .)

if [ -z "$POTENTIAL_FILES" ]; then
  echo "No files with double awaits found."
  exit 0
fi

echo "Found files with potential double awaits:"
echo "$POTENTIAL_FILES"
echo ""

read -p "Do you want to fix these files? (y/n): " CONFIRM
if [[ $CONFIRM != "y" && $CONFIRM != "Y" ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Find and replace double awaits
FILES_WITH_DOUBLE_AWAITS=$(grep -l "await await" --include="*.ts" --include="*.tsx" --include="*.js" .)

for file in $FILES_WITH_DOUBLE_AWAITS; do
  echo "Processing file: $file"
  
  # Create backup
  cp "$file" "${file}.bak"
  
  # Replace double awaits
  sed -i '' 's/await await/await/g' "$file"
  
  # Check if the file was actually changed
  if cmp -s "$file" "${file}.bak"; then
    echo "No changes made to $file"
    rm "${file}.bak"
  else
    echo "Fixed double awaits in $file"
    echo "Backup saved as ${file}.bak"
  fi
done

echo "All double awaits have been fixed!"
echo "Please run your tests to verify everything works correctly."
echo "You can delete backup files with: find . -name '*.bak' -delete" 