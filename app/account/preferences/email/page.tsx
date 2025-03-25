'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateEmailPreferences } from '@/actions/email';
import type { UserEmailPreferences } from '@/types/email';

interface EmailPreferencesFormProps {
  initialPreferences: UserEmailPreferences;
}

export default function EmailPreferencesPage({
  initialPreferences,
}: EmailPreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserEmailPreferences>(initialPreferences);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePreferenceChange = (
    key: keyof UserEmailPreferences,
    value: boolean
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateEmailPreferences(preferences);
      toast.success('Email preferences updated successfully');
    } catch (error) {
      console.error('Error updating email preferences:', error);
      toast.error('Failed to update email preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Email Preferences</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="marketing_emails">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about sales, new products, and special offers
            </p>
          </div>
          <Switch
            id="marketing_emails"
            checked={preferences.marketing_emails}
            onCheckedChange={(checked) =>
              handlePreferenceChange('marketing_emails', checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="product_updates">Product Updates</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about new product releases and updates
            </p>
          </div>
          <Switch
            id="product_updates"
            checked={preferences.product_updates}
            onCheckedChange={(checked) =>
              handlePreferenceChange('product_updates', checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="order_updates">Order Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive important updates about your orders
            </p>
          </div>
          <Switch
            id="order_updates"
            checked={preferences.order_updates}
            disabled
            onCheckedChange={(checked) =>
              handlePreferenceChange('order_updates', checked)
            }
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full mt-6"
        >
          {isSubmitting ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </Card>
  );
} 