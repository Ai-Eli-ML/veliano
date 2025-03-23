# Payment System Implementation

This document provides an overview of the payment system implementation for the Veliano Jewelry E-commerce platform.

## Architecture Overview

The payment system uses Stripe as the payment processor and is built with the following components:

1. **Client-side**: Checkout form with Stripe Elements integration
2. **Server-side**: Server actions for payment processing and order creation
3. **Webhooks**: Stripe webhook handler for processing payment events
4. **Database**: Order and order item tables to store order information

```
┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │
│  Client   │────▶│  Server   │────▶│  Stripe   │
│           │     │  Actions  │     │           │
└───────────┘     └───────────┘     └───────────┘
                        │                 │
                        ▼                 │
                  ┌───────────┐          │
                  │           │          │
                  │ Database  │◀─────────┘
                  │           │   Webhooks
                  └───────────┘
```

## Database Schema

### Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  status VARCHAR NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  payment_intent_id VARCHAR,
  checkout_session_id VARCHAR,
  shipping_address JSONB,
  billing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_email VARCHAR,
  customer_name VARCHAR,
  notes TEXT,
  payment_status VARCHAR NOT NULL DEFAULT 'pending',
  shipping_status VARCHAR
);
```

### Order Items Table

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);
```

## Row Level Security (RLS) Policies

### Orders Table

```sql
-- Allow users to view their own orders
CREATE POLICY orders_select ON orders 
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own orders
CREATE POLICY orders_insert ON orders 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow service role and admins to access all orders
CREATE POLICY orders_admin ON orders 
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
);
```

### Order Items Table

```sql
-- Allow users to view their own order items through the orders
CREATE POLICY order_items_select ON order_items 
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM orders WHERE id = order_id
  )
);

-- Allow users to insert items to their own orders
CREATE POLICY order_items_insert ON order_items 
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM orders WHERE id = order_id
  )
);

-- Allow service role and admins to access all order items
CREATE POLICY order_items_admin ON order_items 
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM admin_users
  )
);
```

## Payment Flow

1. **Cart to Checkout**:
   - User adds products to cart
   - User navigates to checkout
   - Checkout form collects shipping and billing information

2. **Payment Processing**:
   - Client uses Stripe Elements to securely collect payment information
   - Server creates a payment intent with Stripe
   - Client submits payment to Stripe

3. **Order Creation**:
   - Server creates an order record
   - Server creates order items from cart items
   - Server associates payment intent with order

4. **Payment Confirmation**:
   - Stripe confirms payment and sends webhook event
   - Webhook handler updates order status
   - User is redirected to order confirmation page

5. **Order Management**:
   - Admin can view and manage orders through admin interface
   - User can view order history and status

## Server Actions

The payment system uses the following server actions:

### `createCheckoutSession`

Creates a Stripe checkout session and returns the session ID.

```typescript
export async function createCheckoutSession(formData: FormData): Promise<{ sessionId: string | null; error: string | null }> {
  try {
    // Get cart items and calculate total
    // Create Stripe checkout session
    // Return session ID
  } catch (error) {
    return { sessionId: null, error: error.message };
  }
}
```

### `createOrder`

Creates an order and order items in the database.

```typescript
export async function createOrder(
  sessionId: string,
  cartItems: CartItem[],
  customerInfo: CustomerInfo
): Promise<{ orderId: string | null; error: string | null }> {
  try {
    // Create order record
    // Create order items from cart items
    // Clear cart
    // Return order ID
  } catch (error) {
    return { orderId: null, error: error.message };
  }
}
```

### `getOrderById`

Retrieves an order and its items from the database.

```typescript
export async function getOrderById(
  orderId: string
): Promise<{ order: Order | null; items: OrderItem[] | null; error: string | null }> {
  try {
    // Get order by ID
    // Get order items
    // Return order and items
  } catch (error) {
    return { order: null, items: null, error: error.message };
  }
}
```

## Webhook Handler

The Stripe webhook handler processes the following events:

- `checkout.session.completed`: Updates order status when checkout is completed
- `payment_intent.succeeded`: Updates order payment status when payment succeeds
- `payment_intent.payment_failed`: Updates order payment status when payment fails

```typescript
export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    // Process event based on type
    // Update order status
    // Return success response
  } catch (error) {
    // Return error response
  }
}
```

## Test vs. Production Environment

The system uses environment variables to determine whether to use test or production Stripe keys:

```typescript
// In lib/stripe.ts
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
export const isStripeTestMode = 
  process.env.NODE_ENV !== 'production' || 
  stripeSecretKey.startsWith('sk_test_');

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  : null;
```

See [Stripe Deployment Guide](.cursor/deployment/STRIPE-DEPLOYMENT.md) for details on deploying to production.

## Error Handling

The payment system includes comprehensive error handling:

1. **Client-side Validation**: Form validation for checkout information
2. **Server-side Validation**: Validation of payment and order data
3. **Error Logging**: Logging of payment errors to Sentry
4. **User Feedback**: Clear error messages for users
5. **Recovery Flow**: Options for users to retry payment

## Testing

To test the payment system:

1. Use Stripe test cards (e.g., `4242 4242 4242 4242` for successful payments)
2. Test error scenarios with cards like `4000 0000 0000 0002` (declined)
3. Use the Stripe CLI to test webhooks locally

## Future Enhancements

1. **Subscription Support**: For recurring custom orders
2. **Multiple Payment Methods**: Support for additional payment methods
3. **Discount Codes**: Support for promotional discounts
4. **Partial Payments**: Support for deposits on custom orders
5. **Refund Processing**: Automated refund workflow
6. **Order Modifications**: Allow order modifications before fulfillment

## Reference

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Supabase Documentation](https://supabase.io/docs) 