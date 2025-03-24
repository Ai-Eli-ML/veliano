
import { createClient } from '@/lib/supabase/server';
import { type Database } from '@/types/supabase';
import { 
  type WishlistItem, 
  type WishlistItemWithProduct,
  type AddToWishlistInput, 
  type UpdateWishlistItemInput
} from '@/types/wishlist';

export class WishlistRepository {
  private supabase = createClient();

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
   * Check if a product is in a user's wishlist
   */
  async isProductInWishlist(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned" error
    return !!data;
  }

  /**
   * Add a product to a user's wishlist
   */
  async addToWishlist(userId: string, data: AddToWishlistInput): Promise<WishlistItem> {
    const { data: item, error } = await this.supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: data.product_id,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return item as WishlistItem;
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
   * Remove a product from a user's wishlist
   */
  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await this.supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
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
      await this.addToWishlist(userId, { product_id: productId });
      return { added: true };
    }
  }
}
