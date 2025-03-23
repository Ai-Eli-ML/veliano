import { Star } from "lucide-react"

interface ProductRatingProps {
  rating: number
  count: number
  size?: "sm" | "md" | "lg"
}

export function ProductRating({ 
  rating, 
  count, 
  size = "md" 
}: ProductRatingProps) {
  // Size mapping for star icons
  const sizeMap = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }
  
  // Size mapping for text
  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }
  
  const starSize = sizeMap[size]
  const textSize = textSizeMap[size]

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < Math.floor(rating)
                ? "fill-primary text-primary"
                : "fill-muted stroke-muted-foreground"
            }`}
          />
        ))}
      </div>
      <span className={`ml-2 ${textSize} text-muted-foreground`}>
        {rating.toFixed(1)} ({count} reviews)
      </span>
    </div>
  )
} 