"use client"

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions in development
  replaysSessionSampleRate: 0.1, // Sample rate for session replays
  replaysOnErrorSampleRate: 1.0, // Sample rate for sessions with errors

  // Enable automatic instrumentation
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^https:\/\/veliano\.com/],
    }),
    new Sentry.Replay(),
  ],

  // Configure environment
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
}) 
