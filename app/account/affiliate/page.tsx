export const metadata = export const metadata = {
  title: "Affiliate Dashboard",
  description: "Manage your affiliate account and track your earnings",
}

"use client"


import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getAffiliateProfile, getAffiliateStats } from "@/actions/affiliate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { AffiliateApplicationForm } from "@/components/affiliate/affiliate-application-form"
import { AffiliateStats } from "@/components/affiliate/affiliate-stats"
import { AffiliateTransactions } from "@/components/affiliate/affiliate-transactions"
import { AffiliateLinks } from "@/components/affiliate/affiliate-links"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

  title: "Affiliate Dashboard",
  description: "Manage your affiliate account and track your earnings",
}

export default async function AffiliatePage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/account/login?redirect=/account/affiliate")
  }

  // Get affiliate profile
  const { data: affiliate } = await getAffiliateProfile()

  // Get affiliate stats if profile exists
  const { data: stats } = affiliate ? await getAffiliateStats() : { data: null }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
        <Button asChild variant="outline">
          <Link href="/account">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Link>
        </Button>
      </div>

      {affiliate ? (
        <>
          {/* Affiliate Status Banner */}
          <Card
            className={`mb-6 ${
              affiliate.status === "active"
                ? "bg-green-50 dark:bg-green-900/20"
                : affiliate.status === "pending"
                  ? "bg-yellow-50 dark:bg-yellow-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-medium">
                    Affiliate Status: <span className="capitalize">{affiliate.status}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {affiliate.status === "active"
                      ? "Your affiliate account is active and earning commissions."
                      : affiliate.status === "pending"
                        ? "Your application is pending review. We'll notify you once it's approved."
                        : "Your affiliate account is currently inactive."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-background p-2 text-center">
                    <p className="text-sm font-medium">Your Affiliate Code</p>
                    <p className="text-lg font-bold">{affiliate.code}</p>
                  </div>

                  <div className="rounded-md bg-background p-2 text-center">
                    <p className="text-sm font-medium">Commission Rate</p>
                    <p className="text-lg font-bold">{affiliate.commission_rate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affiliate Dashboard Tabs */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="links">Affiliate Links</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {stats && <AffiliateStats stats={stats} />}
            </TabsContent>

            <TabsContent value="links">
              <AffiliateLinks affiliateCode={affiliate.code} />
            </TabsContent>

            <TabsContent value="transactions">
              <AffiliateTransactions affiliateId={affiliate.id} />
            </TabsContent>

            <TabsContent value="payouts">
              <Card>
                <CardHeader>
                  <CardTitle>Payout Information</CardTitle>
                  <CardDescription>View and manage your payout settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-medium">Current Balance</h3>
                      <div className="flex items-center gap-4">
                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm font-medium">Available for Payout</p>
                          <p className="text-2xl font-bold">{formatCurrency(stats?.pendingEarnings || 0)}</p>
                        </div>

                        <div className="rounded-md bg-muted p-3">
                          <p className="text-sm font-medium">Total Paid</p>
                          <p className="text-2xl font-bold">{formatCurrency(stats?.paidEarnings || 0)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 font-medium">Payout Method</h3>
                      <div className="rounded-md border p-4">
                        <p className="capitalize font-medium">
                          {affiliate.payment_method && 
                           typeof affiliate.payment_method === 'object' && 
                           affiliate.payment_method !== null &&
                           'type' in affiliate.payment_method &&
                           typeof affiliate.payment_method.type === 'string'
                            ? affiliate.payment_method.type 
                            : "Not set"}
                        </p>
                        {affiliate.payment_method && 
                          typeof affiliate.payment_method === 'object' && 
                          affiliate.payment_method !== null &&
                          'details' in affiliate.payment_method && 
                          affiliate.payment_method.details && 
                          typeof affiliate.payment_method.details === 'object' && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            {Object.entries(affiliate.payment_method.details as Record<string, string | number | boolean>).map(([key, value]) => (
                              <p key={key}>
                                <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span> {String(value)}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button className="mt-4" variant="outline">
                        Update Payout Method
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Join Our Affiliate Program</CardTitle>
            <CardDescription>Earn commissions by referring customers to our store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Why Join Our Affiliate Program?</h3>
                <ul>
                  <li>Earn 10% commission on all sales you refer</li>
                  <li>30-day cookie duration</li>
                  <li>Monthly payouts via PayPal or bank transfer</li>
                  <li>Access to marketing materials and support</li>
                </ul>

                <h3>How It Works</h3>
                <ol>
                  <li>Apply for the affiliate program</li>
                  <li>Once approved, get your unique affiliate link</li>
                  <li>Share your link with your audience</li>
                  <li>Earn commissions on qualifying purchases</li>
                </ol>
              </div>

              <AffiliateApplicationForm />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

