'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { subscribeToNewsletter } from '@/app/actions/email';
import { useAuth } from '@/components/providers/auth-provider';

const subscriptionSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().optional(),
  marketingConsent: z.boolean().default(true)
});

type SubscriptionValues = z.infer<typeof subscriptionSchema>;

export default function EmailSubscriptionForm({
  variant = 'default',
  className = '',
  showName = false
}: {
  variant?: 'default' | 'minimal' | 'footer'
  className?: string
  showName?: boolean
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  
  const form = useForm<SubscriptionValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: '',
      marketingConsent: true
    }
  });
  
  async function onSubmit(values: SubscriptionValues) {
    setStatus('loading');
    try {
      const result = await subscribeToNewsletter(values);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Successfully subscribed to newsletter!');
        form.reset();
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
      console.error('Subscription error:', error);
    }
  }
  
  if (status === 'success') {
    return (
      <div className={`rounded-lg border bg-card p-4 shadow-sm ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-2 p-2 text-center">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <h3 className="text-lg font-medium">Thanks for subscribing!</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${variant === 'minimal' ? '' : 'rounded-lg border bg-card p-4 shadow-sm'} ${className}`}>
      {variant !== 'minimal' && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">Subscribe to our newsletter</h3>
          <p className="text-sm text-muted-foreground">
            Get the latest updates, promotions, and jewelry tips straight to your inbox
          </p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {showName && (
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
            <Input
                      placeholder="First name (optional)" 
                      {...field} 
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                        placeholder="Your email address" 
                        type="email"
                        className="pl-10 w-full"
                        {...field} 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className={variant === 'minimal' ? 'px-3' : ''}
                    >
                      {status === 'loading' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : variant === 'minimal' ? (
                        'Subscribe'
                      ) : (
                        'Subscribe to Newsletter'
                      )}
                    </Button>
              </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {status === 'error' && (
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{message}</span>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            By subscribing, you agree to our{' '}
            <a href="/privacy-policy" className="underline hover:text-primary">
              Privacy Policy
            </a>{' '}
            and consent to receive marketing communications.
          </div>
      </form>
      </Form>
    </div>
  );
}
