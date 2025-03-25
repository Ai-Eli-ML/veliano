import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface ViewEvent {
  product_id: string;
  user_id?: string;
  session_id: string;
  source: string;
  recommendation_type: string;
}

interface ClickEvent {
  product_id: string;
  recommended_product_id: string;
  user_id?: string;
  session_id: string;
  recommendation_type: string;
}

interface ConversionEvent {
  product_id: string;
  recommended_product_id: string;
  user_id?: string;
  session_id: string;
  order_id: string;
  recommendation_type: string;
  revenue: number;
}

export class RecommendationAnalyticsRepository {
  private supabase = createClientComponentClient<Database>();

  /**
   * Track when a product is viewed from a recommendation
   */
  async trackRecommendationView(event: ViewEvent): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('recommendation_views')
        .insert({
          product_id: event.product_id,
          user_id: event.user_id,
          session_id: event.session_id,
          source: event.source,
          recommendation_type: event.recommendation_type,
        });

      if (error) {
        console.error('Error tracking recommendation view:', error);
      }
    } catch (error) {
      console.error('Error tracking recommendation view:', error);
    }
  }

  /**
   * Track when a recommended product is clicked
   */
  async trackRecommendationClick(event: ClickEvent): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('recommendation_clicks')
        .insert({
          product_id: event.product_id,
          recommended_product_id: event.recommended_product_id,
          user_id: event.user_id,
          session_id: event.session_id,
          recommendation_type: event.recommendation_type,
        });

      if (error) {
        console.error('Error tracking recommendation click:', error);
      }
    } catch (error) {
      console.error('Error tracking recommendation click:', error);
    }
  }

  /**
   * Track when a recommended product is purchased
   */
  async trackRecommendationConversion(event: ConversionEvent): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('recommendation_conversions')
        .insert({
          product_id: event.product_id,
          recommended_product_id: event.recommended_product_id,
          user_id: event.user_id,
          session_id: event.session_id,
          order_id: event.order_id,
          recommendation_type: event.recommendation_type,
          revenue: event.revenue,
        });

      if (error) {
        console.error('Error tracking recommendation conversion:', error);
      }
    } catch (error) {
      console.error('Error tracking recommendation conversion:', error);
    }
  }

  /**
   * Get recommendation analytics for a product
   */
  async getProductRecommendationAnalytics(product_id: string) {
    try {
      const [views, clicks, conversions] = await Promise.all([
        this.supabase
          .from('recommendation_views')
          .select('count', { count: 'exact' })
          .eq('product_id', product_id),
        this.supabase
          .from('recommendation_clicks')
          .select('count', { count: 'exact' })
          .eq('product_id', product_id),
        this.supabase
          .from('recommendation_conversions')
          .select('count', { count: 'exact' })
          .eq('product_id', product_id),
      ]);

      return {
        success: true,
        data: {
          views: views.count || 0,
          clicks: clicks.count || 0,
          conversions: conversions.count || 0,
          clickThroughRate: views.count ? (clicks.count || 0) / views.count : 0,
          conversionRate: clicks.count ? (conversions.count || 0) / clicks.count : 0,
        },
      };
    } catch (error) {
      console.error('Error getting recommendation analytics:', error);
      return { success: false, error };
    }
  }

  async getRecommendationStrength(
    sourceProductId: string,
    recommendedProductId: string
  ): Promise<number> {
    try {
      // Get view count
      const { data: viewData, error: viewError } = await this.supabase
        .from('recommendation_views')
        .select('count')
        .eq('product_id', sourceProductId)
        .single();

      if (viewError) {
        console.error('Error getting view count:', viewError);
        return 0;
      }

      // Get click count
      const { data: clickData, error: clickError } = await this.supabase
        .from('recommendation_clicks')
        .select('count')
        .eq('product_id', sourceProductId)
        .eq('recommended_product_id', recommendedProductId)
        .single();

      if (clickError) {
        console.error('Error getting click count:', clickError);
        return 0;
      }

      // Get conversion count
      const { data: conversionData, error: conversionError } = await this.supabase
        .from('recommendation_conversions')
        .select('count')
        .eq('product_id', sourceProductId)
        .eq('recommended_product_id', recommendedProductId)
        .single();

      if (conversionError) {
        console.error('Error getting conversion count:', conversionError);
        return 0;
      }

      // Calculate recommendation strength
      const views = viewData?.count || 0;
      const clicks = clickData?.count || 0;
      const conversions = conversionData?.count || 0;

      // Simple weighted score calculation
      // You can adjust these weights based on your business needs
      const clickThroughRate = views > 0 ? clicks / views : 0;
      const conversionRate = clicks > 0 ? conversions / clicks : 0;

      const strength = (clickThroughRate * 0.4) + (conversionRate * 0.6);
      return strength;
    } catch (error) {
      console.error('Error calculating recommendation strength:', error);
      return 0;
    }
  }
} 