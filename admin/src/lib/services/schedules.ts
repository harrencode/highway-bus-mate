import { apiClient, type PaginatedData } from "../api";

// Types for Schedules
export interface Schedule {
  id: string;
  schedule_id: string;
  bus_id: string;
  bus_number: string;
  route_id: string;
  route_name: string;
  direction: string;
  departure_time: string;
  arrival_time: string;
  date: string;
  available_seats: number;
  total_seats: number;
  status: string;
}

export interface CreateSchedulePayload {
  bus_id: string;
  route_id: string;
  departure_time: string;
  arrival_time: string;
  date: string;
}

// Schedule API calls
export async function getSchedules(
  limit: number = 100,
  offset: number = 0,
  route_id?: string,
  date?: string
): Promise<Schedule[]> {
  let url = `/schedules?limit=${limit}&skip=${offset}`;
  if (route_id) url += `&route_id=${route_id}`;
  if (date) url += `&date=${date}`;
  const page = await apiClient.get<PaginatedData<Schedule>>(url);
  return page.items;
}

export async function getSchedule(id: string): Promise<Schedule> {
  return apiClient.get<Schedule>(`/schedules/${id}`);
}

export async function createSchedule(data: CreateSchedulePayload): Promise<Schedule> {
  return apiClient.post<Schedule>("/schedules", data);
}

export async function updateSchedule(id: string, data: Partial<CreateSchedulePayload>): Promise<Schedule> {
  return apiClient.put<Schedule>(`/schedules/${id}`, data);
}

export async function deleteSchedule(id: string): Promise<void> {
  return apiClient.delete(`/schedules/${id}`);
}
