import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/products/ProductDetails';
import { ProductRecommendations } from '@/components/recommendations/ProductRecommendations';
import { Database } from '@/types/supabase';

interface Props {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Get product details
  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', params.id)
    .single();

  if (!product) {
    notFound();
  }

  // Get user for personalized recommendations
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's view history from analytics events
  let viewHistory: string[] = [];
  if (user) {
    const { data: viewEvents } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('user_id', user.id)
      .eq('event_type', 'product_view')
      .order('created_at', { ascending: false })
      .limit(10);

    viewHistory = viewEvents
      ?.map(event => event.metadata.product_id)
      .filter(Boolean) || [];
  }

  // Track this product view
  if (user) {
    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'product_view',
      metadata: {
        product_id: params.id,
        timestamp: new Date().toISOString(),
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />

      {/* Similar Products */}
      <div className="mt-16">
        <ProductRecommendations
          context={{
            currentProductId: params.id,
            categoryId: product.category_id,
            userId: user?.id,
            viewHistory,
          }}
          title="Similar Products"
          maxItems={4}
        />
      </div>

      {/* Personalized Recommendations */}
      {viewHistory.length > 0 && (
        <div className="mt-16">
          <ProductRecommendations
            context={{
              userId: user?.id,
              viewHistory,
              priceRange: {
                min: product.price * 0.7,
                max: product.price * 1.3,
              },
            }}
            title="You Might Also Like"
            maxItems={4}
          />
        </div>
      )}
    </div>
  );
} 