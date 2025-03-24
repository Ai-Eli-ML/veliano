/**
 * Email Marketing System Template
 * For Phase 4 of Veliano E-commerce Project
 */

/**
 * Database Schema Template
 */
export const databaseSchema = `
-- Email Subscribers Table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
  preferences JSONB DEFAULT '{"marketing": true, "product": true, "newsletter": true}'::jsonb,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Email logs table for tracking deliveries, opens, etc.
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscriber_id UUID REFERENCES email_subscribers(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed')),
  provider_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and add policies
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Email subscribers policies
CREATE POLICY "Users can view their own subscriber data"
  ON email_subscribers FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own subscriber data"
  ON email_subscribers FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Campaign policies (admin only)
CREATE POLICY "Admin can view campaigns"
  ON email_campaigns FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admin can insert campaigns"
  ON email_campaigns FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admin can update campaigns"
  ON email_campaigns FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admin can delete campaigns"
  ON email_campaigns FOR DELETE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Email logs policies
CREATE POLICY "Users can view their own email logs"
  ON email_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM email_subscribers
    WHERE email_subscribers.id = subscriber_id
    AND email_subscribers.user_id = auth.uid()
  ) OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admin can insert email logs"
  ON email_logs FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
`;

/**
 * TypeScript Types Template
 */
export const typesDefinition = `
import { Database } from '@/types/supabase';

export interface EmailSubscriber extends Database['public']['Tables']['email_subscribers']['Row'] {
  // Base type from Supabase schema
}

export interface EmailCampaign extends Database['public']['Tables']['email_campaigns']['Row'] {
  // Base type from Supabase schema
}

export interface EmailLog extends Database['public']['Tables']['email_logs']['Row'] {
  // Base type from Supabase schema
}

export interface SubscribeEmailInput {
  email: string;
  first_name?: string;
  last_name?: string;
  preferences?: EmailPreferences;
  source?: string;
}

export interface UpdateEmailPreferencesInput {
  preferences: EmailPreferences;
  status?: 'active' | 'unsubscribed';
}

export interface EmailPreferences {
  marketing: boolean;
  product: boolean;
  newsletter: boolean;
}

export type EmailStatus = 'active' | 'unsubscribed' | 'bounced' | 'complained';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
export type DeliveryStatus = 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'failed';
`;

/**
 * Repository Template (Core functionality only)
 */
export const emailRepository = `
import { createClient } from '@/lib/supabase/server';
import { type Database } from '@/types/supabase';
import { 
  type EmailSubscriber, 
  type EmailCampaign,
  type EmailLog,
  type SubscribeEmailInput,
  type UpdateEmailPreferencesInput,
  type EmailPreferences
} from '@/types/email';

export class EmailRepository {
  private supabase = createClient();

  /**
   * Get a subscriber by email
   */
  async getSubscriberByEmail(email: string): Promise<EmailSubscriber | null> {
    const { data, error } = await this.supabase
      .from('email_subscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows returned" error
    return data as EmailSubscriber | null;
  }

  /**
   * Get a subscriber by user ID
   */
  async getSubscriberByUserId(userId: string): Promise<EmailSubscriber | null> {
    const { data, error } = await this.supabase
      .from('email_subscribers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as EmailSubscriber | null;
  }

  /**
   * Subscribe a new email
   */
  async subscribeEmail(data: SubscribeEmailInput): Promise<EmailSubscriber> {
    const { data: subscriber, error } = await this.supabase
      .from('email_subscribers')
      .insert({
        email: data.email.toLowerCase(),
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        preferences: data.preferences || { marketing: true, product: true, newsletter: true },
        status: 'active',
        source: data.source || 'website',
      })
      .select()
      .single();

    if (error) throw error;
    return subscriber as EmailSubscriber;
  }

  /**
   * Update email preferences
   */
  async updateEmailPreferences(
    subscriberId: string, 
    data: UpdateEmailPreferencesInput
  ): Promise<EmailSubscriber> {
    const { data: subscriber, error } = await this.supabase
      .from('email_subscribers')
      .update({
        preferences: data.preferences,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriberId)
      .select()
      .single();

    if (error) throw error;
    return subscriber as EmailSubscriber;
  }

  /**
   * Unsubscribe an email
   */
  async unsubscribeEmail(email: string): Promise<void> {
    const { error } = await this.supabase
      .from('email_subscribers')
      .update({
        status: 'unsubscribed',
        preferences: { marketing: false, product: false, newsletter: false },
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase());

    if (error) throw error;
  }

  /**
   * Link subscriber to user
   */
  async linkSubscriberToUser(email: string, userId: string): Promise<EmailSubscriber | null> {
    const { data, error } = await this.supabase
      .from('email_subscribers')
      .update({
        user_id: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase())
      .select()
      .single();

    if (error) throw error;
    return data as EmailSubscriber;
  }
}
`;

/**
 * Server Actions Template
 */
