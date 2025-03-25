'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { updateEmailPreferences } from '@/app/actions/email';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface EmailPreference {
  marketing: boolean;
  transactional: boolean;
  productUpdates: boolean;
}

export interface EmailPreferencesProps {
  userId: string;
  initialPreferences?: {
    marketing: boolean;
    orderUpdates: boolean;
    newsletter: boolean;
  };
}

export default function EmailPreferences({ userId, initialPreferences }: EmailPreferencesProps) {
  const [preferences, setPreferences] = useState(initialPreferences || {
    marketing: true,
    orderUpdates: true,
    newsletter: true,
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    async function fetchPreferences() {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data } = await supabase
          .from('email_subscribers')
          .select('preferences')
          .eq('email', user.email)
          .single();
        
        if (data?.preferences) {
          setPreferences({
            marketing: data.preferences.marketing ?? true,
            transactional: data.preferences.transactional ?? true,
            productUpdates: data.preferences.product_updates ?? true
          });
        }
      } catch (error) {
        console.error('Error fetching email preferences:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPreferences();
  }, [user, supabase]);
  
  const handleToggle = (key: keyof EmailPreference) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const result = await updateEmailPreferences(preferences);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message || 'Preferences updated successfully!');
        toast.success("Email preferences updated successfully");
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to update preferences. Please try again.');
        toast.error("Failed to update email preferences");
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
      console.error('Error updating preferences:', error);
      toast.error("Failed to update email preferences");
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">Loading email preferences...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!user) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2">You must be signed in to manage email preferences.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
        <CardDescription>
            Manage what types of emails you receive from us.
        </CardDescription>
      </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="flex items-center space-x-2 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>{message}</span>
              </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center space-x-2 rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}
            
          <div className="flex items-center justify-between py-2">
              <div>
              <h3 className="font-medium">Marketing Emails</h3>
              <p className="text-sm text-muted-foreground">
                Receive promotions, discounts, and special offers.
                </p>
              </div>
              <Switch 
              checked={preferences.marketing}
              onCheckedChange={() => handleToggle('marketing')}
              aria-label="Marketing emails"
              />
            </div>
            
          <div className="flex items-center justify-between py-2">
              <div>
              <h3 className="font-medium">Transactional Emails</h3>
              <p className="text-sm text-muted-foreground">
                Order confirmations, shipping updates, and account notifications.
                </p>
              </div>
              <Switch 
              checked={preferences.transactional}
              onCheckedChange={() => handleToggle('transactional')}
              aria-label="Transactional emails"
            />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium">Product Updates</h3>
              <p className="text-sm text-muted-foreground">
                New jewelry releases and collection launches.
              </p>
            </div>
            <Switch 
              checked={preferences.productUpdates}
              onCheckedChange={() => handleToggle('productUpdates')}
              aria-label="Product update emails"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="ml-auto"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </CardFooter>
      </Card>
      </form>
  );
}
