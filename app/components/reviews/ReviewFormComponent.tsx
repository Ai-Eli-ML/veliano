
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
