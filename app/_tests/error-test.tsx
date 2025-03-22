'use client';

import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorTest() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Test client-side error tracking
    try {
      throw new Error('Test error for Sentry tracking');
    } catch (e) {
      if (e instanceof Error) {
        Sentry.captureException(e);
        setError(e);
      }
    }
  }, []);

  // Test error boundary by throwing an error
  if (error) {
    throw error;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Error Test Component</h1>
      <p>Testing error tracking...</p>
    </div>
  );
} 