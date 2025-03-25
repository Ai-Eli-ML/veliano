'use server';

import { revalidatePath } from 'next/cache';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { cartRepository } from '@/lib/repositories/cart-repository';
import { Database } from '@/types/supabase';
import { CartItem } from '@/types/cart';
import { EmailService } from '@/services';
import { getCookie, setCookie } from '@/lib/utils/cookies';

const CART_ID_COOKIE = 'veliano_cart_id';
const SESSION_ID_COOKIE = 'veliano_session_id';

/**
 * Initialize a cart for the current user or session
 */
export async function initializeCart() {
  const supabase = createServerActionClient<Database>({ cookies });
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  // Check for existing cart ID in cookies
  const cartId = await getCookie(CART_ID_COOKIE);
  const sessionId = await getCookie(SESSION_ID_COOKIE);
  
  // Create session ID if it doesn't exist
  const newSessionId = sessionId || uuidv4();
  if (!sessionId) {
    await setCookie(SESSION_ID_COOKIE, newSessionId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
    });
  }
  
  let cart;
  
  // If user is logged in, get or create their cart
  if (user) {
    cart = await cartRepository.getCartByUserId(user.id);
    
    // If user just logged in and has an anonymous cart, merge it
    if (cartId && !cart?.userId) {
      await cartRepository.mergeAnonymousCartIntoUserCart(user.id, newSessionId);
      cart = await cartRepository.getCartByUserId(user.id);
    }
  } else {
    // Use session-based cart for anonymous users
    cart = await cartRepository.getCartBySessionId(newSessionId);
  }
  
  if (cart && cart.id !== cartId) {
    // Update the cart ID cookie if it changed
    await setCookie(CART_ID_COOKIE, cart.id, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
    });
  }
  
  return cart;
}

/**
 * Get the current cart for the user or session
 */
export async function getCurrentCart() {
  const cartId = await getCookie(CART_ID_COOKIE);
  
  if (!cartId) {
    const cart = await initializeCart();
    return cart;
  }
  
  // Use the repository to get the cart
  const cart = await cartRepository.getCartBySessionId(cartId) || await initializeCart();
  return cart;
}

/**
 * Add an item to the cart
 */
export async function addToCart(productId: string, price: number, quantity = 1, variantId?: string, metadata?: any) {
  // Get or initialize cart
  const cart = await getCurrentCart();
  if (!cart) return null;
  
  const cartItem = await cartRepository.addCartItem(cart.id, {
    productId,
    price,
    quantity,
    variantId,
    metadata
  });
  
  // Revalidate the cart path to update UI
  revalidatePath('/cart');
  revalidatePath('/products/[slug]');
  
  return cartItem;
}

/**
 * Update item quantity in cart
 */
export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (!itemId || quantity < 0) return null;
  
  const cartItem = await cartRepository.updateCartItemQuantity(itemId, quantity);
  
  // Revalidate the cart path to update UI
  revalidatePath('/cart');
  
  return cartItem;
}

/**
 * Remove an item from the cart
 */
export async function removeFromCart(itemId: string) {
  if (!itemId) return null;
  
  const result = await cartRepository.removeCartItem(itemId);
  
  // Revalidate the cart path to update UI
  revalidatePath('/cart');
  
  return result;
}

/**
 * Clear all items from the cart
 */
export async function clearCart() {
  const cookieStore = cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE)?.value;
  
  if (!cartId) return false;
  
  const result = await cartRepository.clearCart(cartId);
  
  // Revalidate the cart path to update UI
  revalidatePath('/cart');
  
  return result;
}

/**
 * Get the number of items in the cart
 */
export async function getCartItemCount() {
  const cookieStore = cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE)?.value;
  
  if (!cartId) return 0;
  
  return await cartRepository.getCartItemCount(cartId);
}

/**
 * Get the subtotal price of the cart
 */
export async function getCartSubtotal() {
  const cookieStore = cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE)?.value;
  
  if (!cartId) return 0;
  
  return await cartRepository.getCartSubtotal(cartId);
}

/**
 * Get all items in the cart
 */
export async function getCartItems() {
  const cart = await getCurrentCart();
  if (!cart) return [];
  
  return await cartRepository.getCartItems(cart.id);
}

export async function handleAbandonedCart(userId: string, cartItems: CartItem[]) {
  const supabase = createServerActionClient({ cookies });
  const emailService = new EmailService();

  try {
    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, first_name, email_preferences')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }

    // Check if user allows marketing emails
    if (!user.email_preferences?.marketing_emails) {
      return;
    }

    // Send abandoned cart email
    await emailService.sendAbandonedCartReminder(
      user.email,
      user.first_name || '',
      cartItems
    );

    // Log the abandoned cart event
    await supabase.from('cart_events').insert({
      user_id: userId,
      type: 'abandoned',
      items: cartItems,
      reminder_sent: true,
    });
  } catch (error) {
    console.error('Error handling abandoned cart:', error);
  }
} 