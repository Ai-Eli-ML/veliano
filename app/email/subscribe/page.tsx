import { Metadata } from 'next';
import EmailSubscriptionForm from '@/components/email/EmailSubscriptionForm';

export const metadata: Metadata = {
  title: 'Subscribe to our Newsletter | Veliano Jewelry',
  description: 'Stay updated with the latest jewelry trends, collections, and exclusive offers',
};

export default function SubscribePage() {
  return (
    <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Join Our Newsletter</h1>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Be the first to know about new collections, special events, and exclusive offers.
          </p>
        </div>
        
        <div className="mt-10">
          <EmailSubscriptionForm />
        </div>
        
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            We respect your privacy and will never share your information with third parties.
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
} 