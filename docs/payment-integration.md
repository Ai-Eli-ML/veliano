# Payment Integration Guide

This document outlines how payment processing is implemented in the Veliano Jewelry E-commerce application using Stripe.

## Overview

The payment system consists of several components:

1. **Stripe Configuration** - Connection to the Stripe API
2. **Order Database Schema** - Storage of order information
3. **Checkout Process** - User flow for completing purchases
4. **Payment Server Actions** - Server-side logic for payment processing
5. **Webhook Handling** - Processing Stripe events

## Setup

### Environment Variables

Make sure to set up the following environment variables:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_APP_URL=your-app-url
```

### Database Tables

The payment system relies on the following database tables:

- `orders` - Stores order information
- `order_items` - Stores individual items within orders
- `carts` - Manages shopping carts
- `cart_items` - Stores items in the shopping cart

See the migration file: `supabase/migrations/20240327000000_add_orders_table.sql`

## Implementation

### 1. Checkout Flow

The checkout flow consists of these steps:

1. User fills out the checkout form
2. Form data is submitted to the `createCheckoutSession` server action
3. Order is created in the database with status "pending_payment"
4. Stripe checkout session is created and user is redirected to Stripe
5. User completes payment on Stripe's hosted checkout
6. User is redirected back to the success page with the session ID
7. Success page completes the order by verifying payment with Stripe
8. Order status is updated to "paid"

### 2. Server Actions

The payment system implements the following server actions:

- `createCheckoutSession` - Creates a Stripe checkout session and stores initial order data
- `completeOrder` - Verifies payment and updates the order status
- `getOrderById` - Retrieves order details

### 3. Webhook Handling

Stripe webhooks are used to handle asynchronous payment events:

- `checkout.session.completed` - Updates order status when payment is completed
- `payment_intent.succeeded` - Confirms payment was successful
- `payment_intent.payment_failed` - Handles failed payments

The webhook handler is implemented in `app/api/webhooks/stripe/route.ts`.

## Testing

To test the payment flow in development:

1. Use Stripe test keys
2. Use Stripe test cards: https://stripe.com/docs/testing
3. Use the Stripe CLI to forward webhook events to your local environment:
   ```
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```

## Production Considerations

Before deploying to production:

1. Ensure Stripe keys are properly set
2. Update webhook endpoint in the Stripe dashboard
3. Set up proper error monitoring
4. Implement comprehensive logging
5. Test the complete payment flow

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations)
- [Supabase Documentation](https://supabase.io/docs) 