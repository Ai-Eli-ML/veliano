export type ProductReview = {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  userAvatar?: string
}

export type ReviewStats = {
  averageRating: number
  totalReviews: number
  ratingCounts: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

