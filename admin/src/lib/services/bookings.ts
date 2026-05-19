import { apiClient, type PaginatedData } from "../api";

// Types for Bookings
export interface Booking {
  id: string;
  booking_id: string;
  passenger_id: string;
  passenger_name: string;
  phone: string;
  route_id: string;
  route_name: string;
  bus_id: string;
  bus_number: string;
  seats: string[];
  booking_date: string;
  travel_date: string;
  total_fare: number;
  payment_status: "paid" | "pending" | "refunded";
  status: "confirmed" | "pending" | "cancelled";
}

export interface BookingStats {
  today_bookings: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

// Booking API calls
export async function getBookings(
  limit: number = 100,
  offset: number = 0,
  status?: string
): Promise<Booking[]> {
  let url = `/bookings?limit=${limit}&skip=${offset}`;
  if (status) url += `&status=${status}`;
  const page = await apiClient.get<PaginatedData<Booking>>(url);
  return page.items;
}

export async function getBooking(id: string): Promise<Booking> {
  return apiClient.get<Booking>(`/bookings/${id}`);
}

export async function getBookingStats(): Promise<BookingStats> {
  return apiClient.get<BookingStats>("/bookings/stats");
}

export async function cancelBooking(id: string, reason?: string): Promise<void> {
  return apiClient.post(`/bookings/${id}/cancel`, { reason });
}

export async function confirmBooking(id: string): Promise<Booking> {
  return apiClient.post<Booking>(`/bookings/${id}/confirm`, {});
}
