
'use client';

import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { updateEmailPreferences } from '@/actions/email';
import { type EmailSubscriber, type UpdateEmailPreferencesInput } from '@/types/email';
import { useToast } from '@/components/ui/use-toast';

interface EmailPreferencesProps {
  subscriber: EmailSubscriber;
}

interface FormValues {
  marketing: boolean;
  product: boolean;
  newsletter: boolean;
  unsubscribe: boolean;
}

export const EmailPreferences: FC<EmailPreferencesProps> = ({
  subscriber
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      marketing: subscriber.preferences.marketing,
      product: subscriber.preferences.product,
      newsletter: subscriber.preferences.newsletter,
      unsubscribe: subscriber.status === 'unsubscribed',
    },
  });
  
  const isUnsubscribed = watch('unsubscribe');
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Transform form data to API input
      const updateData: UpdateEmailPreferencesInput = {
        preferences: {
          marketing: data.unsubscribe ? false : data.marketing,
          product: data.unsubscribe ? false : data.product,
          newsletter: data.unsubscribe ? false : data.newsletter,
        },
        status: data.unsubscribe ? 'unsubscribed' : 'active',
      };
      
      const result = await updateEmailPreferences(subscriber.id, updateData);
      
      if (result.success) {
        toast({
          title: 'Preferences updated',
          description: 'Your email preferences have been updated successfully.',
        });
      } else {
        toast({
          title: 'Update failed',
          description: result.error || 'Failed to update preferences. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
        <CardDescription>
          Manage the types of emails you receive from us
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Marketing emails</h3>
                <p className="text-sm text-gray-500">
                  Promotional offers, discounts, and special events
                </p>
              </div>
              <Switch 
                id="marketing"
                {...register('marketing')} 
                disabled={isUnsubscribed}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Product emails</h3>
                <p className="text-sm text-gray-500">
                  New products, restocks, and product updates
                </p>
              </div>
              <Switch 
                id="product"
                {...register('product')} 
                disabled={isUnsubscribed}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Newsletter</h3>
                <p className="text-sm text-gray-500">
                  Weekly newsletter with news, tips, and trends
                </p>
              </div>
              <Switch 
                id="newsletter"
                {...register('newsletter')} 
                disabled={isUnsubscribed}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-600">Unsubscribe from all emails</h3>
              <p className="text-sm text-gray-500">
                You will no longer receive any emails from us
              </p>
            </div>
            <Switch 
              id="unsubscribe"
              {...register('unsubscribe')} 
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? 'Saving...' : 'Save preferences'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
