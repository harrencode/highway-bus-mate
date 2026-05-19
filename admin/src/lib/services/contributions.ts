import { apiClient, type PaginatedData } from "../api";

// Types for Contributions
export interface Contribution {
  id: string;
  type: "new_route" | "new_bus" | "update";
  submitted_by: string;
  details: string;
  submitted_at: string;
  notes: string;
  status: "pending" | "approved" | "rejected";
}

// Contribution API calls
export async function getContributions(
  limit: number = 100,
  offset: number = 0,
  status?: string
): Promise<Contribution[]> {
  let url = `/contributions?limit=${limit}&skip=${offset}`;
  if (status) url += `&status=${status}`;
  const page = await apiClient.get<PaginatedData<Contribution>>(url);
  return page.items;
}

export async function getContribution(id: string): Promise<Contribution> {
  return apiClient.get<Contribution>(`/contributions/${id}`);
}

export async function approveContribution(id: string): Promise<Contribution> {
  return apiClient.post<Contribution>(`/contributions/${id}/approve`, {});
}

export async function rejectContribution(id: string, reason?: string): Promise<void> {
  return apiClient.post(`/contributions/${id}/reject`, { reason });
}
