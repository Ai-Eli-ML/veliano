import React from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: number
  className?: string
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 24,
  className,
  interactive = false,
  onRatingChange
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = React.useState(0)
  
  const handleClick = (selectedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(selectedRating)
    }
  }
  
  const handleMouseEnter = (hoveredRating: number) => {
    if (interactive) {
      setHoverRating(hoveredRating)
    }
  }
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }
  
  const displayRating = hoverRating > 0 ? hoverRating : rating
  
  return (
    <div className={cn("flex", className)}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= displayRating
        const halfFilled = !isFilled && starValue <= displayRating + 0.5
        
        return (
          <span
            key={i}
            className={cn(
              "relative cursor-default transition-colors",
              interactive && "cursor-pointer",
              isFilled ? "text-yellow-400" : "text-gray-300"
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            style={{ width: size, height: size }}
          >
            <Star
              size={size}
              fill={isFilled ? "currentColor" : "none"}
              strokeWidth={1.5}
              className={cn(
                "transition-transform",
                interactive && hoverRating === starValue && "scale-110"
              )}
            />
            {halfFilled && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star
                  size={size}
                  fill="currentColor"
                  strokeWidth={1.5}
                  className="text-yellow-400"
                />
              </div>
            )}
          </span>
        )
      })}
    </div>
  )
} 