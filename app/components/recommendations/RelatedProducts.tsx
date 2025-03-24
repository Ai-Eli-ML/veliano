'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { trackRecommendationClick } from '@/app/actions/analytics';

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
  title?: string;
  limit?: number;
  className?: string;
}

export default function RelatedProducts({
  productId,
  title = 'You might also like',
  limit = 4,
  className = '',
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${productId}/recommended?type=similar&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch related products');
        }
        
        const data = await response.json();
        setProducts(data.recommendations || []);
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
  }, [productId, limit]);

  const handleProductClick = async (clickedProductId: string) => {
    try {
      // Track this click for analytics
      await trackRecommendationClick({
        sourceProductId: productId,
        clickedProductId,
        recommendationType: 'similar',
      });
    } catch (error) {
      // Silent fail - don't block navigation if tracking fails
      console.error('Failed to track recommendation click:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={`w-full py-8 ${className}`}>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className={`w-full py-8 ${className}`}>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <Card className="w-full bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {error || 'No related products found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-full py-8 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="opacity-100 transition-all duration-300 ease-in-out"
          >
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
              <Link
                href={`/products/${product.slug}`}
                onClick={() => handleProductClick(product.id)}
                className="block h-full"
              >
                <div className="aspect-square relative">
                  <Image
                    src={product.main_image_url || '/images/product-placeholder.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  {product.sale_price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-1 line-clamp-1">{product.name}</h3>
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
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
} 