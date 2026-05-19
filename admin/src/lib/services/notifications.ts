import { apiClient, type PaginatedData } from "../api";

// Types for Notifications
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  target_audience: string;
  users_sent: number;
  created_at: string;
}

export interface SendNotificationPayload {
  type: string;
  title: string;
  message: string;
  target_audience: string;
  schedule_time?: string;
}

// Notification API calls
export async function getNotifications(limit: number = 100, offset: number = 0): Promise<Notification[]> {
  const page = await apiClient.get<PaginatedData<Notification>>(
    `/notifications?limit=${limit}&skip=${offset}`
  );
  return page.items;
}

export async function sendNotification(data: SendNotificationPayload): Promise<Notification> {
  return apiClient.post<Notification>("/notifications/send", data);
}

export async function scheduleNotification(data: SendNotificationPayload): Promise<Notification> {
  return apiClient.post<Notification>("/notifications/schedule", data);
}
