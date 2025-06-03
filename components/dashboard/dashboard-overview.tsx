"use client"

import { useEffect, useState } from "react"
import { api, type DashboardData, type Recommendation, type RecommendedAction } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getDashboard()
        setDashboardData(data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div>Loading dashboard data...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!dashboardData) {
    return <div>No data available</div>
  }

  // Convert recent measurements to chart data
  const chartData = dashboardData.recent_measurements.map(measurement => ({
    date: new Date(measurement.timestamp).toLocaleDateString(),
    wqi: measurement.wqi_value,
    ...measurement.parameters
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current WQI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.current_wqi.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.quality_category}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Water Quality Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Parameter Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dashboardData.parameter_summary).map(([param, data]) => (
                <div key={param} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {param.replace(/_/g, " ")}
                  </span>
                  <div className="text-sm text-muted-foreground">
                    {data.current.toFixed(2)} (avg: {data.avg.toFixed(2)})
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations and Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Actions to improve water quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.keys(dashboardData.recommendations).length === 0 ? (
                <p className="text-sm text-muted-foreground">No recommendations at this time.</p>
              ) : (
                Object.entries(dashboardData.recommendations).map(([category, recs]: [string, Recommendation[]]) => {
                  // Group recommendations by parameter and severity
                  const groupedRecs = recs.reduce((acc, rec) => {
                    const key = `${rec.parameter}-${rec.severity}`;
                    if (!acc[key]) {
                      acc[key] = {
                        ...rec,
                        actions: []
                      };
                    }
                    acc[key].actions.push({
                      priority: rec.priority,
                      action: rec.action
                    });
                    return acc;
                  }, {} as Record<string, Recommendation & { actions: { priority: string; action: string }[] }>);

                  return (
                    <div key={category} className="space-y-4">
                      <h3 className="text-lg font-semibold capitalize">{category.replace(/_/g, " ")}</h3>
                      {Object.values(groupedRecs).map((rec, index) => (
                        <div key={index} className="space-y-4">
                          <Alert variant={rec.severity === "high" ? "destructive" : "default"}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="capitalize">
                              {rec.parameter.replace(/_/g, " ")} - {rec.severity.toUpperCase()}
                            </AlertTitle>
                            <AlertDescription>
                              <div className="mt-2 space-y-2">
                                <p className="text-sm">{rec.description}</p>
                                <div className="text-sm">
                                  <p className="font-semibold">Current Value: {rec.current_value}</p>
                                  <p className="text-muted-foreground">
                                    Acceptable Range: {rec.acceptable_range ? `${rec.acceptable_range[0]} - ${rec.acceptable_range[1]}` : 'Not specified'}
                                  </p>
                                </div>
                                <div className="text-sm">
                                  <p className="font-semibold">Health Implications:</p>
                                  <ul className="list-disc list-inside text-muted-foreground">
                                    {rec.health_implications.map((imp: string, i: number) => (
                                      <li key={i}>{imp}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="text-sm">
                                  <p className="font-semibold">Recommended Actions:</p>
                                  <ul className="list-disc list-inside text-muted-foreground">
                                    {rec.actions.map((action, i) => (
                                      <li key={i} className="capitalize">
                                        {action.priority.replace(/_/g, " ")}: {action.action}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Current water quality alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active alerts.</p>
              ) : (
                dashboardData.alerts.map((alert, index) => (
                  <Alert key={index} variant={alert.severity === "high" ? "destructive" : "default"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="capitalize">{alert.parameter.replace(/_/g, " ")}</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Alert>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
