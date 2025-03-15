"use client"

import { useState } from "react"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Star, ThumbsUp, AlertTriangle } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { ReviewForm } from "@/components/products/review-form"
import type { ProductReview, ReviewStats } from "@/types/review"
import { markReviewHelpful, deleteReview } from "@/actions/reviews"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ProductReviewsProps {
  productId: string
  reviews: ProductReview[]
  stats: ReviewStats
}

export function ProductReviews({ productId, reviews, stats }: ProductReviewsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({})
  const [localReviews, setLocalReviews] = useState<ProductReview[]>(reviews)

  // Check if user has already reviewed this product
  const hasReviewed = localReviews.some((review) => user && review.userId === user.id)

  const handleMarkHelpful = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to mark a review as helpful",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await markReviewHelpful(reviewId)

      if (result.success) {
        // Update local state
        setHelpfulReviews((prev) => ({
          ...prev,
          [reviewId]: result.action === "added",
        }))

        // Update review helpful count in local reviews
        setLocalReviews((prev) =>
          prev.map((review) => {
            if (review.id === reviewId) {
              return {
                ...review,
                helpfulCount: result.action === "added" ? review.helpfulCount + 1 : review.helpfulCount - 1,
              }
            }
            return review
          }),
        )

        toast({
          title: result.action === "added" ? "Marked as helpful" : "Removed helpful mark",
          description:
            result.action === "added"
              ? "You marked this review as helpful"
              : "You removed your helpful mark from this review",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark review as helpful",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking review as helpful:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return

    if (!confirm("Are you sure you want to delete this review?")) {
      return
    }

    try {
      const result = await deleteReview(reviewId)

      if (result.success) {
        // Remove review from local state
        setLocalReviews((prev) => prev.filter((review) => review.id !== reviewId))

        toast({
          title: "Review deleted",
          description: "Your review has been successfully deleted",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete review",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleReviewSubmitted = (newReview: ProductReview) => {
    setLocalReviews((prev) => [newReview, ...prev])
    setShowReviewForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Review Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Average Rating */}
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</span>
                  <span className="ml-2 text-2xl text-muted-foreground">/ 5</span>
                </div>
                <div className="mt-2 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(stats.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingCounts[rating as keyof typeof stats.ratingCounts]
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex w-12 justify-end">
                        <span className="text-sm">{rating} star</span>
                      </div>
                      <Progress value={percentage} className="h-2 flex-1" />
                      <div className="w-8 text-right text-sm text-muted-foreground">{count}</div>
                    </div>
                  )
                })}
              </div>

              {/* Write Review Button */}
              {user ? (
                hasReviewed ? (
                  <div className="mt-4 rounded-md bg-muted p-3 text-center text-sm">
                    You've already reviewed this product
                  </div>
                ) : (
                  <Button onClick={() => setShowReviewForm(true)} className="mt-4 w-full" disabled={showReviewForm}>
                    Write a Review
                  </Button>
                )
              ) : (
                <div className="mt-4 rounded-md bg-muted p-3 text-center text-sm">
                  <Link href="/account/login" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to write a review
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Review Form or Reviews List */}
        <div>
          {showReviewForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>Share your experience with this product</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewForm
                  productId={productId}
                  onSuccess={handleReviewSubmitted}
                  onCancel={() => setShowReviewForm(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {localReviews.length > 0 ? (
                  <div className="space-y-6">
                    {localReviews.map((review) => (
                      <div key={review.id} className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={review.userAvatar} alt={review.userName} />
                              <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.userName}</div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(review.createdAt, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delete button for user's own reviews */}
                          {user && review.userId === user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              Delete
                            </Button>
                          )}
                        </div>

                        <div>
                          <h4 className="font-medium">{review.title}</h4>
                          <p className="mt-1 text-muted-foreground">{review.content}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkHelpful(review.id)}
                              className={helpfulReviews[review.id] ? "text-primary" : ""}
                            >
                              <ThumbsUp className="mr-1 h-4 w-4" />
                              Helpful ({review.helpfulCount})
                            </Button>
                          </div>

                          {review.isVerifiedPurchase && (
                            <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Verified Purchase
                            </div>
                          )}
                        </div>

                        <Separator />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <AlertTriangle className="mb-2 h-8 w-8 text-muted-foreground" />
                    <h3 className="font-medium">No reviews yet</h3>
                    <p className="text-sm text-muted-foreground">Be the first to review this product</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

