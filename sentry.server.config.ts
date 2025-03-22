import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Environment & Release
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  release: process.env.NEXT_PUBLIC_VERSION || '0.1.0',

  // Error Filtering
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },

  // Additional Context
  initialScope: {
    tags: {
      'app.version': process.env.NEXT_PUBLIC_VERSION || '0.1.0',
      'app.name': 'Veliano Jewelry',
      'app.type': 'server',
    },
  },

  // Server-specific settings
  serverName: process.env.VERCEL_URL || 'localhost',
  
  // Enable source maps
  includeLocalVariables: true,
}); 
}); 