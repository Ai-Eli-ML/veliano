/**
 * Product Recommendation System Template
 * For Phase 4 of Veliano E-commerce Project
 */

/**
 * Database Schema Template
 */
export const databaseSchema = `
-- Product view history for generating recommendations
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product recommendation relevance scores
CREATE TABLE IF NOT EXISTS product_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  relevance_score DECIMAL NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('similar', 'frequently_bought_together', 'viewed_also_viewed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, recommended_product_id, recommendation_type)
);

-- Custom recommended products (manually curated)
CREATE TABLE IF NOT EXISTS curated_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  recommended_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, recommended_product_id)
);

-- Enable RLS and add policies
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE curated_recommendations ENABLE ROW LEVEL SECURITY;

-- Product views policies
CREATE POLICY "Users can view their own view history"
  ON product_views FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Users can insert their own view history"
  ON product_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Product recommendations policies (mainly for admin use, but readable by all)
CREATE POLICY "Anyone can view product recommendations"
  ON product_recommendations FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage product recommendations"
  ON product_recommendations FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Curated recommendations policies
CREATE POLICY "Anyone can view curated recommendations"
  ON curated_recommendations FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage curated recommendations"
  ON curated_recommendations FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_views_user_id ON product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_recommendations_product_id ON product_recommendations(product_id);
CREATE INDEX IF NOT EXISTS idx_curated_recommendations_product_id ON curated_recommendations(product_id);
`;

/**
 * TypeScript Types Template
 */
export const typesDefinition = `
import { Database } from '@/types/supabase';
import { Product } from '@/types/product';

export interface ProductView extends Database['public']['Tables']['product_views']['Row'] {
  // Base type from Supabase schema
}

export interface ProductRecommendation extends Database['public']['Tables']['product_recommendations']['Row'] {
  // Base type from Supabase schema
}

export interface CuratedRecommendation extends Database['public']['Tables']['curated_recommendations']['Row'] {
  // Base type from Supabase schema
}

export interface ProductRecommendationWithDetails extends ProductRecommendation {
  recommended_product: Product;
}

export interface CuratedRecommendationWithDetails extends CuratedRecommendation {
  recommended_product: Product;
}

export type RecommendationType = 'similar' | 'frequently_bought_together' | 'viewed_also_viewed';

export interface AddViewInput {
  product_id: string;
  user_id?: string; // Anonymous users won't have this
}

export interface CreateCuratedRecommendationInput {
  product_id: string;
  recommended_product_id: string;
  position: number;
}

export interface UpdateCuratedRecommendationInput {
  id: string;
  position?: number;
}

export interface RecommendationsFilterInput {
  limit?: number;
  type?: RecommendationType;
}
`;

/**
 * Repository Template
 */
export const recommendationsRepository = `
import { createClient } from '@/lib/supabase/server';
import { 
  type ProductView, 
  type ProductRecommendation,
  type ProductRecommendationWithDetails,
  type CuratedRecommendation,
  type CuratedRecommendationWithDetails,
  type RecommendationType,
  type AddViewInput,
  type CreateCuratedRecommendationInput,
  type UpdateCuratedRecommendationInput,
  type RecommendationsFilterInput
} from '@/types/recommendations';
import { type Product } from '@/types/product';

export class RecommendationsRepository {
  private supabase = createClient();

  /**
   * Log a product view
   */
  async logProductView(data: AddViewInput): Promise<void> {
    if (!data.user_id) {
      // Skip logging for anonymous users
      return;
    }

    // Check if a view record already exists
    const { data: existingView } = await this.supabase
      .from('product_views')
      .select('id, view_count')
      .eq('user_id', data.user_id)
      .eq('product_id', data.product_id)
      .single();

    if (existingView) {
      // Update existing view record
      await this.supabase
        .from('product_views')
        .update({
          view_count: existingView.view_count + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('id', existingView.id);
    } else {
      // Create new view record
      await this.supabase
        .from('product_views')
        .insert({
          user_id: data.user_id,
          product_id: data.product_id,
          view_count: 1,
          last_viewed_at: new Date().toISOString()
        });
    }
  }

  /**
   * Get recommended products for a product
   */
  async getRecommendedProducts(
    productId: string,
    options: RecommendationsFilterInput = {}
  ): Promise<ProductRecommendationWithDetails[]> {
    const limit = options.limit || 4;
    let query = this.supabase
      .from('product_recommendations')
      .select('*, recommended_product:recommended_product_id(*)')
      .eq('product_id', productId)
      .order('relevance_score', { ascending: false })
      .limit(limit);
    
    if (options.type) {
      query = query.eq('recommendation_type', options.type);
    }
    
    const { data, error } = await query;

    if (error) throw error;
    return data as unknown as ProductRecommendationWithDetails[];
  }

  /**
   * Get curated recommendations for a product
   */
  async getCuratedRecommendations(
    productId: string,
    limit: number = 4
  ): Promise<CuratedRecommendationWithDetails[]> {
    const { data, error } = await this.supabase
      .from('curated_recommendations')
      .select('*, recommended_product:recommended_product_id(*)')
      .eq('product_id', productId)
      .order('position', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as unknown as CuratedRecommendationWithDetails[];
  }

  /**
   * Get recently viewed products by a user
   */
  async getRecentlyViewedProducts(
    userId: string,
    limit: number = 4
  ): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('product_views')
      .select('product:product_id(*)')
      .eq('user_id', userId)
      .order('last_viewed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(item => item.product) as Product[];
  }

  /**
   * Create a curated recommendation
   */
  async createCuratedRecommendation(
    data: CreateCuratedRecommendationInput,
    createdBy: string
  ): Promise<CuratedRecommendation> {
    const { data: recommendation, error } = await this.supabase
      .from('curated_recommendations')
      .insert({
        product_id: data.product_id,
        recommended_product_id: data.recommended_product_id,
        position: data.position,
        created_by: createdBy
      })
      .select()
      .single();

    if (error) throw error;
    return recommendation as CuratedRecommendation;
  }

  /**
   * Update a curated recommendation
   */
  async updateCuratedRecommendation(
    data: UpdateCuratedRecommendationInput
  ): Promise<CuratedRecommendation> {
    const { data: recommendation, error } = await this.supabase
      .from('curated_recommendations')
      .update({
        position: data.position,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) throw error;
    return recommendation as CuratedRecommendation;
  }

  /**
   * Delete a curated recommendation
   */
  async deleteCuratedRecommendation(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('curated_recommendations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Get similar products (based on category and attributes)
   */
  async getSimilarProducts(
    productId: string,
    limit: number = 4
  ): Promise<Product[]> {
    // Get the product's category and attributes to find similar products
    const { data: product, error: productError } = await this.supabase
      .from('products')
      .select('category_id, attributes')
      .eq('id', productId)
      .single();

    if (productError) throw productError;

    // Find products with the same category and similar attributes
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category_id', product.category_id)
      .neq('id', productId) // Exclude the current product
      .limit(limit);

    if (error) throw error;
    return data as Product[];
  }
}
`;

