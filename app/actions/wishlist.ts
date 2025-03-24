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
import { getCurrentUserId } from '@/lib/session'

const wishlistRepository = new WishlistRepository();

/**
 * Get the current user's wishlist items
 */
export async function getWishlistItems() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const items = await WishlistRepository.getWishlistItems(userId)
    return { success: true, data: items }
  } catch (error) {
    console.error('Error fetching wishlist items:', error)
    return { success: false, error: 'Failed to fetch wishlist items' }
  }
}

/**
 * Add a product to the wishlist
 */
export async function addToWishlist(productId: string) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const result = await WishlistRepository.addToWishlist(userId, productId)
    
    // Revalidate the wishlist page and product page
    revalidatePath('/wishlist')
    revalidatePath(`/products/${productId}`)
    
    return result
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return { success: false, error: 'Failed to add item to wishlist' }
  }
}

/**
 * Remove a product from the wishlist
 */
export async function removeFromWishlist(productId: string) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const result = await WishlistRepository.removeFromWishlist(userId, productId)
    
    // Revalidate the wishlist page and product page
    revalidatePath('/wishlist')
    revalidatePath(`/products/${productId}`)
    
    return result
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return { success: false, error: 'Failed to remove item from wishlist' }
  }
}

/**
 * Check if a product is in the wishlist
 */
export async function isInWishlist(productId: string) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: 'User not authenticated', isInWishlist: false }
    }

    const isInWishlist = await WishlistRepository.isInWishlist(userId, productId)
    return { success: true, isInWishlist }
  } catch (error) {
    console.error('Error checking wishlist status:', error)
    return { success: false, error: 'Failed to check wishlist status', isInWishlist: false }
  }
}

/**
 * Toggle wishlist status (add if not in wishlist, remove if in wishlist)
 */
export async function toggleWishlist(productId: string) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const isInWishlist = await WishlistRepository.isInWishlist(userId, productId)
    
    if (isInWishlist) {
      await WishlistRepository.removeFromWishlist(userId, productId)
      revalidatePath('/wishlist')
      revalidatePath(`/products/${productId}`)
      return { success: true, message: 'Item removed from wishlist', added: false }
    } else {
      await WishlistRepository.addToWishlist(userId, productId)
      revalidatePath('/wishlist')
      revalidatePath(`/products/${productId}`)
      return { success: true, message: 'Item added to wishlist', added: true }
    }
  } catch (error) {
    console.error('Error toggling wishlist status:', error)
    return { success: false, error: 'Failed to update wishlist', added: false }
  }
}

/**
 * Clear all items from the wishlist
 */
export async function clearWishlist() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: 'User not authenticated' }
    }

    const result = await WishlistRepository.clearWishlist(userId)
    
    // Revalidate the wishlist page
    revalidatePath('/wishlist')
    
    return result
  } catch (error) {
    console.error('Error clearing wishlist:', error)
    return { success: false, error: 'Failed to clear wishlist' }
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
