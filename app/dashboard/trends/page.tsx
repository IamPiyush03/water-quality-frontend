import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TrendsChart from "@/components/dashboard/trends-chart"

export default function TrendsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Trends Analysis</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { key: "ph", label: "pH", desc: "Historical pH values" },
          { key: "dissolved_oxygen", label: "Dissolved Oxygen", desc: "Historical D.O. values" },
          { key: "temperature", label: "Temperature", desc: "Historical temperature values" },
          { key: "conductivity", label: "Conductivity", desc: "Historical conductivity values" },
          { key: "bod", label: "BOD", desc: "Historical B.O.D. values" },
          { key: "nitrate", label: "Nitrate", desc: "Historical nitrate values" },
          { key: "fecal_coliform", label: "Fecal Coliform", desc: "Historical fecal coliform values" },
          { key: "total_coliform", label: "Total Coliform", desc: "Historical total coliform values" }
        ].map(param => (
          <Card key={param.key}>
            <CardHeader>
              <CardTitle>{param.label} Trend</CardTitle>
              <CardDescription>{param.desc}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <TrendsChart parameter={param.key} />
              </Suspense>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
