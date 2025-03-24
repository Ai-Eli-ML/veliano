
'use client';

import { type FC } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getRecentlyViewedProducts } from '@/actions/recommendations';
import { useQuery } from '@tanstack/react-query';

interface RecentlyViewedProductsProps {
  limit?: number;
}

export const RecentlyViewedProducts: FC<RecentlyViewedProductsProps> = ({
  limit = 4
}) => {
  // Fetch recently viewed products
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['recentlyViewedProducts', limit],
    queryFn: async () => {
      const response = await getRecentlyViewedProducts(limit);
      return response.success ? response.data : [];
    }
  });
  
  const products = productsData || [];
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error || products.length === 0) {
    return null; // Don't show anything if there's an error or no recently viewed products
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recently Viewed</h2>
      
      <Carousel className="w-full">
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};
