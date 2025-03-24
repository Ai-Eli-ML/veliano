import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { 
  type WishlistItem, 
  type WishlistItemWithProduct,
  type AddToWishlistInput, 
  type UpdateWishlistItemInput
} from '@/types/wishlist';

export class WishlistRepository {
  /**
   * Get a user's wishlist, creating one if it doesn't exist
   */
  static async getOrCreateWishlist(userId: string) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Check if user already has a wishlist
    const { data: existingWishlist, error: fetchError } = await supabase
      .from('wishlists')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if user doesn't have a wishlist yet
      console.error('Error fetching wishlist:', fetchError)
      throw new Error('Failed to fetch wishlist')
    }

    // If wishlist exists, return it
    if (existingWishlist) {
      return existingWishlist
    }

    // Create a new wishlist for the user
    const { data: newWishlist, error: createError } = await supabase
      .from('wishlists')
      .insert({
        user_id: userId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating wishlist:', createError)
      throw new Error('Failed to create wishlist')
    }

    return newWishlist
  }

  /**
   * Get items in a user's wishlist
   */
  static async getWishlistItems(userId: string) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // First get the wishlist id
    const wishlist = await this.getOrCreateWishlist(userId)

    // Then get all items in the wishlist with product details
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('wishlist_id', wishlist.id)
      .order('added_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlist items:', error)
      throw new Error('Failed to fetch wishlist items')
    }

    return data || []
  }

  /**
   * Add a product to a user's wishlist
   */
  static async addToWishlist(userId: string, productId: string) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // First get the wishlist id
    const wishlist = await this.getOrCreateWishlist(userId)

    // Check if the item is already in the wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('wishlist_id', wishlist.id)
      .eq('product_id', productId)
      .single()

    if (existingItem) {
      // Item already exists in wishlist
      return { success: true, message: 'Item already in wishlist' }
    }

    // Add the product to the wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        wishlist_id: wishlist.id,
        product_id: productId,
        added_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error adding to wishlist:', error)
      throw new Error('Failed to add item to wishlist')
    }

    return { success: true, message: 'Item added to wishlist' }
  }

  /**
   * Remove a product from a user's wishlist
   */
  static async removeFromWishlist(userId: string, productId: string) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // First get the wishlist id
    const wishlist = await this.getOrCreateWishlist(userId)

    // Remove the product from the wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('wishlist_id', wishlist.id)
      .eq('product_id', productId)

    if (error) {
      console.error('Error removing from wishlist:', error)
      throw new Error('Failed to remove item from wishlist')
    }

    return { success: true, message: 'Item removed from wishlist' }
  }

  /**
   * Check if a product is in a user's wishlist
   */
  static async isInWishlist(userId: string, productId: string) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
      // First get the wishlist id
      const wishlist = await this.getOrCreateWishlist(userId)

      // Check if the product is in the wishlist
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('wishlist_id', wishlist.id)
        .eq('product_id', productId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is expected if product isn't in wishlist
        console.error('Error checking wishlist:', error)
        throw new Error('Failed to check wishlist status')
      }

      return !!data
    } catch (error) {
      // If the user doesn't have a wishlist yet, the product isn't in it
      return false
    }
  }

  /**
   * Clear all items from a user's wishlist
   */
  static async clearWishlist(userId: string) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // First get the wishlist id
    const wishlist = await this.getOrCreateWishlist(userId)

    // Remove all products from the wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('wishlist_id', wishlist.id)

    if (error) {
      console.error('Error clearing wishlist:', error)
      throw new Error('Failed to clear wishlist')
    }

    return { success: true, message: 'Wishlist cleared' }
  }

  /**
   * Get all wishlist items for a user with products
   */
  async getWishlistItemsByUserId(
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WishlistItemWithProduct[]> {
    let query = this.supabase
      .from('wishlist_items')
      .select(\`
        *,
        products (*)
      \`)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as WishlistItemWithProduct[];
  }

  /**
   * Get wishlist item count for a user
   */
  async getWishlistItemCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('wishlist_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Update a wishlist item
   */
  async updateWishlistItem(
    userId: string, 
    productId: string, 
    data: UpdateWishlistItemInput
  ): Promise<WishlistItem> {
    const { data: item, error } = await this.supabase
      .from('wishlist_items')
      .update({
        notes: data.notes,
      })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) throw error;
    return item as WishlistItem;
  }

  /**
   * Toggle a product in a user's wishlist
   * Adds it if not present, removes it if already present
   */
  async toggleWishlistItem(userId: string, productId: string): Promise<{ added: boolean }> {
    const isInWishlist = await this.isProductInWishlist(userId, productId);
    
    if (isInWishlist) {
      await this.removeFromWishlist(userId, productId);
      return { added: false };
    } else {
      await this.addToWishlist(userId, productId);
      return { added: true };
    }
  }
}
