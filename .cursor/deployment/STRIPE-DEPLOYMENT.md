# Stripe Integration Deployment Guide

This document provides instructions for deploying the Stripe integration in both test and production environments.

## Environment Variables

The application uses the following Stripe-related environment variables:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

### Test Environment

For development and testing, use the Stripe test keys:

1. Go to the Stripe Dashboard → Developers → API keys
2. Use the "Secret key" that starts with `sk_test_`
3. Use the "Publishable key" that starts with `pk_test_`

### Production Environment

For production deployment:

1. Go to the Stripe Dashboard → Developers → API keys
2. Toggle from "Test mode" to "Live mode"
3. Use the "Secret key" that starts with `sk_live_`
4. Use the "Publishable key" that starts with `pk_live_`

## Webhook Configuration

### Test Environment

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run `stripe login` to authenticate
3. Forward webhooks to your local server:
   ```
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```
4. The CLI will provide a webhook signing secret. Add this to your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Production Environment

1. Go to the Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Set the endpoint URL to `https://your-domain.com/api/webhooks/stripe`
4. Select the events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the "Signing secret" and add it to your production environment:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Deployment Checklist

Before going live with Stripe payments:

1. **Test Thoroughly**: Ensure the payment flow works end-to-end in test mode
2. **Update Environment Variables**: Replace test keys with live keys
3. **Configure Production Webhooks**: Set up webhooks for the production domain
4. **Verify Stripe Dashboard**: Ensure you can view orders in the Stripe Dashboard
5. **Test with Real Cards**: Make a small test payment with a real card
6. **Monitor Error Logs**: Watch for any Stripe-related errors after deployment

## Testing Production Integration

To verify the production Stripe integration is working:

1. Make a small test purchase (e.g., $1)
2. Verify the payment appears in the Stripe Dashboard
3. Check that the order is correctly processed in your application
4. Verify webhooks are being received (check the webhook logs in Stripe Dashboard)
5. Process a refund to ensure the refund workflow works correctly

## Switching Modes

The application automatically detects whether you're using test or live keys based on:
1. The `NODE_ENV` environment variable
2. The prefix of the Stripe secret key (`sk_test_` vs `sk_live_`)

No code changes are necessary when switching between environments - just update the environment variables.

## Troubleshooting

### Common Issues

1. **Webhook Errors**: Ensure the webhook secret is correctly set and the endpoint is accessible
2. **Payment Failures**: Check the Stripe Dashboard for detailed error messages
3. **API Errors**: Verify your API keys are correct and have the necessary permissions

### Fixing Issues

1. Check the application logs for detailed error messages
2. In the Stripe Dashboard, go to Developers → Logs to see API request logs
3. For webhook issues, check Developers → Webhooks → select your endpoint → Recent events

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Webhook Integration Guide](https://stripe.com/docs/webhooks)
- [Stripe Dashboard](https://dashboard.stripe.com) 