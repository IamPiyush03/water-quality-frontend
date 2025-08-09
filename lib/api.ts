import { ApiError } from "./errors"
import { getAuthToken } from "./auth"

// Define types for API responses and requests
export interface WaterQualityInput {
  temperature: number
  dissolved_oxygen: number
  ph: number
  conductivity: number
  bod: number
  nitrate: number
  fecal_coliform: number
  total_coliform: number
}

export interface WaterQualityPrediction {
  is_potable: boolean
  confidence: number
  wqi_value: number
  quality_category: string
  parameters: Record<string, number>
  recommendations: {
    immediate: Recommendation[]
    short_term: Recommendation[]
    long_term: Recommendation[]
    preventive: Recommendation[]
  }
}

export interface MeasurementDetails {
  id: number
  location: string
  timestamp: string
  wqi_value: number
  quality_category: string
  parameters: {
    temperature: number
    dissolved_oxygen: number
    ph: number
    conductivity: number
    bod: number
    nitrate: number
    fecal_coliform: number
    total_coliform: number
  }
}

export interface TrendData {
  dates: string[]
  parameters: {
    [key: string]: number[]
  }
  wqi_values: number[]
}

export interface ParameterSummary {
  current: number
  min: number
  max: number
  avg: number
}

export interface Alert {
  parameter: string
  severity: "low" | "medium" | "high"
  message: string
}

export interface RecommendedAction {
  priority: string
  action: string
}

export interface Recommendation {
  parameter: string
  severity: string
  description: string
  health_implications: string[]
  current_value: number
  acceptable_range: [number, number]
  action: string
  priority: string
}

export interface DashboardData {
  current_wqi: number
  quality_category: string
  parameter_summary: {
    [key: string]: {
      current: number
      min: number
      max: number
      avg: number
    }
  }
  recent_measurements: {
    id: number
    timestamp: string
    wqi_value: number
    quality_category: string
    parameters: {
      temperature: number
      dissolved_oxygen: number
      ph: number
      conductivity: number
      bod: number
      nitrate: number
      fecal_coliform: number
      total_coliform: number
    }
  }[]
  alerts: Alert[]
  recommendations: {
    immediate: Recommendation[]
    short_term: Recommendation[]
    long_term: Recommendation[]
    preventive: Recommendation[]
  }
}

export interface ParameterDashboardData {
  parameter: string
  current_value: number
  historical_values: {
    dates: string[]
    values: number[]
  }
  statistics: {
    min: number
    max: number
    avg: number
    std_dev: number
  }
  threshold_info: {
    min_acceptable: number
    max_acceptable: number
    is_within_range: boolean
  }
}

export interface ComparisonDashboardData {
  locations: string[]
  dates: string[]
  wqi_values: Record<string, number[]>
  parameter_averages: Record<string, Record<string, number>>
}

// API client
const API_BASE_URL = "https://water-quality-backend-f49b.onrender.com"

// Helper function for authenticated fetch requests
const authenticatedFetch = async (url: string, options?: RequestInit): Promise<Response> => {
  const token = getAuthToken();
  console.log("Making authenticated request to:", url);
  console.log("Token from localStorage:", token);
  
  if (!token) {
    console.error("No authentication token found");
    throw new Error('Authentication token not found.');
  }

  const headers = {
    ...(options?.headers || {}),
    Authorization: `Bearer ${token}`,
  };
  
  console.log("Request headers:", headers);

  return fetch(url, { ...options, headers });
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "An error occurred"
    try {
      const errorData = await response.json()
      errorMessage = errorData.detail || errorMessage
    } catch {
      // If we can't parse the error JSON, use the status text
      errorMessage = response.statusText || errorMessage
    }
    throw new ApiError(errorMessage, response.status)
  }
  return response.json()
}

