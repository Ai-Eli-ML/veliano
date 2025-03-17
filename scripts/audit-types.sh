#!/bin/bash

echo "Scanning for unused types and imports..."

# Create a report file
report_file="type-issues-report.txt"
echo "Type Issues Report - $(date)" > "$report_file"
echo "===============================" >> "$report_file"

# Find defined but unused types
echo -e "\n\nTypes defined but never used:" >> "$report_file"
find ./app ./components ./lib ./types -type f -name "*.ts*" | xargs grep -l "type\s\+[A-Z]" | while read -r file; do
  # Extract defined types
  types=$(grep -o "type\s\+[A-Z][A-Za-z0-9_]*" "$file" | awk '{print $2}' | sort | uniq)
  
  for type in $types; do
    # Count how many times the type is used
    uses=$(grep -c "\b$type\b" "$file")
    if [ $uses -le 1 ]; then
      echo "$file: $type is potentially unused" >> "$report_file"
    fi
  done
done

# Find defined but unused interfaces
echo -e "\n\nInterfaces defined but never used:" >> "$report_file"
find ./app ./components ./lib ./types -type f -name "*.ts*" | xargs grep -l "interface\s\+[A-Z]" | while read -r file; do
  # Extract defined interfaces
  interfaces=$(grep -o "interface\s\+[A-Z][A-Za-z0-9_]*" "$file" | awk '{print $2}' | sort | uniq)
  
  for interface in $interfaces; do
    # Count how many times the interface is used
    uses=$(grep -c "\b$interface\b" "$file")
    if [ $uses -le 1 ]; then
      echo "$file: $interface is potentially unused" >> "$report_file"
    fi
  done
done

# Find imports from components/ui
echo -e "\n\nComponents imported but potentially unused:" >> "$report_file"
find ./app ./components -type f -name "*.ts*" | while read -r file; do
  # Extract imported components
  if grep -q "from \"@/components/ui" "$file"; then
    imports=$(grep -o "import { [^}]*} from \"@/components/ui" "$file" | sed 's/import { //g' | sed 's/} from "@\/components\/ui.*//g')
    
    for import in $(echo "$imports" | tr ',' ' '); do
      import=$(echo "$import" | tr -d ' ')
      # Count how many times the import is used
      uses=$(grep -c "\b$import\b" "$file")
      if [ $uses -le 1 ]; then
        echo "$file: $import is imported but might be unused" >> "$report_file"
      fi
    done
  fi
done

# Find database-related issues
echo -e "\n\nDatabase-related issues:" >> "$report_file"
find ./app ./components ./lib -type f -name "*.ts*" | while read -r file; do
  if grep -q "from\s\+.*Tables" "$file" || grep -q "Database.*Tables" "$file"; then
    # Check if the tables exist in the Supabase types
    tables=$(grep -o "Tables.*'\(\w\+\)'" "$file" | grep -o "'\w\+'" | tr -d "'" | sort | uniq)
    
    for table in $tables; do
      if ! grep -q "Tables.*$table" "./types/supabase.ts"; then
        echo "$file: Table '$table' referenced but not defined in types/supabase.ts" >> "$report_file"
      fi
    done
  fi
done

echo "Analysis complete. See $report_file for details." 