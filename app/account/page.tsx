
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getAuthUser } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInitials } from "@/lib/utils"
import Link from "next/link"
import { UserCircle, Package, CreditCard, Settings, LogOut, Heart } from "lucide-react"

export default async function AccountPage() {
  const { user, profile } = await getAuthUser()
  const supabase = createServerSupabaseClient()

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">My Account</h1>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                  <AvatarFallback>{getInitials(profile?.full_name || "User")}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{profile?.full_name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <Link
                  href="/account"
                  className="flex items-center gap-2 border-l-2 border-primary bg-muted p-3 font-medium"
                >
                  <UserCircle className="h-5 w-5" /> Dashboard
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-2 border-l-2 border-transparent p-3 font-medium hover:bg-muted/50"
                >
                  <Package className="h-5 w-5" /> Orders
                </Link>
                <Link
                  href="/account/wishlist"
                  className="flex items-center gap-2 border-l-2 border-transparent p-3 font-medium hover:bg-muted/50"
                >
                  <Heart className="h-5 w-5" /> Wishlist
                </Link>
                <Link
                  href="/account/payment-methods"
                  className="flex items-center gap-2 border-l-2 border-transparent p-3 font-medium hover:bg-muted/50"
                >
                  <CreditCard className="h-5 w-5" /> Payment Methods
                </Link>
                <Link
                  href="/account/settings"
                  className="flex items-center gap-2 border-l-2 border-transparent p-3 font-medium hover:bg-muted/50"
                >
                  <Settings className="h-5 w-5" /> Settings
                </Link>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 border-l-2 border-transparent p-3 font-medium text-red-500 hover:bg-muted/50"
                  >
                    <LogOut className="h-5 w-5" /> Sign Out
                  </button>
                </form>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                  <CardDescription>View and manage your account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-medium">Contact Information</h3>
                      <div className="space-y-1">
                        <p>{profile?.full_name || "Not provided"}</p>
                        <p>{user.email}</p>
                        <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                          <Link href="/account/settings">Edit</Link>
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 font-medium">Default Shipping Address</h3>
                      {profile?.shipping_address ? (
                        <address className="not-italic">
                          {/* Display formatted address here */}
                          123 Main St
                          <br />
                          Apt 4B
                          <br />
                          New York, NY 10001
                          <br />
                          United States
                        </address>
                      ) : (
                        <p>No default shipping address</p>
                      )}
                      <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                        <Link href="/account/addresses">Edit</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Track and manage your recent purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">Order #{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">${order.total_price.toFixed(2)}</p>
                            <p className="text-sm capitalize text-muted-foreground">{order.status}</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>You haven&apos;t placed any orders yet.</p>
                  )}

                  <div className="mt-4 text-center">
                    <Button asChild>
                      <Link href="/account/orders">View All Orders</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>View and track your recent purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="rounded-lg border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="font-medium">Order #{order.order_number}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium">${order.total_price.toFixed(2)}</p>
                              <p className="text-sm capitalize text-muted-foreground">{order.status}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/account/orders/${order.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>You haven&apos;t placed any orders yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Your Addresses</CardTitle>
                  <CardDescription>Manage your shipping and billing addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-medium">Default Shipping Address</h3>
                      {profile?.shipping_address ? (
                        <>
                          <address className="mb-4 not-italic">
                            {/* Display formatted address here */}
                            123 Main St
                            <br />
                            Apt 4B
                            <br />
                            New York, NY 10001
                            <br />
                            United States
                          </address>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Delete
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="mb-4">No default shipping address set.</p>
                          <Button variant="outline" size="sm">
                            Add Address
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-medium">Default Billing Address</h3>
                      {profile?.billing_address ? (
                        <>
                          <address className="mb-4 not-italic">
                            {/* Display formatted address here */}
                            123 Main St
                            <br />
                            Apt 4B
                            <br />
                            New York, NY 10001
                            <br />
                            United States
                          </address>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Delete
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="mb-4">No default billing address set.</p>
                          <Button variant="outline" size="sm">
                            Add Address
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