/**
 * Server Actions Template
 */
export const serverActions = `
'use server';

import { revalidatePath } from 'next/cache';
import { RecommendationsRepository } from '@/repositories/RecommendationsRepository';
import { 
  type AddViewInput,
  type CreateCuratedRecommendationInput,
  type UpdateCuratedRecommendationInput,
  type RecommendationsFilterInput
} from '@/types/recommendations';
import { getCurrentUser } from '@/lib/session';
import { z } from 'zod';

const recommendationsRepository = new RecommendationsRepository();

/**
 * Log a product view
 */
export async function logProductView(productId: string) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      // For anonymous users, we could store in cookies/localStorage
      // but for simplicity, we'll skip logging
      return { success: true };
    }
    
    await recommendationsRepository.logProductView({
      product_id: productId,
      user_id: currentUser.id
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to log product view:', error);
    return { success: false };
  }
}

/**
 * Get recommended products for a product
 */
export async function getRecommendedProducts(
  productId: string,
  options: RecommendationsFilterInput = {}
) {
  try {
    const recommendations = await recommendationsRepository.getRecommendedProducts(
      productId,
      options
    );
    
    return { 
      success: true, 
      data: recommendations 
    };
  } catch (error) {
    console.error('Failed to get product recommendations:', error);
    return { 
      success: false, 
      error: 'Failed to fetch recommendations' 
    };
  }
}

/**
 * Get recently viewed products
 */
export async function getRecentlyViewedProducts(limit: number = 4) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return { 
        success: true, 
        data: [] 
      };
    }
    
    const recentProducts = await recommendationsRepository.getRecentlyViewedProducts(
      currentUser.id,
      limit
    );
    
    return { 
      success: true, 
      data: recentProducts 
    };
  } catch (error) {
    console.error('Failed to get recently viewed products:', error);
    return { 
      success: false, 
      error: 'Failed to fetch recently viewed products' 
    };
  }
}

/**
 * Create a curated recommendation (admin only)
 */
export async function createCuratedRecommendation(
  formData: CreateCuratedRecommendationInput
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return { 
        success: false, 
        error: 'Unauthorized access' 
      };
    }
    
    // Validate input
    const schema = z.object({
      product_id: z.string().uuid(),
      recommended_product_id: z.string().uuid(),
      position: z.number().int().min(1)
    });
    
    const validatedData = schema.parse(formData);
    
    const recommendation = await recommendationsRepository.createCuratedRecommendation(
      validatedData,
      currentUser.id
    );
    
    // Revalidate product page to show new recommendations
    revalidatePath('/products/[id]');
    
    return { 
      success: true, 
      data: recommendation 
    };
  } catch (error) {
    console.error('Failed to create curated recommendation:', error);
    return { 
      success: false, 
      error: 'Failed to create recommendation' 
    };
  }
}

/**
 * Update a curated recommendation (admin only)
 */
export async function updateCuratedRecommendation(
  formData: UpdateCuratedRecommendationInput
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return { 
        success: false, 
        error: 'Unauthorized access' 
      };
    }
    
    // Validate input
    const schema = z.object({
      id: z.string().uuid(),
      position: z.number().int().min(1).optional()
    });
    
    const validatedData = schema.parse(formData);
    
    const recommendation = await recommendationsRepository.updateCuratedRecommendation(
      validatedData
    );
    
    // Revalidate product page to show updated recommendations
    revalidatePath('/products/[id]');
    
    return { 
      success: true, 
      data: recommendation 
    };
  } catch (error) {
    console.error('Failed to update curated recommendation:', error);
    return { 
      success: false, 
      error: 'Failed to update recommendation' 
    };
  }
}

/**
 * Delete a curated recommendation (admin only)
 */
export async function deleteCuratedRecommendation(id: string) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'admin') {
      return { 
        success: false, 
        error: 'Unauthorized access' 
      };
    }
    
    await recommendationsRepository.deleteCuratedRecommendation(id);
    
    // Revalidate product page to show updated recommendations
    revalidatePath('/products/[id]');
    
    return { 
      success: true 
    };
  } catch (error) {
    console.error('Failed to delete curated recommendation:', error);
    return { 
      success: false, 
      error: 'Failed to delete recommendation' 
    };
  }
}
`;

