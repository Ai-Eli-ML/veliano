import type { Metadata } from "next"
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

export const metadata = export const metadata: Metadata = {
  title: "Affiliate Dashboard",
  description: "Manage your affiliate account and track your earnings",
}

"use client"

