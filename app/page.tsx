import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Droplets, LineChart, Thermometer, Activity } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Water Quality Monitoring System</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Monitor, analyze, and predict water quality parameters across different locations
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/overview">
              View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/measurements/new">Add New Measurement</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dashboard</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Comprehensive overview of water quality metrics</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Measurements</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Record and view water quality measurements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trends</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Analyze historical trends and patterns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parameters</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Detailed analysis of individual parameters</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>Comprehensive tools for water quality monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
                <span>Real-time water quality monitoring</span>
              </li>
              <li className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
                <span>Historical data analysis and trends</span>
              </li>
              <li className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
                <span>Parameter-specific dashboards</span>
              </li>
              <li className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
                <span>Data export capabilities</span>
              </li>
              <li className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
                <span>Water quality prediction</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Quick links to essential features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Link href="/dashboard/overview" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                View Dashboard Overview
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Get a comprehensive view of all water quality metrics
              </p>
            </div>
            <div>
              <Link href="/measurements/new" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Add New Measurement
              </Link>
              <p className="text-sm text-muted-foreground mt-1">Record a new water quality measurement</p>
            </div>
            <div>
              <Link href="/dashboard/trends" className="text-primary hover:underline flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                Analyze Trends
              </Link>
              <p className="text-sm text-muted-foreground mt-1">View historical trends and patterns</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
