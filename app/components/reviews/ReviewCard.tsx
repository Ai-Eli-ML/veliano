import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import RatingStars from './RatingStars'
import { formatDate } from '@/lib/utils'

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

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start space-y-0 pb-2">
        <div className="flex flex-1 items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={review.user.avatar_url || ''} alt={review.user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{review.user.name}</div>
            <div className="flex items-center">
              <RatingStars rating={review.rating} size={16} />
              <span className="ml-2 text-sm text-muted-foreground">
                {formatDate(review.created_at)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{review.comment}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <span>Verified Purchase</span>
      </CardFooter>
    </Card>
  )
}
