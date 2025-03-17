"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeading } from "@/components/ui/page-heading"
import { formatPrice, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Edit, 
  ExternalLink, 
  Mail, 
  Phone, 
  User, 
  XCircle 
} from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Types that match Supabase structure
interface Affiliate {
  id: string
  user_id: string
  name: string
  email: string
  phone?: string
  status: "pending" | "approved" | "rejected"
  commission_rate: number
  total_earnings: number
  total_sales: number
  created_at: string
  website?: string
  bio?: string
  payment_method?: string
  payment_details?: string
  profile_image?: string
}

interface AffiliateTransaction {
  id: string
  affiliate_id: string
  order_id: string
  amount: number
  commission_amount: number
  status: "pending" | "paid" | "cancelled"
  created_at: string
  paid_at?: string
  customer_name: string
}

export default function AffiliateDetailsPage() {
  const params = useParams()
  const affiliateId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [transactions, setTransactions] = useState<AffiliateTransaction[]>([])

  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchAffiliateData = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   
    //   // Get affiliate details
    //   const { data: affiliateData, error: affiliateError } = await supabase
    //     .from("affiliates")
    //     .select("*")
    //     .eq("id", affiliateId)
    //     .single()
    //   
    //   if (affiliateError) throw affiliateError
    //   if (!affiliateData) return null
    //   
    //   // Get affiliate transactions
    //   const { data: transactionsData, error: transactionsError } = await supabase
    //     .from("affiliate_transactions")
    //     .select("*")
    //     .eq("affiliate_id", affiliateId)
    //     .order("created_at", { ascending: false })
    //   
    //   if (transactionsError) throw transactionsError
    //   
    //   return {
    //     affiliate: affiliateData,
    //     transactions: transactionsData || []
    //   }
    // }
    
    // Simulate API call
    const fetchAffiliateData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock affiliate data
      const mockAffiliate: Affiliate = {
        id: affiliateId,
        user_id: "user123",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "+1 (555) 123-4567",
        status: "approved",
        commission_rate: 10,
        total_earnings: 2450,
        total_sales: 24500,
        created_at: "2025-01-15T10:30:00Z",
        website: "https://sarahjohnson.com",
        bio: "Luxury jewelry influencer with 10+ years of experience in the industry.",
        payment_method: "bank_transfer",
        payment_details: "Bank of America - Account ending in 4321",
        profile_image: "/images/avatars/sarah.jpg"
      }
      
      // Mock transactions
      const mockTransactions: AffiliateTransaction[] = [
        {
          id: "trans1",
          affiliate_id: affiliateId,
          order_id: "order123",
          amount: 5000,
          commission_amount: 500,
          status: "paid",
          created_at: "2025-03-10T14:30:00Z",
          paid_at: "2025-03-15T09:00:00Z",
          customer_name: "Emma Wilson"
        },
        {
          id: "trans2",
          affiliate_id: affiliateId,
          order_id: "order456",
          amount: 7500,
          commission_amount: 750,
          status: "paid",
          created_at: "2025-03-05T11:15:00Z",
          paid_at: "2025-03-15T09:00:00Z",
          customer_name: "Michael Brown"
        },
        {
          id: "trans3",
          affiliate_id: affiliateId,
          order_id: "order789",
          amount: 12000,
          commission_amount: 1200,
          status: "pending",
          created_at: "2025-03-01T16:45:00Z",
          customer_name: "David Clark"
        }
      ]
      
      return {
        affiliate: mockAffiliate,
        transactions: mockTransactions
      }
    }
    
    fetchAffiliateData()
      .then(data => {
        if (!data || !data.affiliate) {
          notFound()
        }
        setAffiliate(data.affiliate)
        setTransactions(data.transactions)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching affiliate data:", error)
        setIsLoading(false)
      })
  }, [affiliateId])
  
  // Define columns for transactions table
  const columns: ColumnDef<AffiliateTransaction>[] = [
    {
      accessorKey: "order_id",
      header: "Order ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.order_id}</div>
      )
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => row.original.customer_name
    },
    {
      accessorKey: "amount",
      header: "Sale Amount",
      cell: ({ row }) => formatPrice(row.original.amount)
    },
    {
      accessorKey: "commission_amount",
      header: "Commission",
      cell: ({ row }) => formatPrice(row.original.commission_amount)
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={
              status === "paid" ? "success" :
              status === "pending" ? "outline" : "destructive"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      }
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.created_at)
    }
  ]
  
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="mt-8 grid gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!affiliate) {
    return notFound()
  }
  
  return (
    <div className="container max-w-screen-xl py-8">
      <div className="flex items-center justify-between">
        <PageHeading 
          title={`Affiliate: ${affiliate.name}`} 
          description={`Manage affiliate account and view performance`} 
        />
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Contact
          </Button>
          <Button size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
        </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Affiliate Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Affiliate account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                {affiliate.profile_image ? (
                  <AvatarImage src={affiliate.profile_image} alt={affiliate.name} />
                ) : null}
                <AvatarFallback>{affiliate.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="text-xl font-bold">{affiliate.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Joined {formatDate(affiliate.created_at)}
                </p>
              </div>
              
              <Badge
                variant={
                  affiliate.status === "approved" ? "success" :
                  affiliate.status === "pending" ? "outline" : "destructive"
                }
                className="px-3 py-1"
              >
                {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{affiliate.email}</span>
              </div>
              
              {affiliate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{affiliate.phone}</span>
            </div>
              )}
              
              {affiliate.website && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={affiliate.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {affiliate.website.replace(/^https?:\/\//, '')}
                  </a>
            </div>
              )}
            </div>
            
            {affiliate.bio && (
              <div>
                <h4 className="mb-1 font-medium">Bio</h4>
                <p className="text-sm text-muted-foreground">{affiliate.bio}</p>
            </div>
            )}
            
            <div>
              <h4 className="mb-1 font-medium">Payment Information</h4>
              <p className="text-sm text-muted-foreground">
                {affiliate.payment_method ? (
                  <>
                    <span className="capitalize">{affiliate.payment_method.replace('_', ' ')}</span>
                    {affiliate.payment_details && (
                      <>: {affiliate.payment_details}</>
                    )}
                  </>
                ) : (
                  "No payment method set"
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Affiliate sales and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Sales</span>
                </div>
                <p className="mt-2 text-2xl font-bold">{formatPrice(affiliate.total_sales)}</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Earnings</span>
            </div>
                <p className="mt-2 text-2xl font-bold">{formatPrice(affiliate.total_earnings)}</p>
            </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Commission Rate</span>
            </div>
                <p className="mt-2 text-2xl font-bold">{affiliate.commission_rate}%</p>
            </div>
            </div>
            
            <Alert className="mt-6">
              <AlertTitle className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Active Affiliate
              </AlertTitle>
              <AlertDescription>
                This affiliate is approved and actively generating sales. Their referral link is active.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions Tab */}
      <div className="mt-8">
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="mt-4">
            <Card>
          <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  All sales generated by this affiliate
                </CardDescription>
          </CardHeader>
          <CardContent>
                {transactions.length > 0 ? (
                  <DataTable columns={columns} data={transactions} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground/60" />
                    <h3 className="mt-4 text-lg font-medium">No transactions yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This affiliate hasn't generated any sales yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payouts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>
                  Commission payments to this affiliate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">Payouts Coming Soon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This feature is under development and will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Settings</CardTitle>
                <CardDescription>
                  Manage affiliate account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Edit className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">Settings Coming Soon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Advanced settings management will be available soon.
                  </p>
                </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 
