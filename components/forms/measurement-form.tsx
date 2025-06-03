"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { api, type WaterQualityPrediction, type Recommendation } from "@/lib/api"
import { getErrorMessage } from "@/lib/errors"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download } from "lucide-react"

const measurementSchema = z.object({
  temperature: z.number().min(0).max(40),
  dissolved_oxygen: z.number().min(0).max(14),
  ph: z.number().min(0).max(14),
  conductivity: z.number().min(0).max(2000),
  bod: z.number().min(0).max(30),
  nitrate: z.number().min(0).max(50),
  fecal_coliform: z.number().min(0).max(500),
  total_coliform: z.number().min(0).max(1000),
})

type MeasurementFormValues = z.infer<typeof measurementSchema>

const getAlertVariant = (severity: string): "default" | "destructive" => {
  switch (severity.toLowerCase()) {
    case "critical":
    case "severe":
    case "moderate":
      return "destructive";
    default:
      return "default";
  }
};

interface RecommendedAction {
  priority: string;
  action: string;
}

export function MeasurementForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [prediction, setPrediction] = useState<WaterQualityPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      temperature: 25,
      dissolved_oxygen: 7,
      ph: 7,
      conductivity: 500,
      bod: 5,
      nitrate: 10,
      fecal_coliform: 100,
      total_coliform: 200,
    },
  })

  async function onSubmit(data: MeasurementFormValues) {
    try {
      setIsSubmitting(true)
      setError(null)
      setPrediction(null)
      console.log("Submitting form data:", data)
      const result = await api.predictWaterQuality(data)
      console.log("Received prediction result:", result)
      setPrediction(result)
      toast.success("Water quality analysis completed successfully")
    } catch (error) {
      console.error("Error submitting form:", error)
      if (error instanceof Error && error.message === 'Authentication token not found.') {
        toast.error("Please log in to continue")
        window.location.href = '/login'
      } else {
        const errorMessage = getErrorMessage(error)
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const formData = form.getValues()
      const pdfBlob = await api.generateReport(formData)
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `water_quality_report_${new Date().toISOString().slice(0,19).replace(/[:]/g, '')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success("Report downloaded successfully")
    } catch (error) {
      console.error("Error downloading report:", error)
      toast.error("Failed to download report")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Water Quality Measurement</CardTitle>
          <CardDescription>
            Enter the water quality parameters to analyze the water quality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dissolved_oxygen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dissolved Oxygen (mg/L)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ph"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>pH</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conductivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conductivity (µS/cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BOD (mg/L)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nitrate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nitrate (mg/L)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecal_coliform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecal Coliform (MPN/100ml)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total_coliform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Coliform (MPN/100ml)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? "" : parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Analyzing..." : "Analyze Water Quality"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {prediction && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Water quality analysis based on the provided parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Water Quality Index (WQI)</h3>
                <div className="mt-2">
                  <Progress value={prediction.wqi_value} className="h-2" />
                  <p className="mt-1 text-sm text-muted-foreground">
                    {prediction.wqi_value.toFixed(1)} - {prediction.quality_category}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Water Quality Status</h3>
                <p className="mt-1 text-sm">
                  The water is {prediction.is_potable ? "potable" : "not potable"} with a confidence of{" "}
                  {(prediction.confidence * 100).toFixed(1)}%.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Parameters</h3>
                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(prediction.parameters).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm text-muted-foreground">{value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleDownloadPDF}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {prediction && prediction.recommendations && Object.keys(prediction.recommendations).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              Actions to improve water quality based on analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(prediction.recommendations).map(([category, recs]: [string, Recommendation[]]) => {
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
                    {Object.values(groupedRecs).map((rec, index) => {
                      const isWithinRange = 
                        rec.current_value >= rec.acceptable_range[0] && 
                        rec.current_value <= rec.acceptable_range[1];
                      
                      return (
                        <Alert 
                          key={index} 
                          variant={isWithinRange ? "default" : getAlertVariant(rec.severity)}
                        >
                          <AlertTitle>
                            {rec.parameter.toUpperCase()} - {isWithinRange ? "WITHIN RANGE" : rec.severity}
                          </AlertTitle>
                          <AlertDescription>
                            <div className="space-y-2">
                              {rec.description && (
                                <p>{rec.description}</p>
                              )}
                              {!isWithinRange && rec.health_implications && rec.health_implications.length > 0 && (
                                <>
                                  <p className="font-semibold">Health Implications:</p>
                                  <ul className="list-disc pl-4">
                                    {rec.health_implications.map((imp: string, impIndex: number) => (
                                      <li key={impIndex}>{imp}</li>
                                    ))}
                                  </ul>
                                </>
                              )}
                              <div className="grid grid-cols-2 gap-2">
                                <p className="font-semibold">Current Value:</p>
                                <p>{rec.current_value}</p>
                                <p className="font-semibold">Acceptable Range:</p>
                                <p>{rec.acceptable_range[0]} - {rec.acceptable_range[1]}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Recommended Actions:</p>
                                <ul className="list-disc pl-4">
                                  {rec.actions.map((action, actionIndex) => (
                                    <li key={actionIndex} className="capitalize">
                                      {action.priority.replace(/_/g, " ")}: {action.action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
