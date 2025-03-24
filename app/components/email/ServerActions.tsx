
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
