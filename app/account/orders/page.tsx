import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata = export const metadata: Metadata = {
  title: "Order History",
  description: "View your order history and track your purchases",
}

"use client"

