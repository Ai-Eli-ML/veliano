
'use server';

import { revalidatePath } from 'next/cache';
import { RecommendationsRepository } from '@/repositories/RecommendationsRepository';
import { 
  type AddViewInput,
  type CreateCuratedRecommendationInput,
  type UpdateCuratedRecommendationInput,
  type RecommendationsFilterInput
} from '@/types/recommendations';
import { getCurrentUser } from '@/lib/session';
import { z } from 'zod';

const recommendationsRepository = new RecommendationsRepository();

/**
 * Log a product view
 */
export async function logProductView(productId: string) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      // For anonymous users, we could store in cookies/localStorage
      // but for simplicity, we'll skip logging
      return { success: true };
    }
    
    await recommendationsRepository.logProductView({
      product_id: productId,
      user_id: currentUser.id
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to log product view:', error);
    return { success: false };
  }
}

/**
 * Get recommended products for a product
 */
export async function getRecommendedProducts(
  productId: string,
  options: RecommendationsFilterInput = {}
) {
  try {
    const recommendations = await recommendationsRepository.getRecommendedProducts(
      productId,
      options
    );
    
    return { 
      success: true, 
      data: recommendations 
    };
  } catch (error) {
    console.error('Failed to get product recommendations:', error);
    return { 
      success: false, 
      error: 'Failed to fetch recommendations' 
    };
  }
}

/**
 * Get recently viewed products
 */
export async function getRecentlyViewedProducts(limit: number = 4) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return { 
        success: true, 
        data: [] 
      };
    }
    
    const recentProducts = await recommendationsRepository.getRecentlyViewedProducts(
      currentUser.id,
      limit
    );
    
    return { 
      success: true, 
      data: recentProducts 
    };
  } catch (error) {
    console.error('Failed to get recently viewed products:', error);
    return { 
      success: false, 
      error: 'Failed to fetch recently viewed products' 
    };
  }
}

/**
 * Create a curated recommendation (admin only)
 */
export async function createCuratedRecommendation(
  formData: CreateCuratedRecommendationInput
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return { 
        success: false, 
        error: 'Unauthorized access' 
      };
    }
    
    // Validate input
    const schema = z.object({
      product_id: z.string().uuid(),
      recommended_product_id: z.string().uuid(),
      position: z.number().int().min(1)
    });
    
    const validatedData = schema.parse(formData);
    
    const recommendation = await recommendationsRepository.createCuratedRecommendation(
      validatedData,
      currentUser.id
    );
    
    // Revalidate product page to show new recommendations
    revalidatePath('/products/[id]');
    
    return { 
      success: true, 
      data: recommendation 
    };
  } catch (error) {
    console.error('Failed to create curated recommendation:', error);
    return { 
      success: false, 
      error: 'Failed to create recommendation' 
    };
  }
}

/**
 * Update a curated recommendation (admin only)
 */
export async function updateCuratedRecommendation(
  formData: UpdateCuratedRecommendationInput
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return { 
        success: false, 
        error: 'Unauthorized access' 
      };
    }
    
    // Validate input
    const schema = z.object({
      id: z.string().uuid(),
      position: z.number().int().min(1).optional()
    });
    
    const validatedData = schema.parse(formData);
    
    const recommendation = await recommendationsRepository.updateCuratedRecommendation(
      validatedData
    );
    
    // Revalidate product page to show updated recommendations
    revalidatePath('/products/[id]');
    
    return { 
      success: true, 
      data: recommendation 
    };
  } catch (error) {
    console.error('Failed to update curated recommendation:', error);
    return { 
      success: false, 
      error: 'Failed to update recommendation' 
    };
  }
}

/**
 * Delete a curated recommendation (admin only)
 */
export async function deleteCuratedRecommendation(id: string) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return { 
        success: false, 
        error: 'Unauthorized access' 
      };
    }
    
    await recommendationsRepository.deleteCuratedRecommendation(id);
    
    // Revalidate product page to show updated recommendations
    revalidatePath('/products/[id]');
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error('Failed to delete curated recommendation:', error);
    return { 
      success: false, 
      error: 'Failed to delete recommendation' 
    };
  }
}
