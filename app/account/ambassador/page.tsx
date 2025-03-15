import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getAmbassadorProfile, getAmbassadorStats } from "@/actions/ambassador"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { AmbassadorApplicationForm } from "@/components/ambassador/ambassador-application-form"
import { AmbassadorProfileForm } from "@/components/ambassador/ambassador-profile-form"
import { AmbassadorSales } from "@/components/ambassador/ambassador-sales"
import { AmbassadorContent } from "@/components/ambassador/ambassador-content"
import Link from "next/link"
import { ArrowLeft, Award } from "lucide-react"

export const metadata = {
  title: "Ambassador Dashboard",
  description: "Manage your ambassador account and track your earnings",
}

export default async function AmbassadorPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/account/login?redirect=/account/ambassador")
  }

  // Get ambassador profile
  const { data: ambassador } = await getAmbassadorProfile()

  // Get ambassador stats if profile exists
  const { data: stats } = ambassador ? await getAmbassadorStats() : { data: null }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ambassador Dashboard</h1>
        <Button asChild variant="outline">
          <Link href="/account">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Link>
        </Button>
      </div>

      {ambassador ? (
        <>
          {/* Ambassador Status Banner */}
          <Card
            className={`mb-6 ${
              ambassador.status === "active"
                ? "bg-green-50 dark:bg-green-900/20"
                : ambassador.status === "pending"
                  ? "bg-yellow-50 dark:bg-yellow-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium">
                    Ambassador Status: <span className="capitalize">{ambassador.status}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {ambassador.status === "active"
                      ? "Your ambassador account is active. Keep up the great work!"
                      : ambassador.status === "pending"
                        ? "Your application is pending review. We'll notify you once it's approved."
                        : "Your ambassador account is currently inactive."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-background p-2 text-center">
                    <p className="text-sm font-medium">Your Discount Code</p>
                    <p className="text-lg font-bold">
                      {(ambassador as any).discount_code || 
                       (ambassador as any).discountCode || 
                       "N/A"}
                    </p>
                  </div>

                  <div className="rounded-md bg-background p-2 text-center">
                    <p className="text-sm font-medium">Commission Rate</p>
                    <p className="text-lg font-bold">{ambassador.commission_rate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ambassador Dashboard Tabs */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales & Earnings</TabsTrigger>
              <TabsTrigger value="content">Content Resources</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {stats && (
                <>
                  <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.monthlySales)}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.monthlyEarnings)}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ambassador Tier</CardTitle>
                      <CardDescription>Your current tier and progress to the next level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                          <Award className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{stats.currentTier.name} Tier</h3>
                          <p className="text-sm text-muted-foreground">
                            {stats.currentTier.commission_rate}% commission rate
                          </p>
                        </div>
                      </div>

                      {stats.nextTier && (
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm">Progress to {stats.nextTier?.name || "Max"} Tier</span>
                            <span className="text-sm">
                              ${stats.totalSales.toFixed(2)} / ${stats.nextTier?.minimum_sales.toFixed(2) || "N/A"}
                            </span>
                          </div>
                          <Progress value={stats.progressToNextTier} className="h-2" />
                          <p className="mt-2 text-xs text-muted-foreground">
                            ${formatCurrency(stats.totalSales)} of ${formatCurrency(stats.nextTier.minimum_sales)}{" "}
                            needed to reach the next tier
                          </p>
                        </div>
                      )}

                      <div className="mt-6">
                        <h4 className="font-medium">Current Tier Benefits:</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          {stats.currentTier.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="sales">
              <AmbassadorSales ambassador={ambassador} />
            </TabsContent>

            <TabsContent value="content">
              <AmbassadorContent />
            </TabsContent>

            <TabsContent value="profile">
              <AmbassadorProfileForm ambassador={ambassador} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Join Our Ambassador Program</CardTitle>
            <CardDescription>Represent our brand and earn commissions on sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Why Become an Ambassador?</h3>
                <ul>
                  <li>Earn up to 25% commission on sales generated with your discount code</li>
                  <li>Receive free products based on your performance</li>
                  <li>Get featured on our social media and website</li>
                  <li>Join our exclusive ambassador community</li>
                </ul>

                <h3>Requirements</h3>
                <ul>
                  <li>Active social media presence</li>
                  <li>Passion for our products and brand</li>
                  <li>Ability to create high-quality content</li>
                  <li>Commitment to promoting our products regularly</li>
                </ul>
              </div>

              <AmbassadorApplicationForm />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

