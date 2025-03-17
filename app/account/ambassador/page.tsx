"use client"

import { PageHeading } from "@/components/ui/page-heading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

export default function AmbassadorPage() {
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
    redirect("/account/login?redirect=/account/ambassador")
  }
  
  // Mock ambassador data
  const stats = {
    totalEarned: 75000, // $750.00
    pendingPayment: 25000, // $250.00
    totalReferrals: 12,
    discountCode: "AMBASSADOR20",
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <PageHeading
        title="Ambassador Program"
        description="Share your love for our products and earn rewards"
      />
      
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="referrals">My Referrals</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Earned</CardDescription>
                  <CardTitle className="text-3xl">{formatPrice(stats.totalEarned)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Lifetime earnings from your ambassador activities
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pending Payment</CardDescription>
                  <CardTitle className="text-3xl">{formatPrice(stats.pendingPayment)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Amount available for your next payout
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Referrals</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalReferrals}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    People who signed up using your referral link
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Ambassador Discount</CardTitle>
                <CardDescription>
                  Use this code to get 20% off your purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                  <span className="text-2xl font-bold tracking-wider">{stats.discountCode}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>
                Track the people you've referred to our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.totalReferrals > 0 ? (
                  <div className="rounded-md border">
                    <div className="p-4 flex justify-between items-center border-b">
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">Joined Nov 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(5000)}</p>
                        <p className="text-sm text-muted-foreground">Earned from referral</p>
                      </div>
                    </div>
                    
                    {/* More referrals would be listed here */}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      You haven't referred anyone yet. Share your referral link to start earning rewards!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Referral Rewards</CardTitle>
                <CardDescription>
                  Earn for each person you refer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold">$25</span>
                    </div>
                    <div>
                      <p className="font-medium">First Purchase Bonus</p>
                      <p className="text-sm text-muted-foreground">
                        When your referral makes their first purchase
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold">5%</span>
                    </div>
                    <div>
                      <p className="font-medium">Ongoing Commission</p>
                      <p className="text-sm text-muted-foreground">
                        On all purchases made by your referrals for 1 year
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Benefits</CardTitle>
                <CardDescription>
                  Exclusive perks for ambassadors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold">20%</span>
                    </div>
                    <div>
                      <p className="font-medium">Personal Discount</p>
                      <p className="text-sm text-muted-foreground">
                        On all your purchases as an ambassador
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold">🎁</span>
                    </div>
                    <div>
                      <p className="font-medium">Free Products</p>
                      <p className="text-sm text-muted-foreground">
                        Quarterly gifts for active ambassadors
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Resources</CardTitle>
              <CardDescription>
                Tools to help you promote our products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="relative h-40 w-full overflow-hidden rounded-md mb-4">
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Social Media Banner</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Instagram Story Template</p>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="relative h-40 w-full overflow-hidden rounded-md mb-4">
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Product Photos</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Product Image Pack</p>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
