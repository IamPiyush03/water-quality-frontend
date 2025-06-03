"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MeasurementForm } from "@/components/forms/measurement-form"
import { useAuth } from "@/lib/auth"

export default function NewMeasurementPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // The useAuth hook will handle the redirect
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block text-3xl font-bold tracking-tight lg:text-4xl">New Measurement</h1>
          <p className="text-lg text-muted-foreground">Record a new water quality measurement</p>
        </div>
      </div>

      <div className="grid gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Measurement Details</CardTitle>
            <CardDescription>Enter the water quality parameters for this measurement</CardDescription>
          </CardHeader>
          <CardContent>
            <MeasurementForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
