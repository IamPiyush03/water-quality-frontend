"use client";

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ParameterDetail from "@/components/dashboard/parameter-detail"
import { notFound } from "next/navigation"
import { useAuth } from "@/lib/auth"

interface ParameterPageProps {
  params: {
    parameter: string
  }
}

interface ParameterInfo {
  name: string;
  unit: string;
  description: string;
  acceptableRange: string;
}

type ParameterMap = {
  [key: string]: ParameterInfo;
};

export default function ParameterPage({ params }: ParameterPageProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // The useAuth hook will handle the redirect
  }

  const parameter = params.parameter

  const parameterMap: ParameterMap = {
    "ph": {
      name: "pH",
      unit: "",
      description: "pH is a measure of how acidic or basic water is. The range goes from 0 to 14, with 7 being neutral. pH values less than 7 indicate acidity, whereas pH values greater than 7 indicate alkalinity.",
      acceptableRange: "The acceptable range for pH in freshwater systems is typically 6.5 to 8.5."
    },
    "dissolved-oxygen": {
      name: "Dissolved Oxygen",
      unit: "mg/L",
      description: "Dissolved oxygen (DO) is the amount of oxygen that is present in water. It is an important parameter in assessing water quality because of its influence on the organisms living within a body of water.",
      acceptableRange: "Dissolved oxygen levels above 6.5-8 mg/L are considered good for most aquatic life. Levels below 5 mg/L can put aquatic life under stress."
    },
    "D_O": {
      name: "Dissolved Oxygen",
      unit: "mg/L",
      description: "Dissolved oxygen (DO) is the amount of oxygen that is present in water. It is an important parameter in assessing water quality because of its influence on the organisms living within a body of water.",
      acceptableRange: "Dissolved oxygen levels above 6.5-8 mg/L are considered good for most aquatic life. Levels below 5 mg/L can put aquatic life under stress."
    },
    temperature: {
      name: "Temperature",
      unit: "°C",
      description: "Water temperature affects the oxygen content of the water, with warm water holding less dissolved oxygen than cold water. It also affects the rate of photosynthesis by aquatic plants and the metabolic rates of aquatic organisms.",
      acceptableRange: "The acceptable temperature range varies by water body and aquatic species, but generally 20-25°C is considered normal for many freshwater systems."
    },
    conductivity: {
      name: "Conductivity",
      unit: "μS/cm",
      description: "Conductivity is a measure of the ability of water to pass an electrical current. It is affected by the presence of inorganic dissolved solids such as chloride, nitrate, sulfate, and phosphate anions or sodium, magnesium, calcium, iron, and aluminum cations.",
      acceptableRange: "Freshwater streams typically range from 50 to 1500 μS/cm. Conductivity outside this range could indicate pollution."
    },
    bod: {
      name: "Biochemical Oxygen Demand",
      unit: "mg/L",
      description: "Biochemical Oxygen Demand (BOD) is the amount of dissolved oxygen needed by aerobic biological organisms to break down organic material present in a given water sample at certain temperature over a specific time period.",
      acceptableRange: "For clean water, BOD should be below 3 mg/L. Levels above 5 mg/L indicate possible pollution."
    },
    nitrate: {
      name: "Nitrate",
      unit: "mg/L",
      description: "Nitrate is a compound that is formed naturally when nitrogen combines with oxygen or ozone. Nitrogen is essential for all living things, but high levels of nitrate in water can be harmful to humans and wildlife.",
      acceptableRange: "The EPA standard for nitrate in drinking water is 10 mg/L. For aquatic ecosystems, levels should generally be below 5-10 mg/L."
    },
    "fecal-coliform": {
      name: "Fecal Coliform",
      unit: "MPN/100mL",
      description: "Fecal coliform bacteria are a subgroup of total coliform bacteria. They exist in the intestines and feces of people and animals. The presence of fecal coliforms in water indicates that the water has been contaminated with fecal material.",
      acceptableRange: "For recreational waters, fecal coliform levels should be below 200 MPN/100mL."
    },
    "total-coliform": {
      name: "Total Coliform",
      unit: "MPN/100mL",
      description: "Total coliform bacteria are a collection of relatively harmless microorganisms that live in large numbers in the intestines of humans and warm- and cold-blooded animals. They aid in the digestion of food.",
      acceptableRange: "For drinking water, total coliform should be absent. For recreational waters, levels should be below 500 MPN/100mL."
    }
  }

  const parameterInfo = parameterMap[parameter]

  if (!parameterInfo) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {parameterInfo.name} Analysis
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parameter === "ph" ? "7.2" : parameter === "dissolved-oxygen" || parameter === "D_O" ? "8.5 mg/L" : parameter === "temperature" ? "22.3°C" : parameter === "conductivity" ? "330 μS/cm" : parameter === "bod" ? "2.2 mg/L" : parameter === "nitrate" ? "5.3 mg/L" : parameter === "fecal-coliform" ? "120 MPN/100mL" : "350 MPN/100mL"}
              </div>
              <p className="text-xs text-muted-foreground">Within acceptable range</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parameter === "ph" ? "7.1" : parameter === "dissolved-oxygen" || parameter === "D_O" ? "8.3 mg/L" : parameter === "temperature" ? "22.1°C" : parameter === "conductivity" ? "328 μS/cm" : parameter === "bod" ? "2.3 mg/L" : parameter === "nitrate" ? "5.4 mg/L" : parameter === "fecal-coliform" ? "125 MPN/100mL" : "360 MPN/100mL"}
              </div>
              <p className="text-xs text-muted-foreground">±0.2 standard deviation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Range</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parameter === "ph" ? "6.9 - 7.4" : parameter === "dissolved-oxygen" || parameter === "D_O" ? "8.0 - 8.6 mg/L" : parameter === "temperature" ? "21.5 - 22.8°C" : parameter === "conductivity" ? "320 - 335 μS/cm" : parameter === "bod" ? "2.1 - 2.4 mg/L" : parameter === "nitrate" ? "5.1 - 5.5 mg/L" : parameter === "fecal-coliform" ? "110 - 135 MPN/100mL" : "330 - 380 MPN/100mL"}
              </div>
              <p className="text-xs text-muted-foreground">
                {parameterInfo.acceptableRange}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>{parameterInfo.description}</p>
              <h3 className="text-lg font-semibold">Acceptable Range</h3>
              <p>{parameterInfo.acceptableRange}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
