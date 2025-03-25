/**
 * Reviews System Template
 * For Phase 4 of Veliano E-commerce Project
 */

/**
 * Database Schema Template
 */
export const databaseSchema = `
-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (product_id, user_id)
);

-- Enable RLS and add policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reviews" 
  ON reviews FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON reviews FOR DELETE 
  USING (auth.uid() = user_id);
`;

/**
 * TypeScript Types Template
 */
export const typesDefinition = `
import { Database } from '@/types/supabase';

export interface Review extends Database['public']['Tables']['reviews']['Row'] {
  // Base type from Supabase schema
}

export interface CreateReviewInput {
  product_id: string;
  rating: number;
  title?: string;
  content?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  content?: string;
}

export interface ReviewWithUser extends Review {
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ProductRatingStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: number]: number; // key: rating (1-5), value: count
  };
}
`;

/**
 * Repository Template
 */
export const reviewsRepository = `
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
`;

/**
 * Server Actions Template
 */
export const serverActions = `
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
`;

/**
 * Component Templates
 */

// Reviews List Component
export const reviewsListComponent = `
import { type FC } from 'react';
import { ReviewCard } from './ReviewCard';
import { type ReviewWithUser } from '@/types/reviews';
import { Pagination } from '@/components/ui/pagination';

interface ReviewsListProps {
  reviews: ReviewWithUser[];
  productId: string;
  totalCount: number;
  page: number;
  perPage: number;
}

export const ReviewsList: FC<ReviewsListProps> = ({
  reviews,
  productId,
  totalCount,
  page,
  perPage
}) => {
  const totalPages = Math.ceil(totalCount / perPage);
  
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Customer Reviews</h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard 
            key={review.id} 
            review={review}
            productId={productId}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl={\`/products/\${productId}?reviewPage=\`} 
        />
      )}
    </div>
  );
};
`;

// Review Card Component
export const reviewCardComponent = `
import { type FC } from 'react';
import { type ReviewWithUser } from '@/types/reviews';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { markReviewAsHelpful } from '@/actions/reviews';
import { useTransition } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar } from '@/components/ui/avatar';

interface ReviewCardProps {
  review: ReviewWithUser;
  productId: string;
}

export const ReviewCard: FC<ReviewCardProps> = ({ review, productId }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const user = review.profiles;
  
  const handleMarkHelpful = () => {
    startTransition(async () => {
      const result = await markReviewAsHelpful(review.id, productId);
      
      if (result.success) {
        toast({
          title: 'Thank you!',
          description: 'You marked this review as helpful',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Something went wrong',
          variant: 'destructive',
        });
      }
    });
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            className="h-10 w-10"
            src={user?.avatar_url || undefined}
            alt={user?.full_name || 'User'}
            fallback={(user?.full_name?.charAt(0) || 'U').toUpperCase()}
          />
          <div>
            <p className="font-medium">
              {user?.full_name || 'Anonymous User'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      
      {review.title && (
        <h4 className="mt-3 font-medium">{review.title}</h4>
      )}
      
      {review.content && (
        <p className="mt-2 text-gray-700">{review.content}</p>
      )}
      
      {review.verified_purchase && (
        <div className="mt-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Verified Purchase
          </span>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {review.helpful_votes} {review.helpful_votes === 1 ? 'person' : 'people'} found this helpful
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkHelpful}
          disabled={isPending}
        >
          {isPending ? 'Processing...' : 'Mark as Helpful'}
        </Button>
      </div>
    </div>
  );
};
`;

