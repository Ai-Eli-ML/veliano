#!/bin/bash

# Pre-deployment checklist script

echo "Running pre-deployment checks..."

# Check for environment variables
echo "Checking environment variables..."
ENV_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "NEXT_PUBLIC_SITE_URL"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
)

ENV_FILE=".env.local"
MISSING_VARS=0

if [ -f "$ENV_FILE" ]; then
  for VAR in "${ENV_VARS[@]}"; do
    if ! grep -q "^$VAR=" "$ENV_FILE"; then
      echo "❌ Missing environment variable: $VAR"
      MISSING_VARS=$((MISSING_VARS+1))
    else
      echo "✅ Found environment variable: $VAR"
    fi
  done
else
  echo "❌ Environment file not found: $ENV_FILE"
  MISSING_VARS=$((MISSING_VARS+1))
fi

# Check for critical files
echo -e "\nChecking critical files..."
CRITICAL_FILES=(
  "lib/supabase/server.ts"
  "lib/supabase-server.ts"
  "lib/auth.ts"
  "app/api/webhooks/stripe/route.ts"
)

for FILE in "${CRITICAL_FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo "✅ Found critical file: $FILE"
  else
    echo "❌ Missing critical file: $FILE"
    MISSING_VARS=$((MISSING_VARS+1))
  fi
done

# Run build check
echo -e "\nRunning build check..."
npm run build

# Check build result
if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ Build failed"
  MISSING_VARS=$((MISSING_VARS+1))
fi

# Final report
echo -e "\nPre-deployment check summary:"
if [ $MISSING_VARS -eq 0 ]; then
  echo "✅ All checks passed! Ready for deployment."
else
  echo "❌ Found $MISSING_VARS issues that need to be fixed before deployment."
  exit 1
fi 