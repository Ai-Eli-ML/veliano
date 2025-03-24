import { type FC } from 'react';
import { Metadata } from 'next';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fetchProductById } from '@/actions/products';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Product Reviews | Veliano',
  description: 'View and submit reviews for products on Veliano Jewelry.'
};

interface ProductReviewsPageProps {
  params: {
    id: string;
  };
}

export default async function ProductReviewsPage({ params }: ProductReviewsPageProps) {
  const { id } = params;
  
  // Fetch the product
  const product = await fetchProductById(id);
  
  if (!product) {
    return notFound();
  }
  
  // Get current user
  const currentUser = await getCurrentUser();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Reviews for {product.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewsList productId={id} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          {currentUser ? (
            <ReviewForm productId={id} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Please sign in to leave a review.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 