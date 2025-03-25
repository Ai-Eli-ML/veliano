'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface FrequentlyBoughtTogetherProps {
  productId: string;
  className?: string;
}

const analyticsRepository = new RecommendationAnalyticsRepository();

export function FrequentlyBoughtTogether({
  productId,
  className = '',
}: FrequentlyBoughtTogetherProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set([productId]));
  const session = useSession();
  const [sessionId] = useState(() => uuidv4()); // Generate a unique session ID for analytics

  useEffect(() => {
    const fetchFrequentlyBoughtProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${productId}/recommended?type=frequently_bought_together&limit=3`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch frequently bought products');
        }
        
        const data = await response.json();
        setProducts(data.recommendations || []);

        // Track view event
        await analyticsRepository.trackRecommendationView({
          product_id: productId,
          user_id: session?.user?.id,
          session_id: sessionId,
          source: 'frequently_bought_together_section',
          recommendation_type: 'frequently_bought_together',
        });
      } catch (err) {
        console.error('Error fetching frequently bought products:', err);
        setError('Unable to load product recommendations');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (productId) {
      fetchFrequentlyBoughtProducts();
    }
  }, [productId, session?.user?.id, sessionId]);

  const handleProductClick = async (clickedProductId: string) => {
    try {
      // Track click event
      await analyticsRepository.trackRecommendationClick({
        product_id: productId,
        recommended_product_id: clickedProductId,
        user_id: session?.user?.id,
        session_id: sessionId,
        recommendation_type: 'frequently_bought_together',
      });
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  };

  const handleProductToggle = (id: string) => {
    setSelectedProducts(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const calculateTotal = () => {
    let total = 0;
    selectedProducts.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        total += product.sale_price || product.price;
      }
    });
    return total.toFixed(2);
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart/add-multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: Array.from(selectedProducts),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add products to cart');
      }

      // Track conversion event for each selected product
      const selectedProductIds = Array.from(selectedProducts);
      for (const selectedId of selectedProductIds) {
        if (selectedId !== productId) {
          await analyticsRepository.trackRecommendationClick({
            product_id: productId,
            recommended_product_id: selectedId,
            user_id: session?.user?.id,
            session_id: sessionId,
            recommendation_type: 'frequently_bought_together',
          });
        }
      }

      // Show success message or redirect to cart
      window.location.href = '/cart';
    } catch (error) {
      console.error('Error adding products to cart:', error);
      // Show error message to user
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {products.map((product, index) => (
          <React.Fragment key={product.id}>
            {index > 0 && (
              <div className="hidden md:flex justify-center">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <Card className={`overflow-hidden ${
              selectedProducts.has(product.id) ? 'ring-2 ring-primary' : ''
            }`}>
              <div className="relative aspect-square">
                <Image
                  src={product.main_image_url || '/images/product-placeholder.png'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
                <button
                  onClick={() => handleProductToggle(product.id)}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => {}}
                    className="h-4 w-4"
                  />
                </button>
              </div>
              <CardContent className="p-4">
                <Link
                  href={`/products/${product.slug}`}
                  className="block hover:underline"
                  onClick={() => handleProductClick(product.id)}
                >
                  <h3 className="font-medium mb-1 line-clamp-1">{product.name}</h3>
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
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center">
        <p className="text-lg font-semibold mb-4">
          Total for selected items: ${calculateTotal()}
        </p>
        <Button
          onClick={handleAddToCart}
          disabled={selectedProducts.size === 0}
          className="w-full md:w-auto"
        >
          Add Selected to Cart
        </Button>
      </div>
    </div>
  );
} 