
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
