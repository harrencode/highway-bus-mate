import { apiClient, type PaginatedData } from "../api";

// Types for Routes
export interface Route {
  id: string;
  route_code: string;
  origin: string;
  destination: string;
  distance_km: number;
  active_buses: number;
  avg_fare: number;
  status: "active" | "inactive";
}

export interface CreateRoutePayload {
  route_code: string;
  origin: string;
  destination: string;
  distance_km: number;
  status: "active" | "inactive";
}

interface BackendRoute {
  id: number;
  origin: string;
  destination: string;
  distance_km: string | number | null;
  status: string;
}

interface RouteApiPayload {
  origin: string;
  destination: string;
  distance_km: number | null;
  status: "active" | "inactive";
}

function toRoute(route: BackendRoute): Route {
  const distance = Number(route.distance_km);

  return {
    id: String(route.id),
    route_code: `RT-${String(route.id).padStart(3, "0")}`,
    origin: route.origin || "",
    destination: route.destination || "",
    distance_km: Number.isFinite(distance) ? distance : 0,
    active_buses: 0,
    avg_fare: 0,
    status: route.status === "inactive" ? "inactive" : "active",
  };
}

function toRouteApiPayload(data: CreateRoutePayload): RouteApiPayload {
  return {
    origin: data.origin,
    destination: data.destination,
    distance_km: Number.isFinite(data.distance_km) ? data.distance_km : null,
    status: data.status,
  };
}

// Route API calls
export async function getRoutes(
  limit: number = 100,
  offset: number = 0,
  status?: string
): Promise<Route[]> {
  let url = `/routes?limit=${limit}&skip=${offset}`;
  if (status) url += `&status=${status}`;
  const page = await apiClient.get<PaginatedData<BackendRoute>>(url);
  return page.items.map(toRoute);
}

export async function getRoute(id: string): Promise<Route> {
  const route = await apiClient.get<BackendRoute>(`/routes/${id}`);
  return toRoute(route);
}

export async function createRoute(data: CreateRoutePayload): Promise<Route> {
  const route = await apiClient.post<BackendRoute>("/routes", toRouteApiPayload(data));
  return toRoute(route);
}

export async function updateRoute(id: string, data: Partial<CreateRoutePayload>): Promise<Route> {
  const route = await apiClient.patch<BackendRoute>(`/routes/${id}`, toRouteApiPayload({
    route_code: data.route_code || "",
    origin: data.origin || "",
    destination: data.destination || "",
    distance_km: data.distance_km ?? 0,
    status: data.status || "active",
  }));
  return toRoute(route);
}

export async function deleteRoute(id: string): Promise<void> {
  return apiClient.delete(`/routes/${id}`);
}

export async function searchRoutes(query: string): Promise<Route[]> {
  const page = await apiClient.get<PaginatedData<BackendRoute>>(
    `/routes/public/search?query=${encodeURIComponent(query)}`
  );
  return page.items.map(toRoute);
}
