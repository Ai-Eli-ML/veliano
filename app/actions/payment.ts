'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { getStripe } from '@/lib/stripe';
import { cartRepository } from '@/lib/repositories/cart-repository';
import { Database } from '@/types/supabase';

const CART_ID_COOKIE = 'veliano_cart_id';

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(formData: FormData) {
  const stripe = getStripe();
  const cookieStore = cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE)?.value;
  
  if (!cartId) {
    throw new Error('No cart found');
  }
  
  const cartItems = await cartRepository.getCartItems(cartId);
  
  if (cartItems.length === 0) {
    redirect('/cart');
  }

  // Extract customer information from form
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const zipCode = formData.get('zipCode') as string;
  const notes = formData.get('notes') as string;
  
  // Create the order in our database
  const orderId = uuidv4();
  const orderData = {
    id: orderId,
    customer: {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      address: {
        line1: address,
        city,
        state,
        postal_code: zipCode,
        country: 'US', // Default to US for now
      },
    },
    items: cartItems,
    subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    notes,
    status: 'pending_payment',
  };
  
  // Save order to database
  const supabase = createServerActionClient<Database>({ cookies });
  
  // Create line items for Stripe
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
        metadata: {
          productId: item.productId,
          variantId: item.variantId || '',
        },
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    customer_email: email,
    client_reference_id: orderId,
    metadata: {
      orderId,
      cartId,
    },
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0,
            currency: 'usd',
          },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1500,
            currency: 'usd',
          },
          display_name: 'Express shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 2,
            },
            maximum: {
              unit: 'business_day',
              value: 3,
            },
          },
        },
      },
    ],
  });

  if (!session || !session.url) {
    throw new Error('Failed to create checkout session');
  }

  // Store the session ID in the database
  const { error } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      user_id: null, // Will be filled after successful payment if user is logged in
      customer_email: email,
      customer_name: `${firstName} ${lastName}`,
      shipping_address: `${address}, ${city}, ${state} ${zipCode}`,
      total_amount: orderData.subtotal,
      status: 'pending_payment',
      metadata: {
        notes,
        phone,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        stripe_session_id: session.id,
      },
    });

  if (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }

  return { sessionUrl: session.url, sessionId: session.id };
}

/**
 * Handle successful payment and complete the order
 */
export async function completeOrder(sessionId: string) {
  const stripe = getStripe();
  
  // Retrieve the session to get order details
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  if (!session || session.payment_status !== 'paid') {
    throw new Error('Payment not completed');
  }
  
  const orderId = session.client_reference_id;
  const cartId = session.metadata?.cartId;
  
  if (!orderId || !cartId) {
    throw new Error('Invalid session data');
  }
  
  const supabase = createServerActionClient<Database>({ cookies });
  
  // Check if the user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  // Update the order status and user ID if authenticated
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      user_id: user?.id || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);
  
  if (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
  
  // Clear the cart after successful payment
  await cartRepository.clearCart(cartId);
  
  return { success: true, orderId };
}

/**
 * Get order details
 */
export async function getOrderById(orderId: string) {
  const supabase = createServerActionClient<Database>({ cookies });
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
  
  return data;
} 