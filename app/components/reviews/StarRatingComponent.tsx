
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
