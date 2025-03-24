
'use client';

import { type FC, useEffect } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getRecommendedProducts, logProductView } from '@/actions/recommendations';
import { type ProductRecommendationWithDetails, type RecommendationType } from '@/types/recommendations';
import { useQuery } from '@tanstack/react-query';

interface ProductRecommendationsProps {
  productId: string;
  title?: string;
  type?: RecommendationType;
  limit?: number;
}

export const ProductRecommendations: FC<ProductRecommendationsProps> = ({
  productId,
  title = 'You may also like',
  type,
  limit = 4
}) => {
  // Log product view when component mounts
  useEffect(() => {
    logProductView(productId);
  }, [productId]);
  
  // Fetch recommendations
  const { data: recommendationsData, isLoading, error } = useQuery({
    queryKey: ['productRecommendations', productId, type],
    queryFn: async () => {
      const response = await getRecommendedProducts(productId, { type, limit });
      return response.success ? response.data : [];
    }
  });
  
  const recommendations = recommendationsData || [];
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error || recommendations.length === 0) {
    return null; // Don't show anything if there's an error or no recommendations
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      
      <Carousel className="w-full">
        <CarouselContent>
          {recommendations.map((recommendation) => (
            <CarouselItem key={recommendation.id} className="md:basis-1/2 lg:basis-1/4">
              <ProductCard product={recommendation.recommended_product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};
