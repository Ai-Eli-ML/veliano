
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
