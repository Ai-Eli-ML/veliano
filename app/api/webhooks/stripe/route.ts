import { NextRequest, NextResponse } from 'next/server';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { Database } from '@/types/supabase';

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    // Verify webhook signature
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret!
      );
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const supabase = createServerActionClient<Database>({ cookies });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Update order status in database
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            updated_at: new Date().toISOString(),
            metadata: {
              ...session.metadata,
              payment_status: session.payment_status,
              payment_intent: session.payment_intent,
              stripe_customer_id: session.customer,
              payment_method: session.payment_method_types[0],
            }
          })
          .eq('id', session.metadata.orderId);

        if (error) {
          console.error('Error updating order:', error);
          return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
        }

        // Process order items if needed
        // This would be where you'd populate the order_items table if you didn't do it during checkout
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        
        // If you need to update using payment intent instead of checkout session
        console.log('Payment intent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        
        // Handle failed payments
        console.log('Payment failed:', paymentIntent.id);
        
        // Find order associated with this payment intent
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .filter('metadata->stripe_payment_intent', 'eq', paymentIntent.id);
        
        if (!error && orders && orders.length > 0) {
          // Update order status
          await supabase
            .from('orders')
            .update({
              status: 'payment_failed',
              updated_at: new Date().toISOString(),
              metadata: {
                ...orders[0].metadata,
                payment_error: paymentIntent.last_payment_error,
              }
            })
            .eq('id', orders[0].id);
        }
        break;
      }

      // Handle other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Stripe requires the raw body to construct the event
export const config = {
  api: {
    bodyParser: false,
  },
}

