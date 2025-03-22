# Error Handling Patterns

## Overview
This document outlines our error handling patterns for the Veliano E-commerce application.

## Error Boundaries

### Global Error Boundary
Located in `app/global-error.tsx`, handles application-wide errors:
```typescript
// Example usage
'use client';
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  // ... error UI
}
```

### Component-Level Error Boundaries
Use the `ErrorBoundary` component from 'react-error-boundary':
```typescript
<ErrorBoundary
  fallback={<ErrorFallback />}
  onError={(error) => {
    Sentry.captureException(error);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Type-Safe Error Tracking

### Using the Error Tracking Utility
We've implemented a fully type-safe error tracking system in `lib/utils/error-tracking.ts`:

```typescript
import { trackError, trackMessage, setErrorUser } from '@/lib/utils/error-tracking';

// Tracking errors with type safety
try {
  // Operation that might fail
} catch (error) {
  trackError(error as Error, {
    severity: 'error',
    context: {
      component: 'ComponentName',
      action: 'actionAction',
      userId: user.id,
      additionalData: { requestData }
    }
  });
}

// Tracking messages with type safety
trackMessage('Important information', {
  severity: 'info',
  context: {
    component: 'ComponentName'
  }
});

// Setting user for error context
setErrorUser(user.id);
// Clear user context
setErrorUser(null);
```

### Performance Monitoring
Our error tracking now includes performance monitoring capabilities:

```typescript
import { 
  measurePerformance, 
  startPerformanceTransaction,
  finishPerformanceTransaction
} from '@/lib/utils/error-tracking';

// Automatic performance measurement of async operations
const result = await measurePerformance('FetchUserData', async () => {
  return await fetchUserData(userId);
}, {
  component: 'UserProfile',
  action: 'fetchData',
  userId: userId
});

// Manual transaction tracking
const transaction = startPerformanceTransaction('ComplexOperation', {
  component: 'DataProcessor',
  description: 'Processing large dataset'
});

try {
  // First part of operation
  await step1();
  
  // Second part of operation
  await step2();
  
  // Complete the transaction
  finishPerformanceTransaction(transaction);
} catch (error) {
  // Always finish transaction even on error
  finishPerformanceTransaction(transaction);
  throw error;
}
```

## Server Component Error Handling

### Request Error Tracking
Using `instrumentation.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";
export const onRequestError = Sentry.captureRequestError;
```

### Server Action Error Handling
```typescript
import { trackError } from '@/lib/utils/error-tracking';

try {
  await serverAction();
} catch (e) {
  if (e instanceof Error) {
    trackError(e, {
      severity: 'error',
      context: {
        action: 'serverAction',
        additionalData: { actionParams }
      }
    });
    throw new Error('Action failed', { cause: e });
  }
}
```

## Client-Side Error Handling

### API Request Errors
```typescript
import { trackError } from '@/lib/utils/error-tracking';

try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
} catch (e) {
  trackError(e as Error, {
    severity: 'error',
    context: {
      component: 'ApiClient',
      action: 'fetchEndpoint'
    }
  });
  // Show user-friendly error
}
```

### Form Submission Errors with Optimistic Updates
```typescript
import { trackError } from '@/lib/utils/error-tracking';
import { useState } from 'react';

function FormComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimisticData, setOptimisticData] = useState(null);
  
  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      
      // Apply optimistic update
      const newData = createOptimisticData(formData);
      setOptimisticData(newData);
      
      // Actual submission
      await submitForm(formData);
    } catch (e) {
      // Revert optimistic update
      setOptimisticData(null);
      
      // Track error
      trackError(e as Error, {
        severity: 'error',
        context: {
          component: 'FormComponent',
          action: 'submitForm',
          additionalData: { formData }
        }
      });
      
      // User feedback
      toast.error('Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  }
}
```

## Error Monitoring

### Performance Monitoring
- Type-safe performance monitoring implemented
- Custom transaction tracking with context
- Operation measurement with automatic error tracking
- Browser performance metrics tracked

### Error Context
Always include relevant context with errors:
```typescript
import { trackError } from '@/lib/utils/error-tracking';

trackError(error, {
  severity: 'error',
  context: {
    component: 'ComponentName',
    action: 'actionName',
    userId: user.id,
    additionalData: { requestData }
  }
});
```

## Best Practices

1. Always use TypeScript for type-safe error handling
2. Implement proper error boundaries at component level
3. Include relevant context with error reports
4. Use toast notifications for user feedback
5. Log errors appropriately in production
6. Handle both client and server errors
7. Implement retry mechanisms where appropriate
8. Use proper error types and interfaces
9. Track performance for critical operations
10. Always finish performance transactions, even in error cases

## Error Types

```typescript
interface ApiError extends Error {
  statusCode: number;
  endpoint: string;
}

interface ValidationError extends Error {
  field: string;
  constraint: string;
}

// Enhance the error type in the global scope
declare global {
  interface Error {
    code?: string;
    details?: Record<string, unknown>;
  }
}
```

## Testing Error Scenarios

1. Test both client and server errors
2. Verify error boundary fallbacks
3. Test error recovery flows
4. Validate error reporting
5. Check performance monitoring
6. Test error context capture
7. Verify optimistic update rollbacks
8. Test transaction tracking

## Production Considerations

1. Error Sampling
   - Development: 100% of errors
   - Production: Configurable rate

2. Performance Impact
   - Minimal overhead
   - Async error reporting
   - Proper error filtering

3. Security
   - No sensitive data in errors
   - Proper error sanitization
   - Rate limiting on error reporting 