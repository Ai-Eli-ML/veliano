'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { trackRecommendationClick } from '@/app/actions/analytics';
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

interface ProductCarouselProps {
  productId: string;
  title?: string;
  type?: 'trending' | 'popular' | 'new_arrivals';
  limit?: number;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  className?: string;
}

const analyticsRepository = new RecommendationAnalyticsRepository();

export default function ProductCarousel({
  productId,
  title = 'Recommended Products',
  type = 'popular',
  limit = 8,
  autoScroll = true,
  autoScrollInterval = 5000,
  className = '',
}: ProductCarouselProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);
  const session = useSession();
  const [sessionId] = useState(() => uuidv4());

  const itemsPerPage = 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/recommended?type=${type}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.recommendations || []);

        // Track view event for the carousel
        await analyticsRepository.trackRecommendationView({
          product_id: 'carousel',
          user_id: session?.user?.id,
          session_id: sessionId,
          source: `${type}_carousel`,
          recommendation_type: type,
        });
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Unable to load products');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [type, limit, session?.user?.id, sessionId]);

  // Calculate max scroll position when products change or on resize
  useEffect(() => {
    const calculateMaxScroll = () => {
      if (scrollContainer.current) {
        setMaxScroll(
          scrollContainer.current.scrollWidth - scrollContainer.current.clientWidth
        );
      }
    };

    calculateMaxScroll();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateMaxScroll);
    
    return () => {
      window.removeEventListener('resize', calculateMaxScroll);
    };
  }, [products]);

  // Auto scroll functionality
  useEffect(() => {
    if (!autoScroll || isLoading || autoPaused || products.length <= 3) return;
    
    const interval = setInterval(() => {
      scrollNext();
    }, autoScrollInterval);
    
    return () => clearInterval(interval);
  }, [autoScroll, isLoading, autoPaused, autoScrollInterval, products.length, scrollPosition, maxScroll]);

  const handleProductClick = async (productId: string) => {
    try {
      await analyticsRepository.trackRecommendationClick({
        product_id: 'carousel',
        recommended_product_id: productId,
        user_id: session?.user?.id,
        session_id: sessionId,
        recommendation_type: type,
      });
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  };

  const scrollPrev = () => {
    if (scrollContainer.current) {
      const newPosition = Math.max(0, scrollPosition - 300);
      scrollContainer.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
      setScrollPosition(newPosition);
    }
  };

  const scrollNext = () => {
    if (scrollContainer.current) {
      const newPosition = Math.min(maxScroll, scrollPosition + 300);
      scrollContainer.current.scrollTo({
        left: newPosition,
        behavior: 'smooth',
      });
      setScrollPosition(newPosition);
      
      // If we've reached the end, reset to beginning after a delay
      if (newPosition >= maxScroll) {
        setTimeout(() => {
          if (scrollContainer.current) {
            scrollContainer.current.scrollTo({
              left: 0,
              behavior: 'smooth',
            });
            setScrollPosition(0);
          }
        }, 1000);
      }
    }
  };

  // Update scroll position when user manually scrolls
  const handleScroll = () => {
    if (scrollContainer.current) {
      setScrollPosition(scrollContainer.current.scrollLeft);
    }
  };

  // Pause auto-scroll when hovering
  const handleMouseEnter = () => setAutoPaused(true);
  const handleMouseLeave = () => setAutoPaused(false);

  if (isLoading) {
    return (
      <div className={`w-full py-6 ${className}`}>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null; // Don't show this section if there are no recommendations
  }

  const currentIndex = Math.floor(scrollPosition / 300);
  const visibleProducts = products.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div 
      className={`w-full py-6 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollPrev}
            disabled={scrollPosition <= 0}
            className="rounded-full"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollNext}
            disabled={scrollPosition >= maxScroll}
            className="rounded-full"
            aria-label="Next products"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollContainer}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[200px] w-[200px] sm:min-w-[220px] sm:w-[220px] mr-4 snap-start"
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
                    sizes="(max-width: 640px) 200px, 220px"
                    className="object-cover"
                  />
                  {product.sale_price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    {product.sale_price ? (
                      <>
                        <span className="text-primary font-bold text-sm">${product.sale_price}</span>
                        <span className="text-muted-foreground line-through ml-2 text-xs">
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-primary font-bold text-sm">${product.price}</span>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        ))}
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center gap-1 mt-4">
        {Array.from({ length: totalPages }).map((_, index) => {
          const dotPosition = index * 300;
          const isActive = 
            scrollPosition >= dotPosition && 
            scrollPosition < dotPosition + 300;
          
          return (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                isActive ? "bg-primary" : "bg-gray-300"
              )}
              onClick={() => {
                if (scrollContainer.current) {
                  scrollContainer.current.scrollTo({
                    left: dotPosition,
                    behavior: 'smooth',
                  });
                  setScrollPosition(dotPosition);
                }
              }}
              aria-label={`Go to product group ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
} 