export const serverActions = `
'use server';

import { revalidatePath } from 'next/cache';
import { EmailRepository } from '@/repositories/EmailRepository';
import { 
  type SubscribeEmailInput, 
  type UpdateEmailPreferencesInput 
} from '@/types/email';
import { getCurrentUser } from '@/lib/session';
import { z } from 'zod';
import { sendEmailConfirmation, sendWelcomeEmail } from '@/lib/email/client';

const emailRepository = new EmailRepository();

/**
 * Subscribe to emails
 */
export async function subscribeToEmails(formData: SubscribeEmailInput) {
  try {
    // Validate input
    const schema = z.object({
      email: z.string().email(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      preferences: z.object({
        marketing: z.boolean().default(true),
        product: z.boolean().default(true),
        newsletter: z.boolean().default(true)
      }).optional(),
      source: z.string().optional()
    });

    const validatedData = schema.parse(formData);
    
    // Check if already subscribed
    const existingSubscriber = await emailRepository.getSubscriberByEmail(validatedData.email);
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        // Reactivate the subscription
        const updatedSubscriber = await emailRepository.updateEmailPreferences(
          existingSubscriber.id, 
          { 
            preferences: validatedData.preferences || existingSubscriber.preferences,
            status: 'active'
          }
        );
        
        // Send welcome back email
        await sendWelcomeEmail({
          email: updatedSubscriber.email,
          firstName: updatedSubscriber.first_name || '',
          isReturning: true
        });
        
        return { 
          success: true, 
          data: updatedSubscriber,
          message: 'Welcome back! Your subscription has been reactivated.'
        };
      }
      
      return { 
        success: false, 
        error: 'This email is already subscribed' 
      };
    }
    
    // Get current user if logged in
    const currentUser = await getCurrentUser();
    
    // Add user_id if user is logged in
    if (currentUser) {
      validatedData.user_id = currentUser.id;
    }
    
    // Create new subscriber
    const subscriber = await emailRepository.subscribeEmail(validatedData);
    
    // Send confirmation email
    await sendEmailConfirmation({
      email: subscriber.email,
      firstName: subscriber.first_name || ''
    });
    
    return { 
      success: true, 
      data: subscriber,
      message: 'Thank you for subscribing! Please check your email to confirm your subscription.'
    };
  } catch (error) {
    console.error('Failed to subscribe to emails:', error);
    return { 
      success: false, 
      error: 'Failed to subscribe. Please try again.' 
    };
  }
}

/**
 * Update email preferences
 */
export async function updateEmailPreferences(
  subscriberId: string, 
  formData: UpdateEmailPreferencesInput
) {
  try {
    const currentUser = await getCurrentUser();
    
    // Get subscriber to check permissions
    const subscriber = await emailRepository.getSubscriberByEmail(subscriberId);
    
    if (!subscriber) {
      return { 
        success: false, 
        error: 'Subscriber not found' 
      };
    }
    
    // Check if user is authorized to update preferences
    if (!currentUser || (subscriber.user_id !== currentUser.id && currentUser.role !== 'admin')) {
      return {
        success: false,
        error: 'You are not authorized to update these preferences'
      };
    }
    
    // Validate input
    const schema = z.object({
      preferences: z.object({
        marketing: z.boolean(),
        product: z.boolean(),
        newsletter: z.boolean()
      }),
      status: z.enum(['active', 'unsubscribed']).optional()
    });
    
    const validatedData = schema.parse(formData);
    
    // Update preferences
    const updatedSubscriber = await emailRepository.updateEmailPreferences(
      subscriber.id, 
      validatedData
    );
    
    // Revalidate email preferences page
    revalidatePath('/account/email-preferences');
    
    return { 
      success: true, 
      data: updatedSubscriber 
    };
  } catch (error) {
    console.error('Failed to update email preferences:', error);
    return { 
      success: false, 
      error: 'Failed to update preferences. Please try again.' 
    };
  }
}

/**
 * Unsubscribe from emails
 */
export async function unsubscribeFromEmails(email: string, token: string) {
  try {
    // Verify unsubscribe token
    // This would normally validate a JWT or other token mechanism
    // For demo purposes, we're skipping token validation
    
    // Unsubscribe the email
    await emailRepository.unsubscribeEmail(email);
    
    return { 
      success: true,
      message: 'You have been successfully unsubscribed'
    };
  } catch (error) {
    console.error('Failed to unsubscribe from emails:', error);
    return { 
      success: false, 
      error: 'Failed to unsubscribe. Please try again.' 
    };
  }
}
`;

/**
 * Component Templates (Core components only)
 */

// Email Subscription Form
export const emailSubscriptionForm = `
'use client';

import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { subscribeToEmails } from '@/actions/email';
import { type SubscribeEmailInput } from '@/types/email';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface EmailSubscriptionFormProps {
  onSuccess?: () => void;
  showNameFields?: boolean;
  source?: string;
}

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  marketing_consent: z.boolean().default(true),
  newsletter_consent: z.boolean().default(true),
  product_consent: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export const EmailSubscriptionForm: FC<EmailSubscriptionFormProps> = ({
  onSuccess,
  showNameFields = false,
  source = 'footer',
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketing_consent: true,
      newsletter_consent: true,
      product_consent: true,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Transform form data to API input
      const subscribeData: SubscribeEmailInput = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        preferences: {
          marketing: data.marketing_consent,
          newsletter: data.newsletter_consent,
          product: data.product_consent,
        },
        source,
      };
      
      const result = await subscribeToEmails(subscribeData);
      
      if (result.success) {
        toast({
          title: 'Subscribed successfully',
          description: result.message || 'You have been subscribed to our emails.',
        });
        
        // Reset form
        reset();
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: 'Subscription failed',
          description: result.error || 'Failed to subscribe. Please try again.',
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
        <CardTitle>Subscribe to our newsletter</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          
          {/* Name fields if enabled */}
          {showNameFields && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  id="first_name"
                  placeholder="First name"
                  {...register('first_name')}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Input
                  id="last_name"
                  placeholder="Last name"
                  {...register('last_name')}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Consent checkboxes */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter_consent"
                {...register('newsletter_consent')}
              />
              <label
                htmlFor="newsletter_consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Receive newsletter updates and news
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="product_consent"
                {...register('product_consent')}
              />
              <label
                htmlFor="product_consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Receive product updates and new arrivals
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing_consent"
                {...register('marketing_consent')}
              />
              <label
                htmlFor="marketing_consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Receive promotional offers and discounts
              </label>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
`;

// Email Preferences Component
export const emailPreferencesComponent = `
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
`; 