export const api = {
  // Health Check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await fetch(`${API_BASE_URL}/health`)
    return handleResponse(response)
  },

  // Predict Water Quality
  predictWaterQuality: async (data: WaterQualityInput): Promise<WaterQualityPrediction> => {
    try {
      console.log("Sending prediction request with data:", data);
      const response = await authenticatedFetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          temperature: data.temperature,
          dissolved_oxygen: data.dissolved_oxygen,
          ph: data.ph,
          conductivity: data.conductivity,
          bod: data.bod,
          nitrate: data.nitrate,
          fecal_coliform: data.fecal_coliform,
          total_coliform: data.total_coliform
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "An error occurred" }));
        console.error("Prediction API error:", errorData);
        throw new ApiError(errorData.detail || "Failed to predict water quality", response.status);
      }

      const result = await response.json();
      console.log("Received prediction result:", result);
      return result;
    } catch (error) {
      console.error("Error in predictWaterQuality:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to predict water quality", 500);
    }
  },

  // Get Measurement Details
  getMeasurementDetails: async (measurementId: number): Promise<MeasurementDetails> => {
    const response = await fetch(`${API_BASE_URL}/api/measurements/${measurementId}`)
    return handleResponse(response)
  },

  // Get Trends
  getTrends: async (days = 30): Promise<TrendData> => {
    try {
      // Use the authenticated fetch helper
      const response = await authenticatedFetch(`${API_BASE_URL}/api/trends?days=${days}`);
      if (!response.ok) {
        // Handle specific API errors if needed
         if (response.status === 401) {
            throw new Error('Unauthorized: Invalid or expired token.');
         }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching trend data:", error);
      throw error; // Re-throw to be caught by page component
    }
  },

  // Get Dashboard
  getDashboard: async (): Promise<DashboardData> => {
    try {
      // Use the authenticated fetch helper
      const response = await authenticatedFetch(`${API_BASE_URL}/api/dashboard`);
      if (!response.ok) {
        // Handle specific API errors if needed
         if (response.status === 401) {
            throw new Error('Unauthorized: Invalid or expired token.');
         }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error; // Re-throw to be caught by page component
    }
  },

  // Get Parameter Dashboard
  getParameterDashboard: async (parameter: string): Promise<ParameterDashboardData> => {
    try {
      // Use the authenticated fetch helper
      const response = await authenticatedFetch(`${API_BASE_URL}/api/dashboard/parameter/${parameter}`);
       if (!response.ok) {
        // Handle specific API errors if needed
         if (response.status === 401) {
            throw new Error('Unauthorized: Invalid or expired token.');
         }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data for parameter ${parameter}:`, error);
      throw error; // Re-throw to be caught by page component
    }
  },

  // Get Comparison Dashboard
  getComparisonDashboard: async (locations: string[], days = 30): Promise<ComparisonDashboardData> => {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/compare?locations=${locations.join(",")}&days=${days}`)
    return handleResponse<ComparisonDashboardData>(response)
  },

  // Export Data
  exportData: async (format: "csv" | "excel" = "csv"): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/api/export?format=${format}`)
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "An error occurred" }))
      throw new ApiError(error.detail || "An error occurred", response.status)
    }
    return response.blob()
  },

  // Add a function to make authenticated POST requests (e.g., for adding measurements)
  authenticatedPost: async (url: string, body: any, options?: RequestInit): Promise<Response> => {
     const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found.');
    }

    const headers = {
      ...(options?.headers || {}),
      'Content-Type': 'application/json', // Assuming POST body is usually JSON
      Authorization: `Bearer ${token}`,
    };

    return fetch(url, { method: 'POST', headers, body: JSON.stringify(body), ...options });
  },

  // Generate PDF Report
  generateReport: async (data: WaterQualityInput): Promise<Blob> => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "An error occurred" }));
        console.error("Report generation error:", errorData);
        throw new ApiError(errorData.detail || "Failed to generate report", response.status);
      }

      return response.blob();
    } catch (error) {
      console.error("Error in generateReport:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Failed to generate report", 500);
    }
  },
}