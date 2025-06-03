"use client"

import { useEffect, useState } from "react"
import { api, type ParameterDashboardData } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ParameterDetailProps {
  parameter: string
}

export default function ParameterDetail({ parameter }: ParameterDetailProps) {
  const [parameterData, setParameterData] = useState<ParameterDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParameterData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getParameterDashboard(parameter)
        setParameterData(data)
      } catch (err) {
        console.error(`Error fetching ${parameter} data:`, err)
        setError(`Failed to load ${parameter} data. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    fetchParameterData()
  }, [parameter])

  if (loading) {
    return <div>Loading parameter data...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!parameterData) {
    return <div>No data available</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight capitalize">
          {parameter.replace(/_/g, " ")} Analysis
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parameterData.current_value.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {parameterData.threshold_info.is_within_range ? "Within acceptable range" : "Outside acceptable range"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parameterData.statistics.avg.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ±{parameterData.statistics.std_dev.toFixed(2)} standard deviation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parameterData.statistics.min.toFixed(2)} - {parameterData.statistics.max.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Acceptable: {parameterData.threshold_info.min_acceptable} - {parameterData.threshold_info.max_acceptable}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Historical Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={parameterData.historical_values.dates.map((date, index) => ({
                  date,
                  value: parameterData.historical_values.values[index]
                }))}
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0ea5e9"
                  activeDot={{ r: 8 }}
                  name={parameter.replace(/_/g, " ")}
                />
                <ReferenceLine
                  y={parameterData.threshold_info.min_acceptable}
                  stroke="orange"
                  strokeDasharray="3 3"
                  label={{ value: "Min Threshold", position: "insideBottomLeft" }}
                />
                <ReferenceLine
                  y={parameterData.threshold_info.max_acceptable}
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{ value: "Max Threshold", position: "insideTopLeft" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
