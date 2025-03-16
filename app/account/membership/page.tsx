export const metadata = export const metadata = {
  title: "Membership Status",
  description: "View your membership tier and benefits",
}

"use client"


import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getUserMembership } from "@/actions/membership"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Award, Check } from "lucide-react"

  title: "Membership Status",
  description: "View your membership tier and benefits",
}

export default async function MembershipPage() {
  const supabase = createServerSupabaseClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/account/login?redirect=/account/membership")
  }

  // Get user membership
  const { data: membership, error } = await getUserMembership()

  if (error) {
    return (
      <div className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Membership Status</h1>
          <Button asChild variant="outline">
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!membership) {
    return (
      <div className="container py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Membership Status</h1>
          <Button asChild variant="outline">
            <Link href="/account">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="py-10 text-center">
            <p>No membership found. Please contact support if you believe this is an error.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Membership Status</h1>
        <Button asChild variant="outline">
          <Link href="/account">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Account
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Membership</CardTitle>
              <CardDescription>Your current tier and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{membership.tier.name} Member</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since{" "}
                    {formatDate(membership.joinedAt, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {membership.nextTier && (
                <>
                  <div className="mt-6">
                    <p className="mb-2 text-sm text-muted-foreground">
                      Spend ${formatCurrency(membership.nextTier.minimum_spend - membership.currentSpend)} more to reach{" "}
                      {membership.nextTier.name}
                    </p>
                    <Progress value={(membership.currentSpend / membership.nextTier.minimum_spend) * 100} />
                  </div>
                </>
              )}

              <div className="mt-6">
                <h4 className="mb-4 text-sm font-medium">Current Benefits</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {membership.tier.discount_percentage}% off all orders
                  </li>
                  {membership.tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Spend ${formatCurrency(membership.tier.minimum_spend)} in a calendar year to maintain your status
                </p>
              </div>

              {/* Stats Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                  <CardDescription>Track your spending and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium">Total Spend:</dt>
                      <dd>{formatCurrency(membership.currentSpend)}</dd>
                    </div>
                    {membership.nextTier && (
                      <div className="flex justify-between">
                        <dt className="font-medium">Spend Required:</dt>
                        <dd>{formatCurrency(membership.nextTier.minimum_spend - membership.currentSpend)}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership Tiers</CardTitle>
              <CardDescription>All available membership tiers and their benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 text-left font-medium">Tier</th>
                      <th className="py-4 text-left font-medium">Minimum Spend</th>
                      <th className="py-4 text-left font-medium">Discount</th>
                      <th className="py-4 text-left font-medium">Free Shipping</th>
                      <th className="py-4 text-left font-medium">Early Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Bronze",
                        minimumSpend: 0,
                        discount: "5%",
                        freeShipping: false,
                        earlyAccess: false,
                      },
                      {
                        name: "Silver",
                        minimumSpend: 500,
                        discount: "10%",
                        freeShipping: true,
                        earlyAccess: false,
                      },
                      {
                        name: "Gold",
                        minimumSpend: 1000,
                        discount: "15%",
                        freeShipping: true,
                        earlyAccess: true,
                      },
                      {
                        name: "Diamond",
                        minimumSpend: 2500,
                        discount: "20%",
                        freeShipping: true,
                        earlyAccess: true,
                      },
                    ].map((tier) => (
                      <tr
                        key={tier.name}
                        className={`border-b ${membership.tier.name === tier.name ? "bg-muted" : ""}`}
                      >
                        <td className="py-4 font-medium">
                          {tier.name}
                          {membership.tier.name === tier.name && (
                            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-4">{formatCurrency(tier.minimumSpend)}</td>
                        <td className="py-4">{tier.discount}</td>
                        <td className="py-4">
                          {tier.freeShipping ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-4">
                          {tier.earlyAccess ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">Current Tier:</dt>
                  <dd>{membership.tier.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Total Spend:</dt>
                  <dd>{formatCurrency(membership.currentSpend)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Discount Rate:</dt>
                  <dd>{membership.tier.discount_percentage}%</dd>
                </div>
                {membership.nextTier && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Next Tier:</dt>
                    <dd>{membership.nextTier.name}</dd>
                  </div>
                )}
                {membership.nextTier && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Spend Required:</dt>
                    <dd>{formatCurrency(membership.nextTier.minimum_spend - membership.currentSpend)}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* This would be populated with actual order data */}
              <p className="text-center text-sm text-muted-foreground">
                View your complete order history in the{" "}
                <Link href="/account/orders" className="text-primary underline">
                  Orders
                </Link>{" "}
                section.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have any questions about your membership or benefits, please contact our customer support team.
              </p>
              <Button asChild className="mt-4 w-full">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

