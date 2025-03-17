"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Download, 
  HardDrive, 
  RefreshCw, 
  Server, 
  ShieldAlert, 
  Wifi 
} from "lucide-react"

// Types for system monitoring
interface SystemStatus {
  service: string
  status: "operational" | "degraded" | "outage"
  last_checked: string
  uptime: number
  response_time: number
}

interface SystemEvent {
  id: string
  timestamp: string
  service: string
  type: "info" | "warning" | "error"
  message: string
  resolved: boolean
  resolved_at?: string
}

interface SystemMetric {
  id: string
  timestamp: string
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  network_in: number
  network_out: number
}

export default function MonitoringPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([])
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
  const [activeTab, setActiveTab] = useState("status")
  
  useEffect(() => {
    // Simulate API call
    const fetchMonitoringData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock system statuses
      const mockSystemStatuses: SystemStatus[] = [
        {
          service: "Web Server",
          status: "operational",
          last_checked: new Date().toISOString(),
          uptime: 99.98,
          response_time: 120
        },
        {
          service: "Database",
          status: "operational",
          last_checked: new Date().toISOString(),
          uptime: 99.95,
          response_time: 85
        },
        {
          service: "Authentication",
          status: "operational",
          last_checked: new Date().toISOString(),
          uptime: 99.99,
          response_time: 95
        },
        {
          service: "Payment Processing",
          status: "degraded",
          last_checked: new Date().toISOString(),
          uptime: 98.75,
          response_time: 350
        },
        {
          service: "Storage",
          status: "operational",
          last_checked: new Date().toISOString(),
          uptime: 99.90,
          response_time: 110
        }
      ]
      
      // Mock system events
      const mockSystemEvents: SystemEvent[] = [
        {
          id: "event1",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          service: "Payment Processing",
          type: "warning",
          message: "Increased latency detected in payment gateway responses",
          resolved: false
        },
        {
          id: "event2",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          service: "Database",
          type: "info",
          message: "Scheduled maintenance completed successfully",
          resolved: true,
          resolved_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "event3",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          service: "Web Server",
          type: "error",
          message: "Temporary outage due to network connectivity issues",
          resolved: true,
          resolved_at: new Date(Date.now() - 7.5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "event4",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          service: "Authentication",
          type: "warning",
          message: "Unusual login activity detected",
          resolved: true,
          resolved_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "event5",
          timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
          service: "Storage",
          type: "info",
          message: "Storage capacity increased by 500GB",
          resolved: true,
          resolved_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      // Mock system metrics (last 24 hours, hourly)
      const mockSystemMetrics: SystemMetric[] = Array.from({ length: 24 }).map((_, index) => ({
        id: `metric${index}`,
        timestamp: new Date(Date.now() - (23 - index) * 60 * 60 * 1000).toISOString(),
        cpu_usage: 20 + Math.random() * 40, // 20-60%
        memory_usage: 30 + Math.random() * 30, // 30-60%
        disk_usage: 45 + Math.random() * 10, // 45-55%
        network_in: Math.floor(50 + Math.random() * 150), // 50-200 MB/s
        network_out: Math.floor(30 + Math.random() * 100) // 30-130 MB/s
      }))
      
      return {
        systemStatuses: mockSystemStatuses,
        systemEvents: mockSystemEvents,
        systemMetrics: mockSystemMetrics
      }
    }
    
    fetchMonitoringData()
      .then(data => {
        setSystemStatuses(data.systemStatuses)
        setSystemEvents(data.systemEvents)
        setSystemMetrics(data.systemMetrics)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching monitoring data:", error)
        setIsLoading(false)
      })
  }, [])
  
  // Define columns for events table
  const eventsColumns: ColumnDef<SystemEvent>[] = [
    {
      accessorKey: "timestamp",
      header: "Time",
      cell: ({ row }) => formatDate(row.original.timestamp, true)
    },
    {
      accessorKey: "service",
      header: "Service",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.service}</div>
      )
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <Badge
            variant={
              type === "info" ? "outline" :
              type === "warning" ? "secondary" : "destructive"
            }
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        )
      }
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => row.original.message
    },
    {
      accessorKey: "resolved",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.resolved ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              <span>Resolved</span>
            </>
          ) : (
            <>
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
              <span>Active</span>
            </>
          )}
        </div>
      )
    }
  ]
  
  // Define columns for metrics table
  const metricsColumns: ColumnDef<SystemMetric>[] = [
    {
      accessorKey: "timestamp",
      header: "Time",
      cell: ({ row }) => formatDate(row.original.timestamp, true)
    },
    {
      accessorKey: "cpu_usage",
      header: "CPU",
      cell: ({ row }) => `${row.original.cpu_usage.toFixed(1)}%`
    },
    {
      accessorKey: "memory_usage",
      header: "Memory",
      cell: ({ row }) => `${row.original.memory_usage.toFixed(1)}%`
    },
    {
      accessorKey: "disk_usage",
      header: "Disk",
      cell: ({ row }) => `${row.original.disk_usage.toFixed(1)}%`
    },
    {
      accessorKey: "network_in",
      header: "Network In",
      cell: ({ row }) => `${row.original.network_in} MB/s`
    },
    {
      accessorKey: "network_out",
      header: "Network Out",
      cell: ({ row }) => `${row.original.network_out} MB/s`
    }
  ]
  
  const refreshData = () => {
    setIsLoading(true)
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }
  
  return (
    <div className="container max-w-screen-xl py-8">
      <div className="flex items-center justify-between">
        <PageHeading 
          title="System Monitoring" 
          description="Monitor system performance and status" 
        />
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">System Status</TabsTrigger>
            <TabsTrigger value="events">Event Log</TabsTrigger>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>
                  Current status of all system services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse">Loading system status...</div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {systemStatuses.map((service) => (
                      <Card key={service.service} className="overflow-hidden">
                        <div className={`h-1 w-full ${
                          service.status === "operational" ? "bg-green-500" :
                          service.status === "degraded" ? "bg-amber-500" : "bg-red-500"
                        }`} />
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {service.service === "Web Server" && <Server className="h-5 w-5 text-muted-foreground" />}
                              {service.service === "Database" && <Database className="h-5 w-5 text-muted-foreground" />}
                              {service.service === "Authentication" && <ShieldAlert className="h-5 w-5 text-muted-foreground" />}
                              {service.service === "Payment Processing" && <Activity className="h-5 w-5 text-muted-foreground" />}
                              {service.service === "Storage" && <HardDrive className="h-5 w-5 text-muted-foreground" />}
                              <h3 className="font-medium">{service.service}</h3>
                            </div>
                            <Badge
                              variant={
                                service.status === "operational" ? "success" :
                                service.status === "degraded" ? "outline" : "destructive"
                              }
                            >
                              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Uptime</p>
                              <p className="font-medium">{service.uptime.toFixed(2)}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Response Time</p>
                              <p className="font-medium">{service.response_time} ms</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-muted-foreground">Last Checked</p>
                              <p className="font-medium">{formatDate(service.last_checked, true)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Log</CardTitle>
                <CardDescription>
                  System events and incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse">Loading event log...</div>
                  </div>
                ) : (
                  <DataTable 
                    columns={eventsColumns} 
                    data={systemEvents} 
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  System resource utilization over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse">Loading performance metrics...</div>
                  </div>
                ) : (
                  <DataTable 
                    columns={metricsColumns} 
                    data={systemMetrics} 
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              Current system health and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Overall Status</span>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-lg font-bold">Operational</p>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Uptime</span>
                </div>
                <p className="mt-2 text-lg font-bold">99.95%</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Incidents</span>
                </div>
                <p className="mt-2 text-lg font-bold">1</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Avg. Response</span>
                </div>
                <p className="mt-2 text-lg font-bold">152 ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


