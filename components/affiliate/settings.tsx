"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsProps {
  affiliate: any // TODO: Add proper type
}

export function Settings({ affiliate }: SettingsProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              defaultValue={affiliate.name}
              placeholder="Your display name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue={affiliate.email}
              placeholder="Your email address"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              defaultValue={affiliate.website}
              placeholder="Your website URL"
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="payout-method">Payout Method</Label>
            <Select defaultValue={affiliate.payout_method || "paypal"}>
              <SelectTrigger>
                <SelectValue placeholder="Select payout method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payout-email">Payout Email</Label>
            <Input
              id="payout-email"
              type="email"
              defaultValue={affiliate.payout_email}
              placeholder="Email for receiving payments"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="min-payout">Minimum Payout Amount</Label>
            <Input
              id="min-payout"
              type="number"
              defaultValue={affiliate.min_payout || "100"}
              min="100"
              step="50"
            />
          </div>
          <Button>Save Payout Settings</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Email Notifications</Label>
            <Select defaultValue={affiliate.email_notifications || "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Select notification preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All notifications</SelectItem>
                <SelectItem value="important">Important only</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>Save Notification Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
} 