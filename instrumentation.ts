import * as Sentry from '@sentry/nextjs';
import type { NextRequest } from 'next/server';

export function register() {
  // Register Sentry instrumentation
}

export const onRequestError = Sentry.captureRequestError; 