import { apiClient, type PaginatedData } from "../api";

// Types for Dashboard
export interface DashboardStats {
  total_bookings_today: number;
  revenue_today: number;
  active_buses: number;
  pending_contributions: number;
  booking_change_percent: number;
  revenue_change_percent: number;
}

export interface RecentBooking {
  id: string;
  booking_id: string;
  passenger_name: string;
  phone: string;
  route_name: string;
  bus_number: string;
  seats: string;
  date: string;
  fare: number;
  payment_status: string;
  status: string;
}

export interface TopRoute {
  name: string;
  bookings: number;
}

interface BookingListItem {
  id: number;
  user_id: number;
  trip_id: number;
  booking_ref: string;
  total_fare: string | number;
  status: string;
  payment_status: string;
  booked_at: string;
}

// Dashboard API calls
export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>("/reports/dashboard-stats");
}

export async function getRecentBookings(limit: number = 10): Promise<RecentBooking[]> {
  const page = await apiClient.get<PaginatedData<BookingListItem>>(`/bookings?limit=${limit}`);
  return page.items.map((booking) => ({
    id: String(booking.id),
    booking_id: booking.booking_ref,
    passenger_name: `User #${booking.user_id}`,
    phone: "-",
    route_name: `Trip #${booking.trip_id}`,
    bus_number: "-",
    seats: "-",
    date: new Date(booking.booked_at).toLocaleDateString(),
    fare: Number(booking.total_fare),
    payment_status: booking.payment_status,
    status: booking.status,
  }));
}

export async function getTopRoutes(limit: number = 4): Promise<TopRoute[]> {
  return apiClient.get<TopRoute[]>(`/reports/top-routes?limit=${limit}`);
}

export async function getBookingsChart(days: number = 7): Promise<Record<string, number>> {
  return apiClient.get<Record<string, number>>(`/reports/bookings-chart?days=${days}`);
}
