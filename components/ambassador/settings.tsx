"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface AmbassadorSettings {
  displayName: string
  email: string
  website: string | null
  payoutMethod: "paypal" | "bank_transfer"
  payoutEmail: string
  minimumPayout: number
  emailNotifications: boolean
}

interface SettingsProps {
  settings: AmbassadorSettings
  onSave: (settings: AmbassadorSettings) => Promise<void>
}

export function Settings({ settings, onSave }: SettingsProps) {
  const [formData, setFormData] = useState<AmbassadorSettings>(settings)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(formData)
      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              type="url"
              value={formData.website || ""}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value || null })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payoutMethod">Payout Method</Label>
            <Select
              value={formData.payoutMethod}
              onValueChange={(value: "paypal" | "bank_transfer") =>
                setFormData({ ...formData, payoutMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payoutEmail">Payout Email</Label>
            <Input
              id="payoutEmail"
              type="email"
              value={formData.payoutEmail}
              onChange={(e) =>
                setFormData({ ...formData, payoutEmail: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumPayout">Minimum Payout Amount ($)</Label>
            <Input
              id="minimumPayout"
              type="number"
              min="0"
              step="0.01"
              value={formData.minimumPayout}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimumPayout: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={formData.emailNotifications}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emailNotifications: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="emailNotifications">
              Receive email notifications for new referrals and payouts
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
} 