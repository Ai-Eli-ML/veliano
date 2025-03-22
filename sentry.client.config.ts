import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Integration Configuration
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/.*\.veliano\.com/],
    }),
    new Sentry.Replay(),
  ],

  // Environment & Release
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  release: process.env.NEXT_PUBLIC_VERSION || '0.1.0',

  // Error Filtering
  beforeSend(event) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },

  // Error Grouping
  normalizeDepth: 5,
  attachStacktrace: true,

  // Additional Context
  initialScope: {
    tags: {
      'app.version': process.env.NEXT_PUBLIC_VERSION || '0.1.0',
      'app.name': 'Veliano Jewelry',
    },
  },
}); 