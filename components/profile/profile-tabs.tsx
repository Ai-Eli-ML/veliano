'use client'

import { UserProfile } from '@/types/user'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShippingAddresses } from './shipping-addresses'
import { UserPreferences } from './preferences'
import { OrderHistory } from './order-history'

interface ProfileTabsProps {
  profile: UserProfile
}

export function ProfileTabs({ profile }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="orders" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="addresses">Addresses</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value="orders" className="space-y-4">
        <OrderHistory userId={profile.id} />
      </TabsContent>
      <TabsContent value="addresses" className="space-y-4">
        <ShippingAddresses profile={profile} />
      </TabsContent>
      <TabsContent value="preferences" className="space-y-4">
        <UserPreferences userId={profile.id} initialPreferences={profile.preferences} />
      </TabsContent>
    </Tabs>
  )
} 