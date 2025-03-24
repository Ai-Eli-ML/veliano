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
import { cookies } from 'next/headers';
import { getCurrentUserId } from '@/lib/session';

const reviewsRepository = new ReviewsRepository();

// Schema for validating review submissions
const reviewSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters')
});

export type ReviewData = z.infer<typeof reviewSchema>;

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

export async function submitReview(data: ReviewData) {
  try {
    // Validate data
    const validatedData = reviewSchema.parse(data);
    
    // Make sure user is authenticated
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: 'You must be logged in to submit a review' };
    }
    
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Check if user already has a review for this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', validatedData.productId)
      .eq('user_id', userId)
      .single();
    
    let result;
    if (existingReview) {
      // Update existing review
      result = await supabase
        .from('reviews')
        .update({
          rating: validatedData.rating,
          comment: validatedData.comment,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReview.id);
    } else {
      // Create new review
      result = await supabase
        .from('reviews')
        .insert({
          product_id: validatedData.productId,
          user_id: userId,
          rating: validatedData.rating,
          comment: validatedData.comment,
          created_at: new Date().toISOString()
        });
    }
    
    if (result.error) {
      console.error('Error submitting review:', result.error);
      return { success: false, error: 'Failed to submit review' };
    }
    
    // Revalidate product and reviews pages to show updated content
    revalidatePath(`/products/${validatedData.productId}`);
    
    return { 
      success: true, 
      message: existingReview 
        ? 'Your review has been updated' 
        : 'Your review has been submitted'
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation error
      const fieldErrors = error.errors.reduce((acc, curr) => {
        const field = curr.path[0];
        return { ...acc, [field]: curr.message };
      }, {});
      return { success: false, error: 'Validation failed', fieldErrors };
    }
    
    console.error('Unexpected error submitting review:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteReview(reviewId: string, productId: string) {
  try {
    // Make sure user is authenticated
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: 'You must be logged in to delete a review' };
    }
    
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // First verify the review belongs to the user
    const { data: review } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();
    
    if (!review) {
      return { success: false, error: 'Review not found' };
    }
    
    if (review.user_id !== userId) {
      return { success: false, error: 'You can only delete your own reviews' };
    }
    
    // Delete the review
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    
    if (error) {
      console.error('Error deleting review:', error);
      return { success: false, error: 'Failed to delete review' };
    }
    
    // Revalidate the product page
    revalidatePath(`/products/${productId}`);
    
    return { success: true, message: 'Review deleted successfully' };
  } catch (error) {
    console.error('Unexpected error deleting review:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
