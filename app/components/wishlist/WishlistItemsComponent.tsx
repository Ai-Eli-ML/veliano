
'use client';

import { type FC } from 'react';
import { type WishlistItemWithProduct } from '@/types/wishlist';
import { removeFromWishlist } from '@/actions/wishlist';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination } from '@/components/ui/pagination';
import { addToCart } from '@/actions/cart';

interface WishlistItemsProps {
  items: WishlistItemWithProduct[];
  totalCount: number;
  page: number;
  perPage: number;
}

export const WishlistItems: FC<WishlistItemsProps> = ({
  items,
  totalCount,
  page,
  perPage
}) => {
  const { toast } = useToast();
  const totalPages = Math.ceil(totalCount / perPage);
  
  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeFromWishlist(productId);
      
      if (result.success) {
        toast({
          title: 'Item removed',
          description: 'The item has been removed from your wishlist',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to remove item from wishlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const handleAddToCart = async (productId: string) => {
    try {
      const result = await addToCart({ productId, quantity: 1 });
      
      if (result.success) {
        toast({
          title: 'Added to cart',
          description: 'The item has been added to your cart',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add item to cart',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col md:flex-row gap-4 border border-gray-200 p-4 rounded-lg"
          >
            <div className="relative h-32 w-32 overflow-hidden rounded-md">
              <Image
                src={item.products.image_url || '/images/product-placeholder.png'}
                alt={item.products.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <Link 
                href={\`/products/\${item.products.id}\`}
                className="text-lg font-medium hover:underline"
              >
                {item.products.name}
              </Link>
              
              <p className="font-semibold text-lg">
                {formatCurrency(item.products.price)}
              </p>
              
              {item.notes && (
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Notes:</span> {item.notes}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => handleAddToCart(item.product_id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleRemoveItem(item.product_id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl="/wishlist?page=" 
        />
      )}
    </div>
  );
};
