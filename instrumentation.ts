import * as Sentry from '@sentry/nextjs';
import type { NextRequest } from 'next/server';

export function register() {
  // Register Sentry instrumentation
}

export function onRequestError({ 
  error,
  request,
}: {
  error: Error;
  request: NextRequest;
}) {
  Sentry.captureException(error, {
    tags: {
      runtime: 'edge',
    },
    extra: {
      request: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
      }
    }
  });
} 