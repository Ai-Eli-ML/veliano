"use client"

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling
  profilesSampleRate: 1.0,

  // Configure environment
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",

  // Enable automatic instrumentation
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Prisma({ tracing: true }),
  ],

  // Adjust this value in production
  beforeSend(event) {
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development") {
      console.log("Sentry event:", event)
    }
    return event
  },
}) 
