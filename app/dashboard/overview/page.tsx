"use client";
import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import { AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Water Quality Index</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                  <div className="text-2xl font-bold">76.5</div>
                  <p className="text-xs text-muted-foreground">Good quality</p>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">pH Level</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                  <div className="text-2xl font-bold">7.2</div>
                  <p className="text-xs text-muted-foreground">Within normal range</p>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dissolved Oxygen</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                  <div className="text-2xl font-bold">8.5 mg/L</div>
                  <p className="text-xs text-muted-foreground">Good for aquatic life</p>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                  <div className="text-2xl font-bold">22.3°C</div>
                  <p className="text-xs text-muted-foreground">Normal range</p>
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Water Quality Index Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                  <DashboardOverview />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Measurements</CardTitle>
                <CardDescription>Last 5 measurements at this location</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">May 10, 2025 - 10:30 AM</p>
                        <p className="text-sm text-muted-foreground">WQI: 76.5 (Good)</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">May 9, 2025 - 11:15 AM</p>
                        <p className="text-sm text-muted-foreground">WQI: 75.8 (Good)</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">May 8, 2025 - 9:45 AM</p>
                        <p className="text-sm text-muted-foreground">WQI: 68.2 (Fair)</p>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">May 7, 2025 - 10:20 AM</p>
                        <p className="text-sm text-muted-foreground">WQI: 77.1 (Good)</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">May 6, 2025 - 11:00 AM</p>
                        <p className="text-sm text-muted-foreground">WQI: 78.3 (Good)</p>
                      </div>
                    </div>
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Locations</CardTitle>
              <CardDescription>Select a location to view detailed water quality data</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Location selection content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Comparison</CardTitle>
              <CardDescription>Compare water quality metrics across different locations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Location comparison content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
