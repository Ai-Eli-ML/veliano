'use client'

import React, { useState, useEffect } from 'react'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../providers/auth-provider'

interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string
  created_at: string
  user: {
    name: string
    avatar_url?: string
  }
}

interface ReviewsListProps {
  productId: string
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products/${productId}/reviews`)
        const data = await response.json()
        
        if (data.success) {
          setReviews(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReviews()
  }, [productId])
  
  const handleReviewSubmit = (newReview: Omit<Review, 'id' | 'user' | 'created_at'>) => {
    // This would be replaced with actual API call in a real implementation
    const fakeReview: Review = {
      id: Math.random().toString(36).substring(2, 9),
      user_id: user?.id || '',
      product_id: productId,
      rating: newReview.rating,
      comment: newReview.comment,
      created_at: new Date().toISOString(),
      user: {
        name: user?.email?.split('@')[0] || 'Anonymous',
        avatar_url: undefined
      }
    }
    
    setReviews([fakeReview, ...reviews])
    setShowForm(false)
  }
  
  // Calculate average rating
  const avgRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0
  
  // Group reviews by rating
  const reviewsByRating = reviews.reduce((acc, review) => {
    const rating = review.rating
    if (!acc[rating]) {
      acc[rating] = []
    }
    acc[rating].push(review)
    return acc
  }, {} as Record<number, Review[]>)
  
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading reviews...</span>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          <div className="mt-2">
            <span className="text-lg font-medium">{avgRating.toFixed(1)}</span>
            <span className="ml-1 text-sm text-muted-foreground">
              out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
        
        {user && !showForm && (
          <Button onClick={() => setShowForm(true)}>Write a Review</Button>
        )}
      </div>
      
      {showForm && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-medium">Write a Review</h3>
          <ReviewForm 
            productId={productId} 
            onSubmit={handleReviewSubmit} 
            onCancel={() => setShowForm(false)} 
          />
        </div>
      )}
      
      {reviews.length > 0 ? (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            {[5, 4, 3, 2, 1].map(rating => 
              reviewsByRating[rating] && (
                <TabsTrigger key={rating} value={rating.toString()}>
                  {rating} Star ({reviewsByRating[rating].length})
                </TabsTrigger>
              )
            )}
          </TabsList>
          
          <TabsContent value="all" className="mt-6 space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </TabsContent>
          
          {[5, 4, 3, 2, 1].map(rating => 
            reviewsByRating[rating] && (
              <TabsContent key={rating} value={rating.toString()} className="mt-6 space-y-4">
                {reviewsByRating[rating].map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </TabsContent>
            )
          )}
        </Tabs>
      ) : (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          {!user && (
            <p className="mt-2 text-sm text-muted-foreground">
              Please sign in to write a review.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
