#!/bin/bash

# Find all TypeScript and JavaScript files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "./node_modules/*" | while read -r file; do
  # Replace auth-helpers-nextjs imports with ssr
  sed -i '' 's/@supabase\/auth-helpers-nextjs/@supabase\/ssr/g' "$file"
  
  # Replace createClientComponentClient with createClient
  sed -i '' 's/createClientComponentClient/createClient/g' "$file"
  
  # Replace createRouteHandlerClient with createServerClient
  sed -i '' 's/createRouteHandlerClient/createServerClient/g' "$file"
  
  # Add import for createClient if needed
  if grep -q "createClient" "$file"; then
    if ! grep -q "@/lib/supabase/client" "$file"; then
      sed -i '' '1i\
import { createClient } from "@/lib/supabase/client"\
' "$file"
    fi
  fi
done 