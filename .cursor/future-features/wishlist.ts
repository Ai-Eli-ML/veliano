/**
 * Wishlist System Template
 * For Phase 4 of Veliano E-commerce Project
 */

/**
 * Database Schema Template
 */
export const databaseSchema = `
-- Wishlist Items Table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  UNIQUE (user_id, product_id)
);

-- Enable RLS and add policies
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own wishlist items
CREATE POLICY "Users can view their own wishlist items"
  ON wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add items to their own wishlist
CREATE POLICY "Users can add items to their own wishlist"
  ON wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own wishlist items
CREATE POLICY "Users can update their own wishlist items"
  ON wishlist_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete items from their own wishlist
CREATE POLICY "Users can delete items from their own wishlist"
  ON wishlist_items FOR DELETE
  USING (auth.uid() = user_id);
`;

/**
 * TypeScript Types Template
 */
export const typesDefinition = `
import { Database } from '@/types/supabase';
import { Product } from '@/types/products';

export interface WishlistItem extends Database['public']['Tables']['wishlist_items']['Row'] {
  // Base type from Supabase schema
}

export interface WishlistItemWithProduct extends WishlistItem {
  products: Product;
}

export interface AddToWishlistInput {
  product_id: string;
  notes?: string;
}

export interface UpdateWishlistItemInput {
  notes?: string;
}
`;

/**
 * Repository Template
 */
export const wishlistRepository = `
import { createClient } from '@/lib/supabase/server';
import { type Database } from '@/types/supabase';
import { 
  type WishlistItem, 
  type WishlistItemWithProduct,
  type AddToWishlistInput, 
  type UpdateWishlistItemInput
} from '@/types/wishlist';

export class WishlistRepository {
  private supabase = createClient();

  /**
   * Get all wishlist items for a user with products
   */
  async getWishlistItemsByUserId(
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<WishlistItemWithProduct[]> {
    let query = this.supabase
      .from('wishlist_items')
      .select(\`
        *,
        products (*)
      \`)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as WishlistItemWithProduct[];
  }

  /**
   * Get wishlist item count for a user
   */
  async getWishlistItemCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('wishlist_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Check if a product is in a user's wishlist
   */
  async isProductInWishlist(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned" error
    return !!data;
  }

  /**
   * Add a product to a user's wishlist
   */
  async addToWishlist(userId: string, data: AddToWishlistInput): Promise<WishlistItem> {
    const { data: item, error } = await this.supabase
      .from('wishlist_items')
      .insert({
        user_id: userId,
        product_id: data.product_id,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return item as WishlistItem;
  }

  /**
   * Update a wishlist item
   */
  async updateWishlistItem(
    userId: string, 
    productId: string, 
    data: UpdateWishlistItemInput
  ): Promise<WishlistItem> {
    const { data: item, error } = await this.supabase
      .from('wishlist_items')
      .update({
        notes: data.notes,
      })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();

    if (error) throw error;
    return item as WishlistItem;
  }

  /**
   * Remove a product from a user's wishlist
   */
  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await this.supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
  }

  /**
   * Toggle a product in a user's wishlist
   * Adds it if not present, removes it if already present
   */
  async toggleWishlistItem(userId: string, productId: string): Promise<{ added: boolean }> {
    const isInWishlist = await this.isProductInWishlist(userId, productId);
    
    if (isInWishlist) {
      await this.removeFromWishlist(userId, productId);
      return { added: false };
    } else {
      await this.addToWishlist(userId, { product_id: productId });
      return { added: true };
    }
  }
}
`;

/**
 * Server Actions Template
 */
