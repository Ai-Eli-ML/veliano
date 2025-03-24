'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import RatingStars from './RatingStars';
import { notifySuccess, notifyError } from '@/lib/notification';
import { trackReviewSubmitted } from '@/lib/analytics';

interface ReviewFormProps {
  productId: string;
  onSubmit: (review: { rating: number; comment: string; product_id: string }) => void;
  onCancel: () => void;
}

export default function ReviewForm({ productId, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const validate = () => {
    const newErrors: { rating?: string; comment?: string } = {};
    let isValid = true;

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
      isValid = false;
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please enter a review comment';
      isValid = false;
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ rating, comment, product_id: productId }),
      // })
      
      // const data = await response.json()
      
      // if (data.success) {
      //   notifySuccess('Your review has been submitted successfully!')
      //   onSubmit({ rating, comment, product_id: productId })
      // } else {
      //   notifyError(data.error || 'Failed to submit review')
      // }

      // For now, we'll just call onSubmit directly
      onSubmit({ rating, comment, product_id: productId });
      notifySuccess('Your review has been submitted successfully!');
      
      // Track the review submission in analytics
      trackReviewSubmitted(productId, rating);
    } catch (error) {
      console.error('Error submitting review:', error);
      notifyError('An unexpected error occurred while submitting your review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="mb-2 flex items-center">
          <span className="mr-3 text-sm font-medium">Your Rating</span>
          <RatingStars 
            rating={rating} 
            interactive={true}
            onRatingChange={(value) => {
              setRating(value);
              setErrors({ ...errors, rating: undefined });
            }}
          />
        </div>
        {errors.rating && (
          <p className="mt-1 text-xs text-red-500">{errors.rating}</p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setComment(e.target.value);
            if (e.target.value.trim().length >= 10) {
              setErrors({ ...errors, comment: undefined });
            }
          }}
          rows={5}
          className={errors.comment ? 'border-red-500' : ''}
        />
        {errors.comment && (
          <p className="mt-1 text-xs text-red-500">{errors.comment}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
}
