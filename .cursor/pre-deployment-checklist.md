# Pre-Deployment Checklist

## Environment Variables
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ NEXT_PUBLIC_SITE_URL
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ SMTP configuration
✅ NEXT_PUBLIC_SENTRY_DSN
✅ Analytics keys

## Build Process
✅ Run `npm run build` locally to verify build succeeds
✅ Check for any TypeScript errors
✅ Check for any lint errors
✅ Verify no console warnings about deprecated APIs
✅ Confirm bundle size is acceptable
✅ Test static generation for applicable pages
✅ Test server-side rendering for applicable pages

## Deployment Configurations
✅ Update Vercel project settings
✅ Configure correct Node.js version
✅ Set up proper build command
✅ Configure output directory
✅ Set environment variables in deployment platform
✅ Configure custom domains
✅ Set up SSL/TLS certificates
✅ Configure redirects in `next.config.js`
✅ Set up proper caching headers
✅ Configure serverless function region

## Database and Backend
✅ Verify database migrations are applied
✅ Check database indexes for performance
✅ Test database connections
✅ Check Supabase security rules
✅ Test webhook endpoints
✅ Verify backend services connections

## Critical Features Final Check
✅ Authentication flows
✅ Payment processing
✅ Cart functionality
✅ User data persistence
✅ Search functionality
✅ Admin capabilities

## Monitoring Setup
✅ Error tracking (Sentry)
✅ Performance monitoring
✅ Real user monitoring
✅ Server monitoring
✅ Database monitoring
✅ Set up alerts for critical errors

## Security Checks
✅ Run security audit on dependencies
✅ Check for exposed API keys
✅ Verify CSP (Content Security Policy)
✅ Check for CORS configuration
✅ Verify authentication mechanisms
✅ Test authorization rules

## Rollback Plan
✅ Document specific rollback steps
✅ Prepare rollback scripts
✅ Identify rollback triggers
✅ Assign responsibility for making rollback decision
✅ Test rollback procedure
✅ Document data recovery plan

## Post-Deployment
✅ Smoke test critical user flows
✅ Verify analytics are tracking correctly
✅ Check server logs for unexpected errors
✅ Monitor performance metrics
✅ Test on multiple devices and browsers
✅ Verify SEO elements are preserved 