import { apiClient } from "../api";

// Types for Reports
export interface ReportStats {
  monthly_revenue: string;
  total_bookings: number;
  active_users: number;
  cancellation_rate: number;
}

export interface RoutePerformance {
  name: string;
  bookings: number;
}

export interface RevenueByType {
  type: string;
  revenue: string;
  percentage: number;
}

// Report API calls
export async function getReportStats(period: string = "this-month"): Promise<ReportStats> {
  return apiClient.get<ReportStats>(`/reports/stats?period=${period}`);
}

export async function getMostBookedRoutes(limit: number = 5): Promise<RoutePerformance[]> {
  return apiClient.get<RoutePerformance[]>(`/reports/most-booked-routes?limit=${limit}`);
}

export async function getRevenueByBusType(period: string = "this-month"): Promise<RevenueByType[]> {
  return apiClient.get<RevenueByType[]>(`/reports/revenue-by-type?period=${period}`);
}

export async function downloadReport(format: "csv" | "pdf" = "csv"): Promise<Blob> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/download?format=${format}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.blob();
}
