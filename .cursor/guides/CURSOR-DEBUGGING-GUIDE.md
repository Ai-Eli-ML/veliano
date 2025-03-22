# Cursor Debugging Guide for Next.js 15 with Supabase

This guide outlines debugging methods and strategies for Next.js 15 applications with Supabase integration.

## Table of Contents
1. [Identifying Common Errors](#identifying-common-errors)
2. [Next.js 15 API Updates](#nextjs-15-api-updates)
3. [Supabase Integration Debugging](#supabase-integration-debugging)
4. [Automation Scripts for Batch Fixes](#automation-scripts-for-batch-fixes)
5. [Effective Search Strategies](#effective-search-strategies)
6. [Testing and Deployment](#testing-and-deployment)
7. [Error Tracking and Resolution](#error-tracking-and-resolution)

## Identifying Common Errors

### Error Pattern Analysis
- **Look for recurring patterns** in error messages (e.g., "cookies() should be awaited")
- **Track error origins** by identifying file paths and line numbers
- **Group related errors** that might have a common cause

### Console Output Analysis
```bash
# Run dev server and capture full output
npm run dev > debug-output.log 2>&1
```

### Browser Console Debugging
- Use `console.log()` with descriptive labels:
```javascript
console.log('Auth state before fetch:', authState);
console.log('Response from API:', response);
```

## Next.js 15 API Updates

### Async Web APIs
Next.js 15 made several previously synchronous APIs asynchronous:

#### cookies() API
```typescript
// ❌ OLD (Next.js 14 and earlier)
const cookieStore = cookies();
const value = cookieStore.get('name')?.value;

// ✅ NEW (Next.js 15)
const cookieStore = await cookies();
const value = cookieStore.get('name')?.value;
```

#### headers() API
```typescript
// ❌ OLD (Next.js 14 and earlier)
const headersList = headers();
const userAgent = headersList.get('user-agent');

// ✅ NEW (Next.js 15)
const headersList = await headers();
const userAgent = headersList.get('user-agent');
```

### Fixing Async API Usage
1. **Identify all occurrences** using grep or codebase search
2. **Add await** to all function calls
3. **Make containing functions async** if needed
4. **Fix chained operations** that depend on the result

## Supabase Integration Debugging

### Common Supabase Client Issues

#### Authentication Problems
```typescript
// Debugging auth state
const { data, error } = await supabase.auth.getSession();
console.log('Session data:', data);
console.log('Auth error:', error);
```

#### Database Query Issues
```typescript
// Add logging to database queries
const { data, error, status } = await supabase
  .from("table_name")
  .select("*");

console.log('Query status:', status);
console.log('Query error:', error);
console.log('Returned data:', data);
```

### Fixing Supabase Client in Next.js 15
```typescript
// ❌ Without async/await
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(/* params */);
}

// ✅ With proper async/await
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(/* params */);
}
```

## Automation Scripts for Batch Fixes

### Creating a Script for Updating Supabase Client Usage
```bash
#!/bin/bash

# Find all files importing createServerSupabaseClient
FILES=$(find . -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*createServerSupabaseClient.*from")

# Loop through each file
for file in $FILES; do
  echo "Processing file: $file"
  
  # Add await to all instances of createServerSupabaseClient()
  sed -i '' 's/const supabase = createServerSupabaseClient()/const supabase = await createServerSupabaseClient()/g' "$file"
  
  echo "Updated file: $file"
done
```

### Creating a Script for Updating Headers API Usage
```bash
#!/bin/bash

# Find all files importing headers
FILES=$(find ./app -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*headers.*from.*next/headers")

# Loop through each file
for file in $FILES; do
  echo "Processing file: $file"
  
  # Replace direct headers() calls with awaited version
  sed -i '' 's/headers()/await headers()/g' "$file"
  
  echo "Updated file: $file"
done
```

## Effective Search Strategies

### Grep for Pattern Matching
```bash
# Find all occurrences of a function call
grep -r "createServerSupabaseClient()" --include="*.ts" --include="*.tsx" .

# Find missing await keywords
grep -r "const.*= cookies()" --include="*.ts" --include="*.tsx" .
```

### Codebase Search in Cursor
- Use semantic search for finding related code
- Search for error messages to find error origins
- Search for function names and API calls

### Finding File References
```bash
# List all files that import a specific module
grep -l "import.*from.*@/lib/supabase" --include="*.ts" --include="*.tsx" .
```

## Testing and Deployment

### Pre-Deployment Testing
```bash
# Create a pre-deployment check script
#!/bin/bash

echo "Running pre-deployment checks..."

# Check for environment variables
ENV_VARS=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY")
ENV_FILE=".env.local"

for VAR in "${ENV_VARS[@]}"; do
  if ! grep -q "^$VAR=" "$ENV_FILE"; then
    echo "Missing environment variable: $VAR"
  fi
done

# Run build to check for errors
npm run build
```

### API Route Testing
```bash
# Test API routes with curl
curl -X POST http://localhost:3000/api/your-endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Debugging Production Builds
```bash
# Build and start in production mode
npm run build
npm start

# Or with detailed output
DEBUG=* npm start
```

## Error Tracking and Resolution

### Creating an Error Log
```typescript
// For server-side errors
export function logServerError(context: string, error: any) {
  console.error(`[SERVER ERROR][${context}]`, {
    message: error.message,
    stack: error.stack,
    cause: error.cause,
    time: new Date().toISOString()
  });
}

// Usage
try {
  // risky operation
} catch (error) {
  logServerError('Cart Checkout', error);
  // handle error
}
```

### Common Error Resolution Patterns

#### API Route Errors
- Check for proper async/await usage
- Verify correct parameter types
- Ensure database connection is established
- Check for CORS issues with external services

#### Authentication Errors
- Verify cookie handling
- Check for proper token management
- Ensure redirect URLs are correct
- Validate Supabase configuration

#### Database Query Errors
- Verify table and column names
- Check data types in queries
- Ensure proper permissions are set
- Log and analyze full query information

## Next.js 15 Migration Checklist

- [ ] Update `cookies()` API calls to use await
- [ ] Update `headers()` API calls to use await
- [ ] Fix Supabase client initialization
- [ ] Update route handlers for async operations
- [ ] Fix middleware for Next.js 15 compatibility
- [ ] Test all authentication flows
- [ ] Verify database operations
- [ ] Check third-party integrations
- [ ] Run build and deployment tests

---

## Useful Commands for Debugging

```bash
# Find all files with a specific import
grep -r "import.*from" --include="*.ts" .

# Find all instances of a specific function call
grep -r "functionName(" --include="*.ts" .

# Show full error stack traces in Node.js
NODE_OPTIONS=--stack-trace-limit=100 npm run dev

# Count occurrences of a specific error
npm run dev 2>&1 | grep -c "specific error text"

# Test a specific API route
curl -v -X GET http://localhost:3000/api/route-name

# Check for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
``` 