// Review Form Component
export const reviewFormComponent = `
'use client';

import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarInput } from './StarInput';
import { createReview, updateReview } from '@/actions/reviews';
import { type CreateReviewInput, type Review } from '@/types/reviews';
import { useToast } from '@/components/ui/use-toast';

interface ReviewFormProps {
  productId: string;
  existingReview?: Review;
  onSuccess?: () => void;
}

export const ReviewForm: FC<ReviewFormProps> = ({
  productId,
  existingReview,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateReviewInput>({
    defaultValues: {
      product_id: productId,
      rating: existingReview?.rating || 0,
      title: existingReview?.title || '',
      content: existingReview?.content || '',
    },
  });
  
  const currentRating = watch('rating');
  
  const onSubmit = async (data: CreateReviewInput) => {
    if (data.rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = existingReview
        ? await updateReview(existingReview.id, {
            rating: data.rating,
            title: data.title,
            content: data.content,
          })
        : await createReview(data);
      
      if (result.success) {
        toast({
          title: existingReview ? 'Review updated' : 'Review submitted',
          description: existingReview
            ? 'Your review has been updated successfully'
            : 'Thank you for your review!',
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Something went wrong',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRatingChange = (newRating: number) => {
    setValue('rating', newRating);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingReview ? 'Edit Your Review' : 'Write a Review'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Hidden product_id field */}
          <input
            type="hidden"
            {...register('product_id')}
          />
          
          {/* Star Rating Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <StarInput 
              rating={currentRating} 
              onChange={handleRatingChange} 
              size="lg"
            />
            {errors.rating && (
              <p className="text-red-500 text-sm">
                {errors.rating.message || 'Rating is required'}
              </p>
            )}
          </div>
          
          {/* Review Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Review Title
            </label>
            <Input
              id="title"
              placeholder="Summarize your experience"
              {...register('title', { maxLength: 100 })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">
                {errors.title.message || 'Title is too long (max 100 characters)'}
              </p>
            )}
          </div>
          
          {/* Review Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Review
            </label>
            <Textarea
              id="content"
              placeholder="Share your experience with this product"
              rows={4}
              {...register('content', { maxLength: 1000 })}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">
                {errors.content.message || 'Review is too long (max 1000 characters)'}
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Submitting...' 
              : existingReview 
                ? 'Update Review' 
                : 'Submit Review'
            }
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
`;

// Star Rating Component (Display only)
export const starRatingComponent = `
import { type FC } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showEmpty?: boolean;
  className?: string;
}

export const StarRating: FC<StarRatingProps> = ({
  rating,
  size = 'md',
  showEmpty = true,
  className,
}) => {
  // Size mapping
  const sizes = {
    sm: { star: 'w-3.5 h-3.5', container: 'gap-0.5' },
    md: { star: 'w-5 h-5', container: 'gap-1' },
    lg: { star: 'w-6 h-6', container: 'gap-1' },
  };
  
  // Generate stars array
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push('half');
  }
  
  // Add empty stars if needed
  if (showEmpty) {
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }
  }
  
  return (
    <div className={cn('flex items-center', sizes[size].container, className)}>
      {stars.map((type, index) => (
        <span key={index}>
          {type === 'full' && (
            <Star className={cn('fill-yellow-400 text-yellow-400', sizes[size].star)} />
          )}
          {type === 'half' && (
            <StarHalf className={cn('fill-yellow-400 text-yellow-400', sizes[size].star)} />
          )}
          {type === 'empty' && (
            <Star className={cn('text-gray-300', sizes[size].star)} />
          )}
        </span>
      ))}
    </div>
  );
};
`;

// Star Input Component (Interactive for forms)
export const starInputComponent = `
'use client';

import { type FC, useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarInputProps {
  rating: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarInput: FC<StarInputProps> = ({
  rating,
  onChange,
  size = 'md',
  className,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  // Size mapping
  const sizes = {
    sm: { star: 'w-4 h-4', container: 'gap-1' },
    md: { star: 'w-6 h-6', container: 'gap-1' },
    lg: { star: 'w-8 h-8', container: 'gap-1.5' },
  };
  
  // Handle mouse entering a star
  const handleMouseEnter = (index: number) => {
    setHoverRating(index);
  };
  
  // Handle mouse leaving the star container
  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  
  // Handle clicking a star
  const handleClick = (index: number) => {
    onChange(index === rating ? 0 : index);
  };
  
  return (
    <div 
      className={cn('flex items-center', sizes[size].container, className)}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          className={cn(
            'cursor-pointer transition-colors',
            sizes[size].star,
            (hoverRating >= index || (!hoverRating && rating >= index))
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 hover:text-yellow-200'
          )}
          onMouseEnter={() => handleMouseEnter(index)}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};
`; 