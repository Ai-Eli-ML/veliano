import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { EmailService } from '../../../../services/EmailService';
import { Database } from '@/types/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ABANDONED_CART_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function GET(request: Request) {
  try {
    // Verify cron secret to ensure request is legitimate
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createServerComponentClient<Database>({ cookies });
    const emailService = new EmailService();

    // Get abandoned carts from the last 24 hours
    const cutoffTime = new Date(Date.now() - ABANDONED_CART_THRESHOLD).toISOString();
    
    const { data: abandonedCarts, error: cartError } = await supabase
      .from('carts')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          email_preferences
        ),
        cart_items (
          id,
          product_id,
          quantity,
          products (
            id,
            name,
            price,
            images
          )
        )
      `)
      .eq('status', 'active')
      .lt('updated_at', cutoffTime)
      .gt('updated_at', new Date(Date.now() - 2 * ABANDONED_CART_THRESHOLD).toISOString()) // Only carts abandoned in the last 48 hours
      .not('user_id', 'is', null); // Only carts with associated users

    if (cartError) {
      console.error('Error fetching abandoned carts:', cartError);
      return new NextResponse('Error fetching abandoned carts', { status: 500 });
    }

    if (!abandonedCarts || abandonedCarts.length === 0) {
      return new NextResponse('No abandoned carts to process', { status: 200 });
    }

    // Process each abandoned cart
    const results = await Promise.all(
      abandonedCarts.map(async (cart) => {
        try {
          if (!cart.users?.email || !cart.users?.email_preferences?.marketing_emails) {
            return {
              cartId: cart.id,
              status: 'skipped',
              reason: 'User not eligible for marketing emails',
            };
          }

          const cartItems = cart.cart_items.map((item) => ({
            id: item.id,
            name: item.products.name,
            price: item.products.price,
            quantity: item.quantity,
            image: item.products.images[0],
          }));

          // Send abandoned cart email
          await emailService.sendAbandonedCartReminder(
            cart.users.email,
            cart.users.first_name || '',
            cartItems
          );

          // Log the reminder
          await supabase.from('cart_events').insert({
            cart_id: cart.id,
            user_id: cart.user_id,
            type: 'abandoned_cart_reminder',
            metadata: {
              items: cartItems,
              total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            },
          });

          return {
            cartId: cart.id,
            status: 'sent',
            email: cart.users.email,
          };
        } catch (error) {
          console.error(`Error processing abandoned cart ${cart.id}:`, error);
          return {
            cartId: cart.id,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in abandoned cart cron:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 