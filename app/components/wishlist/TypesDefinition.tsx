
import { Database } from '@/types/supabase';
import { Product } from '@/types/products';

export interface WishlistItem extends Database['public']['Tables']['wishlist_items']['Row'] {
  // Base type from Supabase schema
}

export interface WishlistItemWithProduct extends WishlistItem {
  products: Product;
}

export interface AddToWishlistInput {
  product_id: string;
  notes?: string;
}

export interface UpdateWishlistItemInput {
  notes?: string;
}
