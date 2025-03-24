
'use client';

import { type FC, useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleWishlistItem } from '@/actions/wishlist';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  initialIsInWishlist: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const WishlistButton: FC<WishlistButtonProps> = ({
  productId,
  initialIsInWishlist,
  variant = 'outline',
  size = 'icon',
  className,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleWishlist = async () => {
    setIsLoading(true);
    
    try {
      const result = await toggleWishlistItem(productId);
      
      if (result.success) {
        setIsInWishlist(result.added);
        
        toast({
          title: result.added ? 'Added to wishlist' : 'Removed from wishlist',
          description: result.added 
            ? 'This item has been added to your wishlist' 
            : 'This item has been removed from your wishlist',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update wishlist',
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
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'transition-colors',
        isInWishlist && 'text-red-500 hover:text-red-600',
        className
      )}
      disabled={isLoading}
      onClick={handleToggleWishlist}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={cn(
          'h-5 w-5',
          isInWishlist && 'fill-current'
        )} 
      />
      {variant !== 'icon' && (
        <span className="ml-2">
          {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
};