export const serverActions = `
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { WishlistRepository } from '@/repositories/WishlistRepository';
import { 
  type AddToWishlistInput, 
  type UpdateWishlistItemInput 
} from '@/types/wishlist';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const wishlistRepository = new WishlistRepository();

/**
 * Add a product to the wishlist
 */
export async function addToWishlist(formData: AddToWishlistInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to add items to your wishlist' };
    }

    // Validate input
    const schema = z.object({
      product_id: z.string().uuid(),
      notes: z.string().max(500).optional(),
    });

    const validatedData = schema.parse(formData);

    // Check if already in wishlist
    const isInWishlist = await wishlistRepository.isProductInWishlist(
      user.id,
      validatedData.product_id
    );

    if (isInWishlist) {
      return { 
        success: false, 
        error: 'This product is already in your wishlist' 
      };
    }

    // Add to wishlist
    const item = await wishlistRepository.addToWishlist(user.id, validatedData);

    // Revalidate paths
    revalidatePath('/wishlist');
    revalidatePath(\`/products/\${validatedData.product_id}\`);
    
    return { 
      success: true, 
      data: item 
    };
  } catch (error) {
    console.error('Failed to add item to wishlist:', error);
    return { 
      success: false, 
      error: 'Failed to add item to wishlist. Please try again.' 
    };
  }
}

/**
 * Remove a product from the wishlist
 */
export async function removeFromWishlist(productId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to remove items from your wishlist' };
    }

    // Remove from wishlist
    await wishlistRepository.removeFromWishlist(user.id, productId);

    // Revalidate paths
    revalidatePath('/wishlist');
    revalidatePath(\`/products/\${productId}\`);
    
    return { 
      success: true
    };
  } catch (error) {
    console.error('Failed to remove item from wishlist:', error);
    return { 
      success: false, 
      error: 'Failed to remove item from wishlist. Please try again.' 
    };
  }
}

/**
 * Toggle a product in the wishlist
 */
export async function toggleWishlistItem(productId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to update your wishlist' };
    }

    // Toggle item in wishlist
    const result = await wishlistRepository.toggleWishlistItem(user.id, productId);

    // Revalidate paths
    revalidatePath('/wishlist');
    revalidatePath(\`/products/\${productId}\`);
    
    return { 
      success: true,
      added: result.added
    };
  } catch (error) {
    console.error('Failed to toggle wishlist item:', error);
    return { 
      success: false, 
      error: 'Failed to update wishlist. Please try again.' 
    };
  }
}

/**
 * Update a wishlist item
 */
export async function updateWishlistItem(productId: string, formData: UpdateWishlistItemInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to update your wishlist' };
    }

    // Validate input
    const schema = z.object({
      notes: z.string().max(500).optional(),
    });

    const validatedData = schema.parse(formData);

    // Update wishlist item
    const item = await wishlistRepository.updateWishlistItem(user.id, productId, validatedData);

    // Revalidate path
    revalidatePath('/wishlist');
    
    return { 
      success: true, 
      data: item 
    };
  } catch (error) {
    console.error('Failed to update wishlist item:', error);
    return { 
      success: false, 
      error: 'Failed to update wishlist item. Please try again.' 
    };
  }
}
`;

/**
 * Component Templates
 */

// Wishlist Button Component
export const wishlistButtonComponent = `
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
`;

// Wishlist Page Component
export const wishlistPageComponent = `
import { type FC, Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { WishlistRepository } from '@/repositories/WishlistRepository';
import { WishlistItems } from './WishlistItems';
import { EmptyWishlist } from './EmptyWishlist';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface WishlistPageProps {
  searchParams?: {
    page?: string;
  };
}

export const WishlistPage: FC<WishlistPageProps> = async ({ searchParams }) => {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login?callbackUrl=/wishlist');
  }
  
  const wishlistRepository = new WishlistRepository();
  
  // Get total count for pagination
  const totalItems = await wishlistRepository.getWishlistItemCount(user.id);
  
  // Current page from query params
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const perPage = 10; // Items per page
  
  // Calculate offset for pagination
  const offset = (page - 1) * perPage;
  
  // Get wishlist items with products
  const wishlistItems = await wishlistRepository.getWishlistItemsByUserId(user.id, {
    limit: perPage,
    offset: offset
  });
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      <p className="text-gray-500 mt-2">
        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your wishlist
      </p>
      
      <Separator className="my-6" />
      
      {totalItems === 0 ? (
        <EmptyWishlist />
      ) : (
        <Suspense fallback={<WishlistItemsSkeleton />}>
          <WishlistItems 
            items={wishlistItems}
            totalCount={totalItems}
            page={page}
            perPage={perPage}
          />
        </Suspense>
      )}
    </div>
  );
};

// Loading skeleton
const WishlistItemsSkeleton: FC = () => {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col md:flex-row gap-4 border p-4 rounded-lg">
          <Skeleton className="h-32 w-32" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-2/3 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};
`;

// Wishlist Items Component
export const wishlistItemsComponent = `
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
`;

// Empty Wishlist Component
export const emptyWishlistComponent = `
import { type FC } from 'react';
import { HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const EmptyWishlist: FC = () => {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-100 p-6 rounded-full">
        <HeartOff className="h-12 w-12 text-gray-400" />
      </div>
      
      <h2 className="mt-6 text-2xl font-semibold">Your wishlist is empty</h2>
      
      <p className="mt-2 text-gray-600 max-w-md mx-auto">
        Items you save to your wishlist will be shown here.
        Find products you love and click the heart icon to add them.
      </p>
      
      <Button asChild className="mt-6">
        <Link href="/products">
          Browse Products
        </Link>
      </Button>
    </div>
  );
};
`; 