import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ParametersPage() {
  const parameters = [
    {
      id: "ph",
      name: "pH",
      description: "Measure of acidity or alkalinity",
      value: "7.2",
      status: "normal",
    },
    {
      id: "dissolved-oxygen",
      name: "Dissolved Oxygen",
      description: "Amount of oxygen dissolved in water",
      value: "8.5 mg/L",
      status: "good",
    },
    {
      id: "temperature",
      name: "Temperature",
      description: "Water temperature",
      value: "22.3°C",
      status: "normal",
    },
    {
      id: "conductivity",
      name: "Conductivity",
      description: "Ability to conduct electricity",
      value: "330 μS/cm",
      status: "normal",
    },
    {
      id: "bod",
      name: "Biochemical Oxygen Demand",
      description: "Amount of oxygen consumed by organisms",
      value: "2.2 mg/L",
      status: "normal",
    },
    {
      id: "nitrate",
      name: "Nitrate",
      description: "Nitrogen-containing compound",
      value: "5.3 mg/L",
      status: "normal",
    },
    {
      id: "fecal-coliform",
      name: "Fecal Coliform",
      description: "Bacteria from fecal matter",
      value: "120 MPN/100mL",
      status: "normal",
    },
    {
      id: "total-coliform",
      name: "Total Coliform",
      description: "Group of bacteria found in water",
      value: "350 MPN/100mL",
      status: "normal",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Water Quality Parameters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {parameters.map((parameter) => (
          <Link key={parameter.id} href={`/dashboard/parameters/${parameter.id}`} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{parameter.name}</CardTitle>
                <CardDescription>{parameter.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold">{parameter.value}</div>
                    <p
                      className={`text-sm ${
                        parameter.status === "good"
                          ? "text-green-500"
                          : parameter.status === "normal"
                            ? "text-blue-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {parameter.status.charAt(0).toUpperCase() + parameter.status.slice(1)}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
