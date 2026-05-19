import { apiClient, type PaginatedData } from "../api";

// Types for Users
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  bookings_count: number;
  joined_date: string;
  status: "active" | "inactive" | "suspended";
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  password: string;
}

// User API calls
export async function getUsers(
  limit: number = 100,
  offset: number = 0,
  role?: string
): Promise<User[]> {
  let url = `/users?limit=${limit}&skip=${offset}`;
  if (role) url += `&role=${role}`;
  const page = await apiClient.get<PaginatedData<User>>(url);
  return page.items;
}

export async function getUser(id: string): Promise<User> {
  return apiClient.get<User>(`/users/${id}`);
}

export async function createUser(data: CreateUserPayload): Promise<User> {
  return apiClient.post<User>("/users", data);
}

export async function updateUser(id: string, data: Partial<CreateUserPayload>): Promise<User> {
  return apiClient.put<User>(`/users/${id}`, data);
}

export async function suspendUser(id: string): Promise<User> {
  return apiClient.post<User>(`/users/${id}/suspend`, {});
}

export async function activateUser(id: string): Promise<User> {
  return apiClient.post<User>(`/users/${id}/activate`, {});
}
