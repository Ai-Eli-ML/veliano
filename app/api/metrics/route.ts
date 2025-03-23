import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { metric, value, page, timestamp } = await request.json()

    // Find the existing record for this page and timestamp
    const { data: existingMetric } = await supabase
      .from("performance_metrics")
      .select("id")
      .eq("page", page)
      .gte("created_at", new Date(timestamp).toISOString())
      .lte(
        "created_at",
        new Date(new Date(timestamp).getTime() + 1000).toISOString()
      )
      .single()

    if (existingMetric) {
      // Update the existing record with the new metric
      const { error } = await supabase
        .from("performance_metrics")
        .update({ [metric]: value })
        .eq("id", existingMetric.id)

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating performance metrics:", error)
    return NextResponse.json(
      { error: "Failed to update performance metrics" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: metrics, error } = await supabase
      .from('metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ metrics })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 