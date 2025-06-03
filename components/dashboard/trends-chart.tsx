"use client"

import { useEffect, useState } from "react"
import { api, type TrendData } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TrendsChartProps {
  parameter: string
}

export default function TrendsChart({ parameter }: TrendsChartProps) {
  const [trendData, setTrendData] = useState<TrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getTrends(30)
        setTrendData(data)
      } catch (err) {
        console.error(`Error fetching ${parameter} trend data:`, err)
        setError(`Failed to load ${parameter} trend data. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendData()
  }, [parameter])

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!trendData) {
    return <div>No data available</div>
  }

  // Transform API data for the chart
  const chartData = trendData.dates.map((date, index) => ({
    date,
    value: trendData.parameters[parameter]?.[index] || 0
  }))

  // Get parameter display name
  const getParameterDisplayName = (param: string) => {
    switch (param) {
      case "D_O":
        return "Dissolved Oxygen"
      case "B_O_D":
        return "Biochemical Oxygen Demand"
      default:
        return param.replace("_", " ")
    }
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0ea5e9"
          activeDot={{ r: 8 }}
          name={getParameterDisplayName(parameter)}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
