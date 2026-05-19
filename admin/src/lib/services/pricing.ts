import { apiClient, type PaginatedData } from "../api";

// Types for Pricing
export interface Pricing {
  id: string;
  route_id: string;
  route_name: string;
  bus_type: string;
  bus_id: string;
  bus_number: string;
  base_fare: number;
  surcharge: number;
  total_fare: number;
  last_updated: string;
}

export interface CreatePricingPayload {
  route_id: string;
  bus_id: string;
  base_fare: number;
  surcharge?: number;
}

// Pricing API calls
export async function getPricings(limit: number = 100, offset: number = 0): Promise<Pricing[]> {
  const page = await apiClient.get<PaginatedData<Pricing>>(
    `/pricing?limit=${limit}&skip=${offset}`
  );
  return page.items;
}

export async function getPricing(id: string): Promise<Pricing> {
  return apiClient.get<Pricing>(`/pricing/${id}`);
}

export async function createPricing(data: CreatePricingPayload): Promise<Pricing> {
  return apiClient.post<Pricing>("/pricing", data);
}

export async function updatePricing(id: string, data: Partial<CreatePricingPayload>): Promise<Pricing> {
  return apiClient.put<Pricing>(`/pricing/${id}`, data);
}

export async function deletePricing(id: string): Promise<void> {
  return apiClient.delete(`/pricing/${id}`);
}
