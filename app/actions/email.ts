'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema validation
const subscriptionSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().optional(),
  marketingConsent: z.boolean().default(true)
})

type SubscriptionInput = z.infer<typeof subscriptionSchema>

interface ActionResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * Subscribe a user to the newsletter
 */
export async function subscribeToNewsletter(formData: SubscriptionInput): Promise<ActionResponse> {
  try {
    // Validate input
    const validated = subscriptionSchema.safeParse(formData)
    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid form data: ' + JSON.stringify(validated.error.format())
      }
    }
    
    const { email, firstName, marketingConsent } = validated.data
    
    // Initialize Supabase client
    const supabase = createServerActionClient({ cookies })
    
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('email_subscribers')
      .select('id, status, user_id')
      .eq('email', email)
      .single()
    
    // If already subscribed with active status, return success
    if (existingSubscriber && existingSubscriber.status === 'active') {
      return {
        success: true,
        message: 'You are already subscribed to our newsletter!'
      }
    }
    
    // Get current user if authenticated
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id
    
    const timestamp = new Date().toISOString()
    
    // If subscriber exists but is unsubscribed, update their record
    if (existingSubscriber) {
      const { error } = await supabase
        .from('email_subscribers')
        .update({
          first_name: firstName || null,
          status: 'active',
          preferences: { marketing: marketingConsent },
          updated_at: timestamp,
          user_id: userId || existingSubscriber.user_id
        })
        .eq('id', existingSubscriber.id)
      
      if (error) {
        console.error('Error updating subscriber:', error)
        return {
          success: false,
          error: 'Failed to update subscription. Please try again.'
        }
      }
      
      // Log the resubscription event
      await supabase
        .from('email_logs')
        .insert({
          subscriber_id: existingSubscriber.id,
          event_type: 'resubscribe',
          metadata: { 
            source: 'website',
            user_agent: 'server_action'
          }
        })
        
        return { 
          success: true, 
        message: 'Welcome back! You have been resubscribed to our newsletter.'
      }
    }
    
    // Otherwise create a new subscriber
    const { data: newSubscriber, error } = await supabase
      .from('email_subscribers')
      .insert({
        email,
        first_name: firstName || null,
        status: 'active',
        source: 'website',
        preferences: { marketing: marketingConsent },
        user_id: userId,
        created_at: timestamp,
        updated_at: timestamp
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error creating subscriber:', error)
      return {
        success: false,
        error: 'Failed to subscribe. Please try again.'
      }
    }
    
    // Log the subscription event
    await supabase
      .from('email_logs')
      .insert({
        subscriber_id: newSubscriber.id,
        event_type: 'subscribe',
        metadata: {
          source: 'website',
          user_agent: 'server_action'
        }
      })
    
    // Revalidate paths that might show subscription status
    revalidatePath('/account/preferences')
    
    return { 
      success: true, 
      message: 'Thank you! You have been subscribed to our newsletter.'
    }
  } catch (error) {
    console.error('Subscription error:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * Update a user's email preferences
 */
export async function updateEmailPreferences(
  preferences: { 
    marketing?: boolean
    transactional?: boolean 
    productUpdates?: boolean
  }
): Promise<ActionResponse> {
  try {
    // Initialize Supabase client
    const supabase = createServerActionClient({ cookies })
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return { 
        success: false, 
        error: 'You must be logged in to update email preferences'
      }
    }
    
    const email = session.user.email
    
    if (!email) {
      return {
        success: false,
        error: 'No email associated with this account'
      }
    }
    
    // Find the subscriber record
    const { data: subscriber } = await supabase
      .from('email_subscribers')
      .select('id, preferences')
      .eq('email', email)
      .single()
    
    if (!subscriber) {
      // If no subscriber record exists, create one with the user's preferences
      const { error } = await supabase
        .from('email_subscribers')
        .insert({
          email,
          user_id: session.user.id,
          status: 'active',
          source: 'account_preferences',
          preferences: {
            marketing: preferences.marketing ?? false,
            transactional: preferences.transactional ?? true,
            product_updates: preferences.productUpdates ?? false
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('Error creating subscriber with preferences:', error)
        return {
          success: false,
          error: 'Failed to update preferences. Please try again.'
        }
      }
      
      revalidatePath('/account/preferences')
      return {
        success: true,
        message: 'Email preferences saved successfully.'
      }
    }
    
    // Update existing preferences
    const updatedPreferences = {
      ...subscriber.preferences,
      marketing: preferences.marketing !== undefined ? preferences.marketing : subscriber.preferences?.marketing,
      transactional: preferences.transactional !== undefined ? preferences.transactional : subscriber.preferences?.transactional,
      product_updates: preferences.productUpdates !== undefined ? preferences.productUpdates : subscriber.preferences?.product_updates
    }
    
    const { error } = await supabase
      .from('email_subscribers')
      .update({
        preferences: updatedPreferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)
    
    if (error) {
      console.error('Error updating preferences:', error)
      return {
        success: false,
        error: 'Failed to update preferences. Please try again.'
      }
    }
    
    // Log the preference update
    await supabase
      .from('email_logs')
      .insert({
        subscriber_id: subscriber.id,
        event_type: 'preference_update',
        metadata: {
          previous_preferences: subscriber.preferences,
          new_preferences: updatedPreferences
        }
      })
    
    revalidatePath('/account/preferences')
    
    return { 
      success: true, 
      message: 'Email preferences updated successfully.'
    }
  } catch (error) {
    console.error('Preference update error:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * Unsubscribe from all marketing emails
 */
export async function unsubscribeFromEmails(email: string): Promise<ActionResponse> {
  try {
    // Validate email
    if (!email || !email.includes('@')) {
      return {
        success: false,
        error: 'Invalid email address'
      }
    }
    
    // Initialize Supabase client
    const supabase = createServerActionClient({ cookies })
    
    // Find the subscriber
    const { data: subscriber } = await supabase
      .from('email_subscribers')
      .select('id, preferences')
      .eq('email', email)
      .single()
    
    if (!subscriber) {
      return {
        success: false,
        error: 'Email not found in our system'
      }
    }
    
    // Update subscriber status to unsubscribed and disable marketing preferences
    const { error } = await supabase
      .from('email_subscribers')
      .update({
        status: 'unsubscribed',
        preferences: {
          ...subscriber.preferences,
          marketing: false,
          product_updates: false
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)
    
    if (error) {
      console.error('Error unsubscribing:', error)
      return {
        success: false,
        error: 'Failed to unsubscribe. Please try again.'
      }
    }
    
    // Log the unsubscribe event
    await supabase
      .from('email_logs')
      .insert({
        subscriber_id: subscriber.id,
        event_type: 'unsubscribe',
        metadata: {
          source: 'unsubscribe_link',
          previous_preferences: subscriber.preferences
        }
      })
    
    return { 
      success: true,
      message: 'You have been successfully unsubscribed from marketing emails.'
    }
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}
