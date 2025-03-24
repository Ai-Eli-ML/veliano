
import { type FC } from 'react';
import { type ReviewWithUser } from '@/types/reviews';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { markReviewAsHelpful } from '@/actions/reviews';
import { useTransition } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar } from '@/components/ui/avatar';

interface ReviewCardProps {
  review: ReviewWithUser;
  productId: string;
}

export const ReviewCard: FC<ReviewCardProps> = ({ review, productId }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const user = review.profiles;
  
  const handleMarkHelpful = () => {
    startTransition(async () => {
      const result = await markReviewAsHelpful(review.id, productId);
      
      if (result.success) {
        toast({
          title: 'Thank you!',
          description: 'You marked this review as helpful',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Something went wrong',
          variant: 'destructive',
        });
      }
    });
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            className="h-10 w-10"
            src={user?.avatar_url || undefined}
            alt={user?.full_name || 'User'}
            fallback={(user?.full_name?.charAt(0) || 'U').toUpperCase()}
          />
          <div>
            <p className="font-medium">
              {user?.full_name || 'Anonymous User'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      
      {review.title && (
        <h4 className="mt-3 font-medium">{review.title}</h4>
      )}
      
      {review.content && (
        <p className="mt-2 text-gray-700">{review.content}</p>
      )}
      
      {review.verified_purchase && (
        <div className="mt-2">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Verified Purchase
          </span>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {review.helpful_votes} {review.helpful_votes === 1 ? 'person' : 'people'} found this helpful
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkHelpful}
          disabled={isPending}
        >
          {isPending ? 'Processing...' : 'Mark as Helpful'}
        </Button>
      </div>
    </div>
  );
};
