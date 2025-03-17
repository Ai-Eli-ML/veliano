# Deployment Guide for Veliano

This guide outlines the steps taken to prepare the site for deployment and how to deploy it to production.

## Fixes Implemented

1. **Next.js 15 Compatibility Updates**
   - Updated `cookies()` API usage to use the new async pattern
   - Updated `headers()` API usage to use the new async pattern
   - Fixed Supabase client integration with Next.js 15

2. **Authentication Fixes**
   - Updated auth functions to properly await Supabase client
   - Fixed user session handling

3. **API Routes**
   - Updated Stripe webhook handler for Next.js 15
   - Fixed metrics API route

## Deployment Steps

1. **Pre-Deployment Checks**
   Run the pre-deployment check script to ensure everything is ready:
   ```bash
   ./pre-deploy-check.sh
   ```

2. **Environment Variables**
   Ensure all required environment variables are set in your Vercel project:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

3. **Deploy to Vercel**
   Use the deployment script to deploy to Vercel:
   ```bash
   ./deploy.sh
   ```

4. **Post-Deployment Verification**
   After deployment, verify these critical features:
   - User authentication (login/signup)
   - Product browsing and search
   - Cart functionality
   - Checkout process with Stripe
   - Webhook handling

## Troubleshooting

If you encounter issues after deployment:

1. **Check Logs**
   - Review Vercel deployment logs
   - Check Supabase logs for database errors
   - Check Stripe dashboard for payment issues

2. **Common Issues**
   - Environment variables not set correctly
   - Webhook URLs not updated for production
   - Database permissions issues

3. **Quick Fixes**
   - If authentication issues occur, verify Supabase configuration
   - If payment issues occur, check Stripe webhook configuration
   - For API errors, check server logs in Vercel

## Maintenance

Regular maintenance tasks:

1. Keep dependencies updated
2. Monitor error logs
3. Test critical flows regularly
4. Back up database regularly

## Support

For additional support:
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
- Stripe documentation: https://stripe.com/docs 