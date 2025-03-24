'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

interface RecommendationClickParams {
  sourceProductId: string;
  clickedProductId: string;
  recommendationType: 'similar' | 'frequently-bought' | 'popular';
}

/**
 * Track when a user clicks on a recommended product
 */
export async function trackRecommendationClick(params: RecommendationClickParams) {
  try {
    const { sourceProductId, clickedProductId, recommendationType } = params;
    
    // Initialize Supabase client
    const supabase = createServerActionClient({ cookies });
    
    // Get current user if authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Log the recommendation click
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'recommendation_click',
        user_id: userId,
        properties: {
          source_product_id: sourceProductId,
          clicked_product_id: clickedProductId,
          recommendation_type: recommendationType,
          timestamp: new Date().toISOString()
        }
      });
    
    // Update the product relation strength based on the click
    // This helps improve future recommendations
    const { data: existingRelation } = await supabase
      .from('product_relations')
      .select('id, relation_strength')
      .eq('product_id', sourceProductId)
      .eq('related_product_id', clickedProductId)
      .eq('relation_type', 'frequently_bought_together')
      .single();
    
    if (existingRelation) {
      // Increment the relation strength
      await supabase
        .from('product_relations')
        .update({
          relation_strength: existingRelation.relation_strength + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRelation.id);
    } else {
      // Create a new relation
      await supabase
        .from('product_relations')
        .insert({
          product_id: sourceProductId,
          related_product_id: clickedProductId,
          relation_type: 'frequently_bought_together',
          relation_strength: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking recommendation click:', error);
    return { success: false, error: 'Failed to track recommendation click' };
  }
}

/**
 * Track a product view 
 */
export async function trackProductView(productId: string) {
  try {
    // Initialize Supabase client
    const supabase = createServerActionClient({ cookies });
    
    // Get current user if authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Log the product view
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'product_view',
        user_id: userId,
        properties: {
          product_id: productId,
          timestamp: new Date().toISOString()
        }
      });
    
    // Increment product view count
    await supabase.rpc('increment_product_views', {
      p_product_id: productId
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking product view:', error);
    return { success: false, error: 'Failed to track product view' };
  }
}

/**
 * Track a search query
 */
export async function trackSearchQuery(query: string, results: number) {
  try {
    // Initialize Supabase client
    const supabase = createServerActionClient({ cookies });
    
    // Get current user if authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // Log the search query
    await supabase
      .from('search_logs')
      .insert({
        query,
        results_count: results,
        user_id: userId,
        created_at: new Date().toISOString()
      });
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking search query:', error);
    return { success: false, error: 'Failed to track search query' };
  }
} 