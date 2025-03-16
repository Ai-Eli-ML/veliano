# Pre-Deployment Checklist

## Environment Variables
- [x] NEXT_PUBLIC_SUPABASE_URL
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] SUPABASE_SERVICE_ROLE_KEY
- [x] NEXT_PUBLIC_SITE_URL
- [x] STRIPE_SECRET_KEY
- [x] STRIPE_WEBHOOK_SECRET
- [x] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [x] SMTP configuration (if applicable)
- [ ] Any analytics keys

## Build Process
- [x] Run `npm run build` locally to verify build succeeds
- [x] Check for any TypeScript errors
- [x] Check for any lint errors
- [x] Verify no console warnings about deprecated APIs
- [x] Confirm bundle size is acceptable
- [x] Test static generation for applicable pages
- [x] Test server-side rendering for applicable pages

## Deployment Configurations
- [x] Update Vercel project settings (if using Vercel)
- [x] Configure correct Node.js version
- [x] Set up proper build command
- [x] Configure output directory
- [x] Set environment variables in deployment platform
- [ ] Configure custom domains
- [ ] Set up SSL/TLS certificates
- [x] Configure redirects in `next.config.js`
- [ ] Set up proper caching headers
- [x] Configure serverless function region (if applicable)

## Database and Backend
- [x] Verify database migrations are applied
- [x] Check database indexes for performance
- [x] Test database connections
- [x] Check Supabase security rules
- [x] Test webhook endpoints
- [x] Verify backend services connections

## Critical Features Final Check
- [x] Authentication flows
- [x] Payment processing
- [x] Cart functionality
- [x] User data persistence
- [x] Search functionality
- [x] Admin capabilities

## Monitoring Setup
- [ ] Error tracking (e.g., Sentry)
- [ ] Performance monitoring
- [ ] Real user monitoring
- [ ] Server monitoring
- [ ] Database monitoring
- [ ] Set up alerts for critical errors

## Security Checks
- [x] Run security audit on dependencies
- [x] Check for exposed API keys
- [x] Verify CSP (Content Security Policy)
- [x] Check for CORS configuration
- [x] Verify authentication mechanisms
- [x] Test authorization rules

## Rollback Plan
- [x] Document specific rollback steps
- [x] Prepare rollback scripts if needed
- [x] Identify rollback triggers
- [x] Assign responsibility for making rollback decision
- [x] Test rollback procedure
- [x] Document data recovery plan

## Post-Deployment
- [ ] Smoke test critical user flows
- [ ] Verify analytics are tracking correctly
- [ ] Check server logs for unexpected errors
- [ ] Monitor performance metrics
- [x] Test on multiple devices and browsers
- [x] Verify SEO elements are preserved 