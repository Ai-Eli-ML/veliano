"use client"

import { PageHeading } from "@/components/ui/page-heading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AffiliateOverview } from "@/components/affiliate/affiliate-overview"
import { AffiliateLinks } from "@/components/affiliate/affiliate-links"
import { AffiliateTransactions } from "@/components/affiliate/affiliate-transactions"
import { AffiliateSettings } from "@/components/affiliate/affiliate-settings"
import { useState, useEffect } from "react"
import { redirect } from "next/navigation"

export default function AffiliatePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)
  
  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      // In a real app, this would check if the user is logged in
      setUser({ id: "user123" })
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])
  
  // Redirect if not logged in
  if (!isLoading && !user) {
    redirect("/account/login?redirect=/account/affiliate")
  }
  
  return (
    <div className="container max-w-screen-xl py-8">
      <PageHeading
        title="Affiliate Dashboard"
        description="Manage your affiliate account and track your earnings"
      />
      
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Marketing Links</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <AffiliateOverview />
        </TabsContent>
        
        <TabsContent value="links">
          <AffiliateLinks />
        </TabsContent>
        
        <TabsContent value="transactions">
          <AffiliateTransactions />
        </TabsContent>
        
        <TabsContent value="settings">
          <AffiliateSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
