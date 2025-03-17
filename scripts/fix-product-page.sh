#!/bin/bash

# Log file for operations
log_file="product-page-fixes-log.txt"
echo "Product Page Fixes Log - $(date)" > "$log_file"
echo "===============================" >> "$log_file"

# Function to log and display messages
log_message() {
  echo "$1"
  echo "$(date +"%H:%M:%S") - $1" >> "$log_file"
}

product_page="./app/products/[category]/[slug]/page.tsx"
metadata_file="./app/products/[category]/[slug]/metadata.ts"

# Check if the product page exists
if [ ! -f "$product_page" ]; then
  log_message "Error: Product page not found at $product_page"
  exit 1
fi

log_message "Starting product page fixes..."

# 1. Extract metadata to separate file if it exists
if grep -q "generateMetadata" "$product_page"; then
  log_message "Extracting metadata to separate file..."
  
  # Create metadata.ts
  echo 'import type { Metadata } from "next"' > "$metadata_file"
  echo 'import { createClient } from "@/lib/supabase/client"' >> "$metadata_file"
  echo 'import type { Database } from "@/types/supabase"' >> "$metadata_file"
  echo '' >> "$metadata_file"
  
  # Extract and add interface
  if grep -q "interface ProductPageProps" "$product_page"; then
    grep -A 3 "interface ProductPageProps" "$product_page" >> "$metadata_file"
    echo '' >> "$metadata_file"
  fi
  
  # Extract metadata function
  sed -n '/export async function generateMetadata/,/^}/p' "$product_page" >> "$metadata_file"
  
  # Remove from original
  temp_file=$(mktemp)
  sed '/export async function generateMetadata/,/^}/d' "$product_page" > "$temp_file"
  mv "$temp_file" "$product_page"
  
  log_message "Metadata function extracted to $metadata_file"
fi

# 2. Fix Promise interface in client component
if grep -q '"use client"' "$product_page" && grep -q "params: Promise<" "$product_page"; then
  log_message "Fixing Promise params in client component..."
  
  temp_file=$(mktemp)
  sed 's/params: Promise<\(.*\)>/params: \1/g' "$product_page" | \
  sed 's/searchParams: Promise<\(.*\)>/searchParams: \1/g' > "$temp_file"
  
  # Fix any await props.params
  sed -i '' 's/await props\.params/props.params/g' "$temp_file"
  sed -i '' 's/await props\.searchParams/props.searchParams/g' "$temp_file"
  
  mv "$temp_file" "$product_page"
  log_message "Promise params fixed in client component"
fi

# 3. Fix types
log_message "Checking and updating types in product page..."

# Ensure we're using the right database types
if ! grep -q "type DbProduct =" "$product_page"; then
  log_message "Adding correct database type definitions..."
  
  temp_file=$(mktemp)
  awk '
  /interface ExtendedProduct/ {
    print "type DbProduct = Database[\"public\"][\"Tables\"][\"products\"][\"Row\"]"
    print "type DbCategory = Database[\"public\"][\"Tables\"][\"categories\"][\"Row\"]"
    print "type DbProductImage = Database[\"public\"][\"Tables\"][\"product_images\"][\"Row\"]"
    print ""
    print $0
    next
  }
  { print }
  ' "$product_page" > "$temp_file"
  
  mv "$temp_file" "$product_page"
fi

# 4. Fix supabase queries
log_message "Checking Supabase queries..."

if grep -q "await supabase" "$product_page"; then
  temp_file=$(mktemp)
  sed 's/\.from(.*) *\.select("\*")/\.from\1.select()/g' "$product_page" > "$temp_file"
  mv "$temp_file" "$product_page"
  log_message "Updated select queries to use correct format"
fi

# 5. Run TypeScript checker on just this file
log_message "Running TypeScript check on product page..."
npx tsc "$product_page" --noEmit --skipLibCheck >> "$log_file" 2>&1

log_message "Product page fixes complete. Please review the log file: $log_file" 