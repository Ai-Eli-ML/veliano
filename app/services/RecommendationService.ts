import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import {
  RecommendationConfig,
  RecommendationContext,
  RecommendationScore,
  ProductRelation,
  RecommendationFactor,
} from '@/types/recommendations';

export class RecommendationService {
  private supabase;
  private config: RecommendationConfig;

  constructor(customConfig?: Partial<RecommendationConfig>) {
    this.supabase = createServerComponentClient<Database>({ cookies });
    this.config = {
      maxRecommendations: 10,
      factorWeights: {
        purchase_history: 0.4,
        view_history: 0.2,
        category_affinity: 0.2,
        price_range: 0.1,
        style_similarity: 0.1,
      },
      minScore: 0.3,
      includeSoldOut: false,
      ...customConfig,
    };
  }

  async getRecommendations(context: RecommendationContext) {
    try {
      const scores = await this.calculateScores(context);
      const recommendations = await this.getTopProducts(scores);
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  private async calculateScores(context: RecommendationContext): Promise<RecommendationScore[]> {
    const factors: RecommendationFactor[][] = await Promise.all([
      this.calculatePurchaseHistoryFactors(context),
      this.calculateViewHistoryFactors(context),
      this.calculateCategoryAffinityFactors(context),
      this.calculatePriceRangeFactors(context),
      this.calculateStyleSimilarityFactors(context),
    ]);

    // Combine all factors and calculate final scores
    const productScores = new Map<string, RecommendationScore>();

    factors.flat().forEach((factor) => {
      const existingScore = productScores.get(factor.productId) || {
        product_id: factor.productId,
        score: 0,
        factors: [],
      };

      existingScore.score += factor.score * factor.weight;
      existingScore.factors.push(factor);
      productScores.set(factor.productId, existingScore);
    });

    return Array.from(productScores.values())
      .filter((score) => score.score >= this.config.minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.config.maxRecommendations);
  }

  private async calculatePurchaseHistoryFactors(
    context: RecommendationContext
  ): Promise<RecommendationFactor[]> {
    if (!context.userId) return [];

    const { data: orders } = await this.supabase
      .from('orders')
      .select('order_items(product_id)')
      .eq('user_id', context.userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!orders) return [];

    const productIds = orders.flatMap((order) => 
      order.order_items.map((item) => item.product_id)
    );

    return this.getRelatedProducts(productIds, 'purchase_history');
  }

  private async calculateViewHistoryFactors(
    context: RecommendationContext
  ): Promise<RecommendationFactor[]> {
    if (!context.viewHistory?.length) return [];

    return this.getRelatedProducts(context.viewHistory, 'view_history');
  }

  private async calculateCategoryAffinityFactors(
    context: RecommendationContext
  ): Promise<RecommendationFactor[]> {
    if (!context.categoryId) return [];

    const { data: products } = await this.supabase
      .from('products')
      .select('id')
      .eq('category_id', context.categoryId)
      .limit(20);

    if (!products) return [];

    return products.map((product) => ({
      type: 'category_affinity',
      productId: product.id,
      weight: this.config.factorWeights.category_affinity,
      score: 1,
    }));
  }

  private async calculatePriceRangeFactors(
    context: RecommendationContext
  ): Promise<RecommendationFactor[]> {
    if (!context.priceRange) return [];

    const { data: products } = await this.supabase
      .from('products')
      .select('id, price')
      .gte('price', context.priceRange.min)
      .lte('price', context.priceRange.max)
      .limit(20);

    if (!products) return [];

    return products.map((product) => ({
      type: 'price_range',
      productId: product.id,
      weight: this.config.factorWeights.price_range,
      score: 1,
    }));
  }

  private async calculateStyleSimilarityFactors(
    context: RecommendationContext
  ): Promise<RecommendationFactor[]> {
    if (!context.currentProductId) return [];

    const { data: relations } = await this.supabase
      .from('product_relations')
      .select('*')
      .eq('product_id', context.currentProductId)
      .order('strength', { ascending: false })
      .limit(10);

    if (!relations) return [];

    return relations.map((relation) => ({
      type: 'style_similarity',
      productId: relation.related_product_id,
      weight: this.config.factorWeights.style_similarity,
      score: relation.strength,
    }));
  }

  private async getRelatedProducts(
    productIds: string[],
    type: RecommendationFactor['type']
  ): Promise<RecommendationFactor[]> {
    const { data: relations } = await this.supabase
      .from('product_relations')
      .select('*')
      .in('product_id', productIds)
      .order('strength', { ascending: false })
      .limit(20);

    if (!relations) return [];

    return relations.map((relation) => ({
      type,
      productId: relation.related_product_id,
      weight: this.config.factorWeights[type],
      score: relation.strength,
    }));
  }

  private async getTopProducts(scores: RecommendationScore[]) {
    if (!scores.length) return [];

    const productIds = scores.map((score) => score.product_id);

    const { data: products } = await this.supabase
      .from('products')
      .select('*')
      .in('id', productIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!products) return [];

    // If we don't want to include sold out products, filter them out
    const availableProducts = this.config.includeSoldOut
      ? products
      : products.filter((product) => product.inventory_count > 0);

    // Sort products based on recommendation scores
    return availableProducts
      .map((product) => ({
        ...product,
        score: scores.find((score) => score.product_id === product.id)?.score || 0,
      }))
      .sort((a, b) => b.score - a.score);
  }
} 