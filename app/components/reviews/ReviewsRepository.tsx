
import { createClient } from '@/lib/supabase/server';
import { type Database } from '@/types/supabase';
import { 
  type Review, 
  type CreateReviewInput, 
  type UpdateReviewInput,
  type ReviewWithUser,
  type ProductRatingStats
} from '@/types/reviews';

export class ReviewsRepository {
  private supabase = createClient();

  /**
   * Get all reviews for a specific product with pagination
   */
  async getReviewsByProductId(
    productId: string,
    options?: { limit?: number; offset?: number; sort?: 'newest' | 'highest_rating' | 'lowest_rating' | 'most_helpful' }
  ): Promise<ReviewWithUser[]> {
    let query = this.supabase
      .from('reviews')
      .select(\`
        *,
        profiles (
          id,
          full_name,
          avatar_url
        )
      \`)
      .eq('product_id', productId);

    // Apply sorting
    if (options?.sort) {
      switch (options.sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'highest_rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'lowest_rating':
          query = query.order('rating', { ascending: true });
          break;
        case 'most_helpful':
          query = query.order('helpful_votes', { ascending: false });
          break;
      }
    } else {
      // Default sort by newest
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as ReviewWithUser[];
  }

  /**
   * Get a user's review for a specific product
   */
  async getUserReviewForProduct(userId: string, productId: string): Promise<Review | null> {
    const { data, error } = await this.supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned" error
    return data as Review | null;
  }

  /**
   * Create a new review
   */
  async createReview(userId: string, reviewData: CreateReviewInput): Promise<Review> {
    const { data, error } = await this.supabase
      .from('reviews')
      .insert({
        user_id: userId,
        product_id: reviewData.product_id,
        rating: reviewData.rating,
        title: reviewData.title || null,
        content: reviewData.content || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  }

  /**
   * Update an existing review
   */
  async updateReview(userId: string, reviewId: string, reviewData: UpdateReviewInput): Promise<Review> {
    const { data, error } = await this.supabase
      .from('reviews')
      .update({
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .eq('user_id', userId) // Ensure user can only update their own reviews
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  }

  /**
   * Delete a review
   */
  async deleteReview(userId: string, reviewId: string): Promise<void> {
    const { error } = await this.supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId); // Ensure user can only delete their own reviews

    if (error) throw error;
  }

  /**
   * Mark a review as helpful (increment helpful_votes)
   */
  async markReviewAsHelpful(reviewId: string): Promise<void> {
    const { error } = await this.supabase.rpc('increment_review_helpful_votes', {
      review_id: reviewId,
    });

    if (error) throw error;
  }

  /**
   * Get rating statistics for a product
   */
  async getProductRatingStats(productId: string): Promise<ProductRatingStats> {
    // Get the average rating and total reviews
    const { data: statsData, error: statsError } = await this.supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (statsError) throw statsError;

    // Calculate the average and distribution
    const reviews = statsData || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    // Calculate rating distribution
    const ratingDistribution: { [key: number]: number } = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    reviews.forEach(review => {
      ratingDistribution[review.rating] += 1;
    });

    return {
      average_rating: Number(averageRating.toFixed(1)),
      total_reviews: totalReviews,
      rating_distribution: ratingDistribution
    };
  }
}
