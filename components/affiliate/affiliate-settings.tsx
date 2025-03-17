"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function AffiliateSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    paypalEmail: "user@example.com",
    notifyNewSale: true,
    notifyPayment: true,
    notifyPromotion: true,
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would call your API here
      console.log("Saving settings:", formData)
      
      // Show success message or notification
      alert("Settings saved successfully")
    } catch (err) {
      console.error("Error saving settings:", err)
      alert("Failed to save settings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
          <CardDescription>
            Configure how you receive your affiliate commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">PayPal Email</Label>
                <Input
                  id="paypalEmail"
                  name="paypalEmail"
                  type="email"
                  value={formData.paypalEmail}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  We'll send your commission payments to this PayPal account
                </p>
              </div>
              
              <div>
                <h3 className="mb-4 text-sm font-medium">Payment Schedule</h3>
                <div className="rounded-md border p-4 text-sm">
                  <p className="font-medium">Monthly Payments</p>
                  <p className="text-muted-foreground">
                    Payments are processed on the 15th of each month for the previous month's earnings,
                    provided your balance exceeds the minimum threshold of $50.
                  </p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Preferences</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyNewSale">New Sale Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive an email when someone makes a purchase using your affiliate link
                  </p>
                </div>
                <Switch
                  id="notifyNewSale"
                  checked={formData.notifyNewSale}
                  onCheckedChange={(checked) => handleSwitchChange("notifyNewSale", checked)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyPayment">Payment Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive an email when a commission payment is sent to you
                  </p>
                </div>
                <Switch
                  id="notifyPayment"
                  checked={formData.notifyPayment}
                  onCheckedChange={(checked) => handleSwitchChange("notifyPayment", checked)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyPromotion">Promotional Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive emails about special promotions and increased commission opportunities
                  </p>
                </div>
                <Switch
                  id="notifyPromotion"
                  checked={formData.notifyPromotion}
                  onCheckedChange={(checked) => handleSwitchChange("notifyPromotion", checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 