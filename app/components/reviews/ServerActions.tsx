
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ReviewsRepository } from '@/repositories/ReviewsRepository';
import { 
  type CreateReviewInput, 
  type UpdateReviewInput 
} from '@/types/reviews';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const reviewsRepository = new ReviewsRepository();

/**
 * Create a new review
 */
export async function createReview(formData: CreateReviewInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to leave a review' };
    }

    // Validate input
    const schema = z.object({
      product_id: z.string().uuid(),
      rating: z.number().min(1).max(5),
      title: z.string().max(100).optional(),
      content: z.string().max(1000).optional(),
    });

    const validatedData = schema.parse(formData);

    // Check if user has already reviewed this product
    const existingReview = await reviewsRepository.getUserReviewForProduct(
      user.id,
      validatedData.product_id
    );

    if (existingReview) {
      return { 
        success: false, 
        error: 'You have already reviewed this product' 
      };
    }

    // Create the review
    const review = await reviewsRepository.createReview(user.id, validatedData);

    // Revalidate product page to show the new review
    revalidatePath(\`/products/\${validatedData.product_id}\`);
    
    return { 
      success: true, 
      data: review 
    };
  } catch (error) {
    console.error('Failed to create review:', error);
    return { 
      success: false, 
      error: 'Failed to create review. Please try again.' 
    };
  }
}

/**
 * Update an existing review
 */
export async function updateReview(reviewId: string, formData: UpdateReviewInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to update a review' };
    }

    // Validate input
    const schema = z.object({
      rating: z.number().min(1).max(5).optional(),
      title: z.string().max(100).optional(),
      content: z.string().max(1000).optional(),
    });

    const validatedData = schema.parse(formData);

    // Update the review
    const review = await reviewsRepository.updateReview(user.id, reviewId, validatedData);

    // Revalidate the product page
    revalidatePath(\`/products/\${review.product_id}\`);
    
    return { 
      success: true, 
      data: review 
    };
  } catch (error) {
    console.error('Failed to update review:', error);
    return { 
      success: false, 
      error: 'Failed to update review. Please try again.' 
    };
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string, productId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to delete a review' };
    }

    // Delete the review
    await reviewsRepository.deleteReview(user.id, reviewId);

    // Revalidate the product page
    revalidatePath(\`/products/\${productId}\`);
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error('Failed to delete review:', error);
    return { 
      success: false, 
      error: 'Failed to delete review. Please try again.' 
    };
  }
}

/**
 * Mark a review as helpful
 */
export async function markReviewAsHelpful(reviewId: string, productId: string) {
  try {
    await reviewsRepository.markReviewAsHelpful(reviewId);
    
    // Revalidate the product page
    revalidatePath(\`/products/\${productId}\`);
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error('Failed to mark review as helpful:', error);
    return { 
      success: false, 
      error: 'Failed to mark review as helpful. Please try again.' 
    };
  }
}
