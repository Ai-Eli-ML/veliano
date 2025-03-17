#!/bin/bash

# Log file for all operations
log_file="next15-fixes-log.txt"
echo "Next.js 15 Fixes Log - $(date)" > "$log_file"
echo "=============================" >> "$log_file"

echo "Starting Next.js 15 migration fixes..."

# Function to log and display messages
log_message() {
  echo "$1"
  echo "$(date +"%H:%M:%S") - $1" >> "$log_file"
}

# Make scripts executable
chmod +x ./scripts/fix-promise-params.sh
chmod +x ./scripts/fix-client-metadata.sh
chmod +x ./scripts/update-supabase-imports.sh
chmod +x ./scripts/fix-metadata.sh
chmod +x ./scripts/fix-page-metadata.sh
chmod +x ./scripts/fix-use-client.sh
chmod +x ./scripts/audit-types.sh

# 1. Run the client/metadata separation script
log_message "Step 1: Separating metadata from client components..."
./scripts/fix-client-metadata.sh
echo "" >> "$log_file"

# 2. Fix Promise params in client components
log_message "Step 2: Fixing Promise params issues..."
./scripts/fix-promise-params.sh
echo "" >> "$log_file"

# 3. Update Supabase imports
log_message "Step 3: Updating Supabase imports..."
./scripts/update-supabase-imports.sh
echo "" >> "$log_file"

# 4. Fix metadata format
log_message "Step 4: Fixing metadata format..."
./scripts/fix-metadata.sh
echo "" >> "$log_file"

# 5. Fix page metadata
log_message "Step 5: Fixing page metadata..."
./scripts/fix-page-metadata.sh
echo "" >> "$log_file"

# 6. Fix any "use client" directive misplacements
log_message "Step 6: Fixing use client directives..."
./scripts/fix-use-client.sh
echo "" >> "$log_file"

# 7. Fix double awaits - common issue in Next.js 15
log_message "Step 7: Fixing double awaits..."
find ./app -type f -name "*.tsx" | xargs grep -l "await.*await" | while read -r file; do
  log_message "Fixing double awaits in $file"
  # Create a temporary file
  temp_file=$(mktemp)
  # Fix common double await patterns
  sed 's/await (await/await/g' "$file" | \
  sed 's/const \(.*\) = await await/const \1 = await/g' | \
  sed 's/const { \(.*\) } = await await/const { \1 } = await/g' > "$temp_file"
  # Replace the original file
  mv "$temp_file" "$file"
done
echo "" >> "$log_file"

# 8. Run audit for further analysis
log_message "Step 8: Running type audit..."
./scripts/audit-types.sh
echo "" >> "$log_file"

log_message "Step 9: Checking for and fixing metadata imports..."
find ./app -type f -name "*.tsx" | while read -r file; do
  if grep -q '"use client"' "$file" && grep -q "import.*Metadata.*from \"next\"" "$file"; then
    dir=$(dirname "$file")
    if [ -f "$dir/metadata.ts" ]; then
      log_message "Removing Metadata import from client component: $file"
      temp_file=$(mktemp)
      sed '/import.*Metadata.*from "next"/d' "$file" > "$temp_file"
      mv "$temp_file" "$file"
    fi
  fi
done
echo "" >> "$log_file"

# 10. Run the TypeScript compiler to check for remaining issues
log_message "Step 10: Running TypeScript compiler to check for remaining issues..."
npx tsc --noEmit >> "$log_file" 2>&1
echo "" >> "$log_file"

# 11. Build the project to check for other issues
log_message "Step 11: Running build to verify fixes..."
npm run build >> "$log_file" 2>&1
build_result=$?

if [ $build_result -eq 0 ]; then
  log_message "Build completed successfully!"
else
  log_message "Build completed with errors. Please check the log file for details."
fi

echo ""
log_message "All automated fixes complete. Please review the log file: $log_file"
log_message "Note: Some issues may still require manual fixes." 