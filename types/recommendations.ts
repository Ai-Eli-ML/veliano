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

export interface ProductRelation {
  id: string;
  product_id: string;
  related_product_id: string;
  relation_type: string;
  strength: number;
  created_at: string;
}

export type RelationType = 
  | 'frequently_bought_together'
  | 'similar_products'
  | 'complementary'
  | 'custom_recommendation';

export interface RecommendationScore {
  product_id: string;
  score: number;
  factors: RecommendationFactor[];
}

export interface RecommendationFactor {
  type: 'purchase_history' | 'view_history' | 'category_affinity' | 'price_range' | 'style_similarity';
  productId: string;
  weight: number;
  score: number;
}

export type RecommendationFactorType =
  | 'purchase_history'
  | 'view_history'
  | 'category_affinity'
  | 'price_range'
  | 'style_similarity';

export interface RecommendationConfig {
  maxRecommendations: number;
  factorWeights: {
    purchase_history: number;
    view_history: number;
    category_affinity: number;
    price_range: number;
    style_similarity: number;
  };
  minScore: number;
  includeSoldOut: boolean;
}

export interface RecommendationContext {
  userId?: string;
  currentProductId?: string;
  categoryId?: string;
  viewHistory?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}
