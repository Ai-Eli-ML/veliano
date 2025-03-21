'use client'

import { useState, useEffect } from 'react'
import { UserProfile, UserPreferences } from '@/types/user'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useSupabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface PreferencesProps {
  userId: string
  initialPreferences?: UserPreferences
}

export function UserPreferences({ userId, initialPreferences }: PreferencesProps) {
  const { toast } = useToast()
  const supabase = useSupabase()
  const [isSaving, setIsSaving] = useState(false)
  
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || {
      marketingEmails: false,
      orderUpdates: true,
      newProductAlerts: false,
      saleAlerts: true,
      darkMode: false,
    }
  )

  const handlePreferenceChange = (key: keyof UserPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const savePreferences = async () => {
    if (!userId) return
    
    try {
      setIsSaving(true)
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferences: preferences,
          updated_at: new Date().toISOString()
        })
        
      if (error) throw error
      
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated"
      })
      
    } catch (error: any) {
      toast({
        title: "Failed to save preferences",
        description: error.message || "An error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
              <span>Marketing Emails</span>
              <span className="text-sm text-muted-foreground">
                Receive emails about new products and promotions
              </span>
            </Label>
            <Switch
              id="marketing-emails" 
              checked={preferences.marketingEmails}
              onCheckedChange={(checked) => 
                handlePreferenceChange('marketingEmails', checked)
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates" className="flex flex-col space-y-1">
              <span>Order Updates</span>
              <span className="text-sm text-muted-foreground">
                Receive notifications about your orders
              </span>
            </Label>
            <Switch
              id="order-updates" 
              checked={preferences.orderUpdates}
              onCheckedChange={(checked) => 
                handlePreferenceChange('orderUpdates', checked)
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="new-products" className="flex flex-col space-y-1">
              <span>New Product Alerts</span>
              <span className="text-sm text-muted-foreground">
                Be notified when new products are available
              </span>
            </Label>
            <Switch
              id="new-products" 
              checked={preferences.newProductAlerts}
              onCheckedChange={(checked) => 
                handlePreferenceChange('newProductAlerts', checked)
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="sale-alerts" className="flex flex-col space-y-1">
              <span>Sale Alerts</span>
              <span className="text-sm text-muted-foreground">
                Be notified about sales and discounts
              </span>
            </Label>
            <Switch
              id="sale-alerts" 
              checked={preferences.saleAlerts}
              onCheckedChange={(checked) => 
                handlePreferenceChange('saleAlerts', checked)
              }
            />
          </div>
        </div>
        
        <Button 
          onClick={savePreferences} 
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  )
} 