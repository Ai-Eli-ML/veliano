"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils"
import { Package, CreditCard, Heart, LogOut, User, Settings, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

// Interface for profile that matches Supabase structure
interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  phone: string | null
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  } | null
  created_at: string
}

// Interface for orders summary that matches Supabase structure
interface OrdersSummary {
  total: number
  recent: Array<{
    id: string
    created_at: string
    status: string
    total: number
  }>
}

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [ordersSummary, setOrdersSummary] = useState<OrdersSummary | null>(null)
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchProfile = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   const { data: { session } } = await supabase.auth.getSession()
    //   
    //   if (!session) {
    //     return null
    //   }
    //   
    //   const { data, error } = await supabase
    //     .from("profiles")
    //     .select("*")
    //     .eq("id", session.user.id)
    //     .single()
    //   
    //   if (error) throw error
    //   return data
    // }
    
    // Simulate API call for profile
    const fetchProfile = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Mock profile data structured like our database model
      return {
        id: "user123",
        email: "john.doe@example.com",
        full_name: "John Doe",
        avatar_url: null,
        phone: "+1 (555) 123-4567",
        address: {
          street: "123 Main St",
          city: "Boston",
          state: "MA",
          zipCode: "02108",
          country: "USA"
        },
        created_at: "2024-08-15T10:30:00Z"
      } as Profile
    }
    
    // Simulate API call for orders summary
    const fetchOrdersSummary = async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Mock orders summary
      return {
        total: 5,
        recent: [
          {
            id: "ORD12345",
            created_at: "2025-03-10T14:30:00Z",
            status: "delivered",
            total: 12890
          },
          {
            id: "ORD12346",
            created_at: "2025-02-25T10:15:00Z",
            status: "shipped",
            total: 8495
          },
          {
            id: "ORD12347",
            created_at: "2025-02-15T09:45:00Z",
            status: "processing",
            total: 15990
          }
        ]
      } as OrdersSummary
    }
    
    // Simulate checking if user is logged in
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return true // Mock authenticated state
    }
    
    checkAuth().then(isAuthenticated => {
      if (!isAuthenticated) {
        redirect("/account/login")
      }
      
      return Promise.all([fetchProfile(), fetchOrdersSummary()])
    }).then(([profileData, ordersData]) => {
      setProfile(profileData)
      setOrdersSummary(ordersData)
      setIsLoading(false)
    }).catch(error => {
      console.error("Error fetching account data:", error)
      setIsLoading(false)
    })
  }, [])
  
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-8">
        <PageHeading title="My Account" description="Manage your account settings and preferences" />
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-pulse">Loading your account information...</div>
        </div>
      </div>
    )
  }
  
  if (!profile) {
    return null // Should redirect via redirect() in useEffect
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeading title="My Account" description="Manage your account settings and preferences" />
        <Button variant="outline" className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name} />
                <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
                </Avatar>
              <div>
                <CardTitle>{profile.full_name}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Account Navigation</h3>
                  <nav className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start gap-2" asChild>
                      <Link href="/account">
                        <User className="h-4 w-4" />
                        Account Overview
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2" asChild>
                      <Link href="/account/orders">
                        <Package className="h-4 w-4" />
                        Orders
                        {ordersSummary && <Badge className="ml-2">{ordersSummary.total}</Badge>}
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2" asChild>
                      <Link href="/account/wishlist">
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2" asChild>
                      <Link href="/account/payment-methods">
                        <CreditCard className="h-4 w-4" />
                        Payment Methods
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2" asChild>
                      <Link href="/account/settings">
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </Link>
                    </Button>
                  </nav>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" /> 
                      Recent Orders
                    </CardTitle>
                    <CardDescription>Your most recent purchases</CardDescription>
                </CardHeader>
                <CardContent>
                    {ordersSummary && ordersSummary.recent.length > 0 ? (
                    <div className="space-y-4">
                        {ordersSummary.recent.map((order) => (
                          <div key={order.id} className="flex items-center justify-between">
                          <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                            <Button variant="ghost" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                      <p className="text-center text-gray-500">No recent orders</p>
                  )}

                  <div className="mt-4 text-center">
                      <Button variant="outline" size="sm" asChild>
                      <Link href="/account/orders">View All Orders</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Shopping
                    </CardTitle>
                    <CardDescription>Quick links to shop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/products">All Products</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/products/new">New Arrivals</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/products/featured">Featured</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/products/sale">On Sale</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" defaultValue={profile.full_name} />
                            </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={profile.email} disabled />
                            </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue={profile.phone || ""} />
                        </div>
                    </div>
                    
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Addresses</CardTitle>
                  <CardDescription>Manage your shipping addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.address ? (
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Default Address</h3>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm">Delete</Button>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>{profile.full_name}</p>
                          <p>{profile.address.street}</p>
                          <p>{profile.address.city}, {profile.address.state} {profile.address.zipCode}</p>
                          <p>{profile.address.country}</p>
                          {profile.phone && <p>{profile.phone}</p>}
                        </div>
                      </div>
                      
                      <Button>Add New Address</Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="mb-4 text-gray-500">You haven't added any addresses yet.</p>
                      <Button>Add New Address</Button>
                  </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
