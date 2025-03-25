'use client';

import { useEffect, useState } from 'react';
import { getProductRecommendations, trackRecommendationClick } from '@/actions/recommendations';
import { RecommendationContext } from '@/types/recommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  inventory_count: number;
}

interface ProductRecommendationsProps {
  context: RecommendationContext;
  title?: string;
  maxItems?: number;
}

export function ProductRecommendations({
  context,
  title = 'Recommended for You',
  maxItems = 4,
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<(Product & { score: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        const { recommendations: items } = await getProductRecommendations(context);
        setRecommendations(items.slice(0, maxItems));
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [context, maxItems]);

  const handleProductClick = async (productId: string, score: number) => {
    try {
      await trackRecommendationClick(productId, score);
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
      router.push(`/products/${productId}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: maxItems }).map((_, i) => (
            <Skeleton key={i} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id, product.score)}
            className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-square overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={400}
                height={400}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(product.price)}
                </p>
                {product.inventory_count === 0 && (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