/**
 * Component Templates
 */

// Product Recommendations Component
export const productRecommendationsComponent = `
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
`;

// Recently Viewed Products Component
export const recentlyViewedComponent = `
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
`;

// Admin Curated Recommendations Component
export const adminCuratedRecommendationsComponent = `
'use client';

import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCuratedRecommendation, updateCuratedRecommendation, deleteCuratedRecommendation } from '@/actions/recommendations';
import { useToast } from '@/components/ui/use-toast';
import { ProductSearch } from '@/components/product/ProductSearch';
import { type Product } from '@/types/product';
import { type CuratedRecommendationWithDetails } from '@/types/recommendations';

interface AdminCuratedRecommendationsProps {
  productId: string;
  initialRecommendations: CuratedRecommendationWithDetails[];
}

export const AdminCuratedRecommendations: FC<AdminCuratedRecommendationsProps> = ({
  productId,
  initialRecommendations
}) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<CuratedRecommendationWithDetails[]>(initialRecommendations);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [position, setPosition] = useState(recommendations.length + 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddRecommendation = async () => {
    if (!selectedProduct) {
      toast({
        title: 'Error',
        description: 'Please select a product to recommend',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createCuratedRecommendation({
        product_id: productId,
        recommended_product_id: selectedProduct.id,
        position: position
      });
      
      if (result.success) {
        // Add the new recommendation to the list
        setRecommendations([
          ...recommendations,
          {
            ...result.data,
            recommended_product: selectedProduct
          } as CuratedRecommendationWithDetails
        ]);
        
        // Reset form
        setSelectedProduct(null);
        setPosition(recommendations.length + 2);
        
        toast({
          title: 'Success',
          description: 'Recommendation added successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add recommendation',
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
      setIsSubmitting(false);
    }
  };
  
  const handleUpdatePosition = async (id: string, newPosition: number) => {
    try {
      const result = await updateCuratedRecommendation({
        id,
        position: newPosition
      });
      
      if (result.success) {
        // Update the recommendation in the list
        setRecommendations(
          recommendations.map(rec => 
            rec.id === id ? { ...rec, position: newPosition } : rec
          )
        );
        
        toast({
          title: 'Success',
          description: 'Position updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update position',
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
  
  const handleDeleteRecommendation = async (id: string) => {
    try {
      const result = await deleteCuratedRecommendation(id);
      
      if (result.success) {
        // Remove the recommendation from the list
        setRecommendations(recommendations.filter(rec => rec.id !== id));
        
        toast({
          title: 'Success',
          description: 'Recommendation deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete recommendation',
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
    <Card>
      <CardHeader>
        <CardTitle>Curated Product Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current recommendations table */}
        <div>
          <h3 className="text-lg font-medium mb-2">Current Recommendations</h3>
          {recommendations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations
                  .sort((a, b) => a.position - b.position)
                  .map((recommendation) => (
                    <TableRow key={recommendation.id}>
                      <TableCell>
                        {recommendation.recommended_product.name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={recommendation.position}
                          min={1}
                          className="w-20"
                          onChange={(e) => {
                            const newPosition = parseInt(e.target.value);
                            if (newPosition > 0) {
                              handleUpdatePosition(recommendation.id, newPosition);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRecommendation(recommendation.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No recommendations added yet.</p>
          )}
        </div>
        
        {/* Add new recommendation form */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Add New Recommendation</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Product
              </label>
              <ProductSearch
                onSelectProduct={setSelectedProduct}
                selectedProduct={selectedProduct}
                excludeIds={[productId, ...recommendations.map(r => r.recommended_product_id)]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Position
              </label>
              <Input
                type="number"
                value={position}
                min={1}
                onChange={(e) => setPosition(parseInt(e.target.value))}
                className="w-32"
              />
            </div>
            
            <Button
              onClick={handleAddRecommendation}
              disabled={isSubmitting || !selectedProduct}
            >
              {isSubmitting ? 'Adding...' : 'Add Recommendation'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
`; 