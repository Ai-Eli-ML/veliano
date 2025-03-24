
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
