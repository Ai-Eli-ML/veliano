import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const recommendationQuerySchema = z.object({
  type: z.enum(['similar', 'frequently-bought', 'popular']).optional().default('similar'),
  limit: z.coerce.number().min(1).max(20).optional().default(6),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Parse the query parameters
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || 'similar';
    const limitParam = searchParams.get('limit') || '6';
    
    // Validate query parameters
    const parsedQuery = recommendationQuerySchema.safeParse({
      type,
      limit: limitParam
    });
    
    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parsedQuery.error.format() },
        { status: 400 }
      );
    }
    
    const { type: recommendationType, limit } = parsedQuery.data;
    
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current product category for similarity recommendations
    const { data: currentProduct } = await supabase
      .from('products')
      .select('category_id, price')
      .eq('id', productId)
      .single();
    
    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    let recommendedProducts;
    
    // Get recommendations based on the type
    switch (recommendationType) {
      case 'similar':
        // Get products in the same category with similar prices
        const { data: similarProducts } = await supabase
          .from('products')
          .select(`
            id, 
            name, 
            slug, 
            price, 
            sale_price, 
            main_image_url,
            average_rating
          `)
          .eq('category_id', currentProduct.category_id)
          .neq('id', productId) // Exclude the current product
          .order('average_rating', { ascending: false }) // Higher rated first
          .limit(limit);
          
        recommendedProducts = similarProducts;
        break;
        
      case 'frequently-bought':
        // Get products that are frequently bought with this product
        // This would typically use order history data to find correlations
        // For now, we'll use a simplified approach with product_relations table
        const { data: frequentlyBoughtProducts } = await supabase
          .from('product_relations')
          .select(`
            related_product_id,
            relation_strength,
            products:related_product_id (
              id, 
              name, 
              slug, 
              price, 
              sale_price, 
              main_image_url,
              average_rating
            )
          `)
          .eq('product_id', productId)
          .eq('relation_type', 'frequently_bought_together')
          .order('relation_strength', { ascending: false })
          .limit(limit);
          
        // Transform the result to get just the product data
        recommendedProducts = frequentlyBoughtProducts?.map(item => item.products) || [];
        
        // If no frequent buys are found, fall back to popular products
        if (!recommendedProducts.length) {
          const { data: fallbackProducts } = await supabase
            .from('products')
            .select(`
              id, 
              name, 
              slug, 
              price, 
              sale_price, 
              main_image_url,
              average_rating
            `)
            .neq('id', productId)
            .order('total_sales', { ascending: false })
            .limit(limit);
            
          recommendedProducts = fallbackProducts;
        }
        break;
        
      case 'popular':
        // Get popular products based on sales or views
        const { data: popularProducts } = await supabase
          .from('products')
          .select(`
            id, 
            name, 
            slug, 
            price, 
            sale_price, 
            main_image_url,
            average_rating,
            total_sales
          `)
          .neq('id', productId)
          .order('total_sales', { ascending: false })
          .limit(limit);
          
        recommendedProducts = popularProducts;
        break;
    }
    
    // Log the recommendation request for analytics
    await supabase
      .from('recommendation_logs')
      .insert({
        product_id: productId,
        recommendation_type: recommendationType,
        results_count: recommendedProducts?.length || 0,
        created_at: new Date().toISOString()
      })
      .select();
    
    return NextResponse.json({
      recommendationType,
      count: recommendedProducts?.length || 0,
      recommendations: recommendedProducts || []
    });
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product recommendations' },
      { status: 500 }
    );
  }
} 