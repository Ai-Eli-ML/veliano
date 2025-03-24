
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
