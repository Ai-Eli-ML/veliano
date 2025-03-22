'use client'

import { useState } from 'react'
import { type FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import * as Sentry from '@sentry/nextjs'

interface Preferences {
  marketingEmails: boolean
  orderUpdates: boolean
  newProducts: boolean
}

interface PreferenceSettingsProps {
  userId: string
}

export const PreferenceSettings: FC<PreferenceSettingsProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>({
    marketingEmails: false,
    orderUpdates: true,
    newProducts: false
  })
  const { toast } = useToast()

  const handlePreferenceChange = async (key: keyof Preferences, value: boolean) => {
    setIsLoading(true)
    
    // Optimistic update
    setPreferences(prev => ({ ...prev, [key]: value }))

    try {
      const response = await fetch('/api/profile/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          preference: key,
          value
        })
      })

      if (!response.ok) throw new Error('Failed to update preferences')

      toast({
        title: 'Success',
        description: 'Preferences updated successfully'
      })
    } catch (error) {
      // Rollback on error
      setPreferences(prev => ({ ...prev, [key]: !value }))
      
      Sentry.captureException(error, {
        extra: {
          component: 'PreferenceSettings',
          operation: 'updatePreference',
          userId,
          preference: key
        }
      })
      
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="marketing-emails">Marketing Emails</Label>
          <Switch
            id="marketing-emails"
            checked={preferences.marketingEmails}
            disabled={isLoading}
            onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="order-updates">Order Updates</Label>
          <Switch
            id="order-updates"
            checked={preferences.orderUpdates}
            disabled={isLoading}
            onCheckedChange={(checked) => handlePreferenceChange('orderUpdates', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="new-products">New Product Notifications</Label>
          <Switch
            id="new-products"
            checked={preferences.newProducts}
            disabled={isLoading}
            onCheckedChange={(checked) => handlePreferenceChange('newProducts', checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
} 