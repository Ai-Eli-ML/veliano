'use client'

import { useState } from 'react'
import { UserProfile } from '@/types/user'
import { UserRepository } from '@/lib/repositories/user-repository'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'

interface PreferencesProps {
  profile: UserProfile
}

export function Preferences({ profile }: PreferencesProps) {
  const [preferences, setPreferences] = useState(
    profile.preferences || {
      marketing_emails: false,
      order_updates: true,
      newsletter: false,
    }
  )

  const handleToggle = async (key: keyof typeof preferences) => {
    try {
      const userRepo = UserRepository.getInstance()
      const updatedPreferences = {
        ...preferences,
        [key]: !preferences[key],
      }

      const success = await userRepo.updatePreferences(profile.id, updatedPreferences)

      if (success) {
        setPreferences(updatedPreferences)
        toast({
          title: 'Preferences updated',
          description: 'Your preferences have been updated successfully.',
        })
      } else {
        throw new Error('Failed to update preferences')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update preferences. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how you receive notifications and updates from us.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="marketing_emails" className="flex flex-col space-y-1">
            <span>Marketing Emails</span>
            <span className="text-sm text-muted-foreground">
              Receive emails about new products, sales, and promotions.
            </span>
          </Label>
          <Switch
            id="marketing_emails"
            checked={preferences.marketing_emails}
            onCheckedChange={() => handleToggle('marketing_emails')}
          />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="order_updates" className="flex flex-col space-y-1">
            <span>Order Updates</span>
            <span className="text-sm text-muted-foreground">
              Receive notifications about your order status and shipping updates.
            </span>
          </Label>
          <Switch
            id="order_updates"
            checked={preferences.order_updates}
            onCheckedChange={() => handleToggle('order_updates')}
          />
        </div>
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="newsletter" className="flex flex-col space-y-1">
            <span>Newsletter</span>
            <span className="text-sm text-muted-foreground">
              Subscribe to our monthly newsletter for exclusive content and tips.
            </span>
          </Label>
          <Switch
            id="newsletter"
            checked={preferences.newsletter}
            onCheckedChange={() => handleToggle('newsletter')}
          />
        </div>
      </CardContent>
    </Card>
  )
} 