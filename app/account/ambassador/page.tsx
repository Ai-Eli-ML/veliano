import type { Metadata } from "next"
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

export const metadata = export const metadata: Metadata = {
  title: "Ambassador Dashboard",
  description: "Manage your ambassador account and track your earnings",
}

"use client"

