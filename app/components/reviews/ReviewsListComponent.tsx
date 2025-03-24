
import { type FC } from 'react';
import { ReviewCard } from './ReviewCard';
import { type ReviewWithUser } from '@/types/reviews';
import { Pagination } from '@/components/ui/pagination';

interface ReviewsListProps {
  reviews: ReviewWithUser[];
  productId: string;
  totalCount: number;
  page: number;
  perPage: number;
}

export const ReviewsList: FC<ReviewsListProps> = ({
  reviews,
  productId,
  totalCount,
  page,
  perPage
}) => {
  const totalPages = Math.ceil(totalCount / perPage);
  
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Customer Reviews</h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard 
            key={review.id} 
            review={review}
            productId={productId}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          baseUrl={\`/products/\${productId}?reviewPage=\`} 
        />
      )}
    </div>
  );
};
