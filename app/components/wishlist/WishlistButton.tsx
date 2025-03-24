'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlist, isInWishlist } from '@/actions/wishlist';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  variant?: 'default' | 'outline' | 'ghost' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
  className?: string;
}

export default function WishlistButton({
  productId,
  variant = 'outline',
  size = 'icon',
  showText = false,
  className
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn } = useAuth();

  useEffect(() => {
    // Check if the product is in the wishlist
    const checkWishlistStatus = async () => {
      if (user) {
        const result = await isInWishlist(productId);
        if (result.success) {
          setIsWishlisted(result.isInWishlist);
        }
      }
    };

    checkWishlistStatus();
  }, [productId, user]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Prompt login if user is not authenticated
      signIn();
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleWishlist(productId);
      if (result.success) {
        setIsWishlisted(result.added);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        'relative',
        isWishlisted && 'text-red-500',
        className
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          'h-[1.2rem] w-[1.2rem]',
          isWishlisted && 'fill-current text-red-500',
          isLoading && 'animate-pulse'
        )}
      />
      {showText && (
        <span className="ml-2">
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </Button>
  );
}
