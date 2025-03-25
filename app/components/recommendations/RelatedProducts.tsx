'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from '@supabase/auth-helpers-react';
import { v4 as uuidv4 } from 'uuid';
import { RecommendationAnalyticsRepository } from '@/repositories/RecommendationAnalyticsRepository';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  main_image_url: string;
  average_rating: number | null;
}

interface RelatedProductsProps {
  productId: string;
  className?: string;
  limit?: number;
}

const analyticsRepository = new RecommendationAnalyticsRepository();

export function RelatedProducts({
  productId,
  className = '',
  limit = 4,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const [sessionId] = useState(() => uuidv4());

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${productId}/recommended?type=related&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch related products');
        }
        
        const data = await response.json();
        setProducts(data.recommendations || []);

        // Track view event
        await analyticsRepository.trackRecommendationView({
          product_id: productId,
          user_id: session?.user?.id,
          session_id: sessionId,
          source: 'related_products_section',
          recommendation_type: 'related',
        });
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Unable to load related products');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId, limit, session?.user?.id, sessionId]);

  const handleProductClick = async (clickedProductId: string) => {
    try {
      await analyticsRepository.trackRecommendationClick({
        product_id: productId,
        recommended_product_id: clickedProductId,
        user_id: session?.user?.id,
        session_id: sessionId,
        recommendation_type: 'related',
      });
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`w-full py-8 ${className}`}>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.main_image_url || '/images/product-placeholder.png'}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <Link
                href={`/products/${product.slug}`}
                className="block hover:underline"
                onClick={() => handleProductClick(product.id)}
              >
                <h3 className="font-medium mb-1 line-clamp-2">{product.name}</h3>
              </Link>
              <div className="flex items-center mt-2">
                {product.sale_price ? (
                  <>
                    <span className="text-primary font-bold">${product.sale_price}</span>
                    <span className="text-muted-foreground line-through ml-2">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-primary font-bold">${product.price}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 