
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
