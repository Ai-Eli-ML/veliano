
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { WishlistRepository } from '@/repositories/WishlistRepository';
import { 
  type AddToWishlistInput, 
  type UpdateWishlistItemInput 
} from '@/types/wishlist';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const wishlistRepository = new WishlistRepository();

/**
 * Add a product to the wishlist
 */
export async function addToWishlist(formData: AddToWishlistInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to add items to your wishlist' };
    }

    // Validate input
    const schema = z.object({
      product_id: z.string().uuid(),
      notes: z.string().max(500).optional(),
    });

    const validatedData = schema.parse(formData);

    // Check if already in wishlist
    const isInWishlist = await wishlistRepository.isProductInWishlist(
      user.id,
      validatedData.product_id
    );

    if (isInWishlist) {
      return { 
        success: false, 
        error: 'This product is already in your wishlist' 
      };
    }

    // Add to wishlist
    const item = await wishlistRepository.addToWishlist(user.id, validatedData);

    // Revalidate paths
    revalidatePath('/wishlist');
    revalidatePath(\`/products/\${validatedData.product_id}\`);
    
    return { 
      success: true, 
      data: item 
    };
  } catch (error) {
    console.error('Failed to add item to wishlist:', error);
    return { 
      success: false, 
      error: 'Failed to add item to wishlist. Please try again.' 
    };
  }
}

/**
 * Remove a product from the wishlist
 */
export async function removeFromWishlist(productId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to remove items from your wishlist' };
    }

    // Remove from wishlist
    await wishlistRepository.removeFromWishlist(user.id, productId);

    // Revalidate paths
    revalidatePath('/wishlist');
    revalidatePath(\`/products/\${productId}\`);
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('Failed to remove item from wishlist:', error);
    return { 
      success: false, 
      error: 'Failed to remove item from wishlist. Please try again.' 
    };
  }
}

/**
 * Toggle a product in the wishlist
 */
export async function toggleWishlistItem(productId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to update your wishlist' };
    }

    // Toggle item in wishlist
    const result = await wishlistRepository.toggleWishlistItem(user.id, productId);

    // Revalidate paths
    revalidatePath('/wishlist');
    revalidatePath(\`/products/\${productId}\`);
    
    return { 
      success: true,
      added: result.added
    };
  } catch (error) {
    console.error('Failed to toggle wishlist item:', error);
    return { 
      success: false, 
      error: 'Failed to update wishlist. Please try again.' 
    };
  }
}

/**
 * Update a wishlist item
 */
export async function updateWishlistItem(productId: string, formData: UpdateWishlistItemInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to update your wishlist' };
    }

    // Validate input
    const schema = z.object({
      notes: z.string().max(500).optional(),
    });

    const validatedData = schema.parse(formData);

    // Update wishlist item
    const item = await wishlistRepository.updateWishlistItem(user.id, productId, validatedData);

    // Revalidate path
    revalidatePath('/wishlist');
    
    return { 
      success: true, 
      data: item 
    };
  } catch (error) {
    console.error('Failed to update wishlist item:', error);
    return { 
      success: false, 
      error: 'Failed to update wishlist item. Please try again.' 
    };
  }
}
