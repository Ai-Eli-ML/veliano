"use client"

import { PageHeading } from "@/components/ui/page-heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { formatPrice } from "@/lib/utils"

export default function MembershipPage() {
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
    redirect("/account/login?redirect=/account/membership")
  }
  
  // Mock membership data
  const membership = {
    status: "active",
    plan: "premium",
    nextBillingDate: "2024-01-15",
    price: 9900, // $99.00
  }
  
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 4900, // $49.00
      interval: "year",
      description: "Essential benefits for casual shoppers",
      features: [
        "10% discount on all purchases",
        "Free standard shipping",
        "Early access to sales",
        "Member-only promotions",
      ],
      isPopular: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: 9900, // $99.00
      interval: "year",
      description: "Enhanced benefits for regular customers",
      features: [
        "15% discount on all purchases",
        "Free express shipping",
        "Early access to new products",
        "Exclusive member events",
        "Priority customer support",
        "Birthday gift",
      ],
      isPopular: true,
    },
    {
      id: "vip",
      name: "VIP",
      price: 19900, // $199.00
      interval: "year",
      description: "Ultimate benefits for our biggest fans",
      features: [
        "20% discount on all purchases",
        "Free overnight shipping",
        "First access to limited editions",
        "Personal shopping assistant",
        "Exclusive VIP events",
        "Complimentary gift wrapping",
        "Annual gift box",
      ],
      isPopular: false,
    },
  ]

  return (
    <div className="container max-w-screen-xl py-8">
      <PageHeading
        title="Membership"
        description="Manage your membership plan and benefits"
      />
      
      <div className="mt-8 space-y-8">
        {/* Current Membership Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Membership</CardTitle>
            <CardDescription>
              Your current membership status and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold capitalize">{membership.plan} Plan</h3>
                  <Badge variant={membership.status === "active" ? "default" : "outline"}>
                    {membership.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Next billing date: {membership.nextBillingDate}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="destructive">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={plan.isPopular ? "border-primary" : ""}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="mr-2 h-4 w-4 text-green-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.id === membership.plan ? "outline" : "default"}
                    disabled={plan.id === membership.plan}
                  >
                    {plan.id === membership.plan ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}






