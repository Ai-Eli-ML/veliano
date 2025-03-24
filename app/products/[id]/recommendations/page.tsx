import { Metadata } from 'next';
import { ProductRecommendations } from '@/components/recommendations/ProductRecommendations';
import { FrequentlyBoughtTogether } from '@/components/recommendations/FrequentlyBoughtTogether';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchProductById } from '@/actions/products';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Product Recommendations | Veliano',
  description: 'Discover products similar to ones you love at Veliano Jewelry.'
};

interface ProductRecommendationsPageProps {
  params: {
    id: string;
  };
}

export default async function ProductRecommendationsPage({ params }: ProductRecommendationsPageProps) {
  const { id } = params;
  
  // Fetch the product
  const product = await fetchProductById(id);
  
  if (!product) {
    return notFound();
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Recommendations for {product.name}</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Similar Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductRecommendations productId={id} type="similar" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Frequently Bought Together</CardTitle>
          </CardHeader>
          <CardContent>
            <FrequentlyBoughtTogether productId={id} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customers Also Viewed</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductRecommendations productId={id} type="viewed" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 