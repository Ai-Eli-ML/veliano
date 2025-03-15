# Deployment Guide for Veliano

## Prerequisites

1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Login to your Vercel account:
```bash
vercel login
```

## Initial Setup

1. Link your project to Vercel:
```bash
vercel link
```

2. Pull environment variables from Vercel:
```bash
vercel env pull .env
```

## Environment Variables

The following environment variables need to be configured using `vercel env add`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email (SMTP)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=your-from-email
SMTP_FROM_NAME="Your Name"

# Analytics
NEXT_PUBLIC_GA_ID=your-ga-id

# Site
NEXT_PUBLIC_SITE_URL=https://your-site-url.com
```

To add each environment variable:
```bash
vercel env add VARIABLE_NAME
```

## Development

1. Run the development server:
```bash
vercel dev
```

2. Preview your changes before deployment:
```bash
vercel
```

## Deployment

1. Deploy to production:
```bash
vercel --prod
```

## Project Configuration

Your `vercel.json` configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SITE_URL": "https://your-site-url.com"
  }
}
```

## Next.js Configuration

The `next.config.mjs` has special settings for production:
```javascript
export default {
  typescript: {
    ignoreBuildErrors: true
  },
  output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
}
```

## Troubleshooting

1. **View deployment logs**:
```bash
vercel logs
```

2. **Inspect environment variables**:
```bash
vercel env ls
```

3. **Clear build cache**:
```bash
vercel deploy --force
```

4. **"supabaseKey is required" Error**:
- Verify environment variables are correctly set:
```bash
vercel env ls
```
- Pull latest environment variables:
```bash
vercel env pull .env
```
- Check Supabase dashboard to ensure project is active
- Verify Supabase client initialization in your code

## Notes About Client-Side Rendering

Many pages in the application show messages about being "deopted into client-side rendering due to useSearchParams()". This is normal and expected behavior for pages that use client-side features like `useSearchParams()`. These pages will still function correctly but will be rendered on the client side rather than being statically generated at build time.

## Useful Commands

- **List deployments**:
```bash
vercel ls
```

- **Remove deployment**:
```bash
vercel remove [deployment-id]
```

- **Switch project**:
```bash
vercel switch
```

- **View project settings**:
```bash
vercel project ls
``` 