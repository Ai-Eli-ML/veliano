
import { createClient } from "@/lib/supabase/client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ErrorLog {
  id: string
  error_message: string
  error_stack: string
  user_id: string | null
  path: string
  created_at: string
  browser: string
  os: string
}

interface PerformanceMetric {
  id: string
  page: string
  load_time: number
  ttfb: number
  fcp: number
  lcp: number
  cls: number
  fid: number
  created_at: string
}

export default function MonitoringPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h")
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [timeRange])

  async function fetchData() {
    try {
      // Calculate date range
      const now = new Date()
      const range = {
        "24h": new Date(now.getTime() - 24 * 60 * 60 * 1000),
        "7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        "30d": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      }[timeRange]

      // Fetch error logs
      const { data: errorLogs, error: errorLogsError } = await supabase
        .from("error_logs")
        .select("*")
        .gte("created_at", range.toISOString())
        .order("created_at", { ascending: false })

      if (errorLogsError) throw errorLogsError
      setErrors(errorLogs || [])

      // Fetch performance metrics
      const { data: perfMetrics, error: metricsError } = await supabase
        .from("performance_metrics")
        .select("*")
        .gte("created_at", range.toISOString())
        .order("created_at", { ascending: true })

      if (metricsError) throw metricsError
      setMetrics(perfMetrics || [])
    } catch (error) {
      console.error("Error fetching monitoring data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Process metrics for charts
  const performanceData = metrics.map(metric => ({
    timestamp: new Date(metric.created_at).toLocaleString(),
    "Load Time": metric.load_time,
    "Time to First Byte": metric.ttfb,
    "First Contentful Paint": metric.fcp,
    "Largest Contentful Paint": metric.lcp,
  }))

  const errorsByPage = errors.reduce((acc: Record<string, number>, error) => {
    acc[error.path] = (acc[error.path] || 0) + 1
    return acc
  }, {})

  const errorData = Object.entries(errorsByPage).map(([path, count]) => ({
    path,
    count,
  }))

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
        <Select
          value={timeRange}
          onValueChange={(value: "24h" | "7d" | "30d") => setTimeRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Load Time"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Time to First Byte"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="First Contentful Paint"
                    stroke="#ffc658"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Largest Contentful Paint"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Errors by Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="path" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errors.slice(0, 5).map((error) => (
                <div
                  key={error.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{error.error_message}</span>
                    <span className="text-muted-foreground">
                      {new Date(error.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Path: {error.path}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Browser: {error.browser} | OS: {error.os}
                  </div>
                  {error.user_id && (
                    <div className="text-sm text-muted-foreground">
                      User ID: {error.user_id}
                    </div>
                  )}
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                    {error.error_stack}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
