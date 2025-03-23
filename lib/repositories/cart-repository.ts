import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// Interface types
export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  metadata?: any;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
  product?: {
    name: string;
    slug: string;
    images?: { url: string; alt?: string }[];
  };
}

export interface CartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  metadata?: any;
}

export interface FormattedCartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  url: string;
  subtotal: number;
}

class CartRepository {
  /**
   * Create a new cart
   */
  async createCart(userId?: string, sessionId?: string): Promise<Cart> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId must be provided');
    }
    
    const { data, error } = await supabase
      .from('carts')
      .insert({
        user_id: userId,
        session_id: sessionId,
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating cart:', error);
      throw new Error('Failed to create cart');
    }
    
    return this.formatCart(data);
  }
  
  /**
   * Get cart by ID
   */
  async getCartById(id: string): Promise<Cart | null> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { data, error } = await supabase
      .from('carts')
      .select('*')
      .eq('id', id)
      .eq('is_archived', false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No cart found
      }
      console.error('Error fetching cart:', error);
      throw new Error('Failed to fetch cart');
    }
    
    return this.formatCart(data);
  }
  
  /**
   * Get cart by user ID
   */
  async getCartByUserId(userId: string): Promise<Cart | null> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { data, error } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return await this.createCart(userId);
      }
      console.error('Error fetching cart by user ID:', error);
      throw new Error('Failed to fetch cart');
    }
    
    return this.formatCart(data);
  }
  
  /**
   * Get cart by session ID
   */
  async getCartBySessionId(sessionId: string): Promise<Cart | null> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { data, error } = await supabase
      .from('carts')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return await this.createCart(undefined, sessionId);
      }
      console.error('Error fetching cart by session ID:', error);
      throw new Error('Failed to fetch cart');
    }
    
    return this.formatCart(data);
  }
  
  /**
   * Merge anonymous cart into user cart
   */
  async mergeAnonymousCartIntoUserCart(userId: string, sessionId: string): Promise<boolean> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    // Get the anonymous cart
    const { data: anonymousCart, error: fetchError } = await supabase
      .from('carts')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_archived', false)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return true; // No anonymous cart to merge
      }
      console.error('Error fetching anonymous cart:', fetchError);
      throw new Error('Failed to fetch anonymous cart');
    }
    
    // Get the user cart or create it
    let userCart = await this.getCartByUserId(userId);
    
    if (!userCart) {
      userCart = await this.createCart(userId);
    }
    
    // Get items from anonymous cart
    const { data: anonymousItems, error: itemsError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', anonymousCart.id);
    
    if (itemsError) {
      console.error('Error fetching anonymous cart items:', itemsError);
      throw new Error('Failed to fetch anonymous cart items');
    }
    
    // Transfer items to user cart
    for (const item of anonymousItems || []) {
      // Check if item already exists in user cart
      const { data: existingItems, error: existingError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', userCart.id)
        .eq('product_id', item.product_id)
        .eq('variant_id', item.variant_id ?? '')
        .single();
      
      if (existingError && existingError.code !== 'PGRST116') {
        console.error('Error checking existing cart item:', existingError);
        continue;
      }
      
      if (existingItems) {
        // Update quantity of existing item
        await supabase
          .from('cart_items')
          .update({
            quantity: existingItems.quantity + item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItems.id);
      } else {
        // Insert new item in user cart
        await supabase
          .from('cart_items')
          .insert({
            cart_id: userCart.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price,
            metadata: item.metadata
          });
      }
    }
    
    // Archive the anonymous cart
    await supabase
      .from('carts')
      .update({ 
        is_archived: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', anonymousCart.id);
    
    return true;
  }
  
  /**
   * Add item to cart
   */
  async addCartItem(cartId: string, item: CartItemInput): Promise<CartItem> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    // Check if item already exists in cart
    const { data: existingItems, error: existingError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', item.productId)
      .eq('variant_id', item.variantId ?? '')
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing cart item:', existingError);
      throw new Error('Failed to check existing cart item');
    }
    
    if (existingItems) {
      // Update quantity of existing item
      const { data, error } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItems.quantity + item.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItems.id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating cart item:', error);
        throw new Error('Failed to update cart item');
      }
      
      return this.formatCartItem(data);
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cartId,
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price,
          metadata: item.metadata
        })
        .select('*')
        .single();
      
      if (error) {
        console.error('Error adding cart item:', error);
        throw new Error('Failed to add cart item');
      }
      
      return this.formatCartItem(data);
    }
  }
  
  /**
   * Update cart item quantity
   */
  async updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    if (quantity <= 0) {
      await this.removeCartItem(itemId);
      throw new Error('Item removed from cart');
    }
    
    const { data, error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating cart item quantity:', error);
      throw new Error('Failed to update cart item quantity');
    }
    
    return this.formatCartItem(data);
  }
  
  /**
   * Remove item from cart
   */
  async removeCartItem(itemId: string): Promise<boolean> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      console.error('Error removing cart item:', error);
      throw new Error('Failed to remove cart item');
    }
    
    return true;
  }
  
  /**
   * Clear all items from cart
   */
  async clearCart(cartId: string): Promise<boolean> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);
    
    if (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
    
    return true;
  }
  
  /**
   * Get cart item count
   */
  async getCartItemCount(cartId: string): Promise<number> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('cart_id', cartId);
    
    if (error) {
      console.error('Error getting cart item count:', error);
      throw new Error('Failed to get cart item count');
    }
    
    return (data || []).reduce((total, item) => total + item.quantity, 0);
  }
  
  /**
   * Get cart subtotal
   */
  async getCartSubtotal(cartId: string): Promise<number> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity, price')
      .eq('cart_id', cartId);
    
    if (error) {
      console.error('Error getting cart subtotal:', error);
      throw new Error('Failed to get cart subtotal');
    }
    
    return (data || []).reduce((total, item) => total + (item.quantity * item.price), 0);
  }
  
  /**
   * Get all items in cart with product details
   */
  async getCartItems(cartId: string): Promise<FormattedCartItem[]> {
    const supabase = createServerActionClient<Database>({ cookies });
    
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(
          id,
          name,
          slug,
          images:product_images(url, alt_text)
        )
      `)
      .eq('cart_id', cartId);
    
    if (error) {
      console.error('Error getting cart items:', error);
      throw new Error('Failed to get cart items');
    }
    
    return (data || []).map(item => ({
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id || undefined,
      name: item.product?.name || 'Product',
      price: item.price,
      quantity: item.quantity,
      image: item.product?.images && item.product.images.length > 0 
        ? item.product.images[0].url 
        : undefined,
      url: `/products/${item.product?.slug || ''}`,
      subtotal: item.quantity * item.price
    }));
  }
  
  /**
   * Helper to format database cart object to Cart interface
   */
  private formatCart(cart: any): Cart {
    return {
      id: cart.id,
      userId: cart.user_id,
      sessionId: cart.session_id,
      createdAt: cart.created_at,
      updatedAt: cart.updated_at,
      isArchived: cart.is_archived,
      metadata: cart.metadata
    };
  }
  
  /**
   * Helper to format database cart item object to CartItem interface
   */
  private formatCartItem(item: any): CartItem {
    return {
      id: item.id,
      cartId: item.cart_id,
      productId: item.product_id,
      variantId: item.variant_id,
      quantity: item.quantity,
      price: item.price,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      metadata: item.metadata,
      product: item.product
    };
  }
}

// Export singleton instance
export const cartRepository = new CartRepository(); 