import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getUserMembership } from "@/actions/membership"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency, formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Award, Check } from "lucide-react"

export const metadata = export const metadata: Metadata = {
  title: "Membership Status",
  description: "View your membership tier and benefits",
}

"use client"

