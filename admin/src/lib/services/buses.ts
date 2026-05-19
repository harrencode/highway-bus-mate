import { apiClient, type PaginatedData } from "../api";

// Types for Buses
export interface Bus {
  id: string;
  bus_number: string;
  bus_type: "AC" | "Semi-Luxury" | "Super Luxury" | "Luxury" | "Normal";
  route_id: string;
  route_name: string;
  operator_name: string;
  phone: string;
  total_seats: number;
  available_seats: number;
  departure_times: string[];
  status: "active" | "inactive" | "maintenance" | "pending";
}

export interface CreateBusPayload {
  bus_number: string;
  bus_type: string;
  route_id: string;
  operator_name: string;
  phone: string;
  total_seats: number;
  departure_times?: string[];
}

interface BackendBus {
  id: number;
  registration_no: string;
  operator_name: string;
  operator_phone: string | null;
  bus_type: "normal" | "semi_luxury" | "luxury" | "super_luxury" | "ac_express";
  total_seats: number;
  status: string;
}

interface BusApiPayload {
  registration_no: string;
  operator_name: string;
  operator_phone: string | null;
  bus_type: BackendBus["bus_type"];
  total_seats: number;
}

const busTypeLabels: Record<BackendBus["bus_type"], Bus["bus_type"]> = {
  normal: "Normal",
  semi_luxury: "Semi-Luxury",
  luxury: "Luxury",
  super_luxury: "Super Luxury",
  ac_express: "AC",
};

const busTypeValues: Record<string, BackendBus["bus_type"]> = {
  Normal: "normal",
  "Semi-Luxury": "semi_luxury",
  Luxury: "luxury",
  "Super Luxury": "super_luxury",
  AC: "ac_express",
};

function toBus(bus: BackendBus): Bus {
  return {
    id: String(bus.id),
    bus_number: bus.registration_no,
    bus_type: busTypeLabels[bus.bus_type] || "Normal",
    route_id: "",
    route_name: "",
    operator_name: bus.operator_name,
    phone: bus.operator_phone || "",
    total_seats: bus.total_seats,
    available_seats: bus.total_seats,
    departure_times: [],
    status: bus.status === "active" ? "active" : bus.status === "inactive" ? "inactive" : "pending",
  };
}

function toBusApiPayload(data: CreateBusPayload): BusApiPayload {
  return {
    registration_no: data.bus_number,
    operator_name: data.operator_name,
    operator_phone: data.phone || null,
    bus_type: busTypeValues[data.bus_type] || "normal",
    total_seats: Number.isFinite(data.total_seats) ? data.total_seats : 1,
  };
}

// Bus API calls
export async function getBuses(
  limit: number = 100,
  offset: number = 0,
  status?: string
): Promise<Bus[]> {
  let url = `/buses?limit=${limit}&skip=${offset}`;
  if (status) url += `&status=${status}`;
  const page = await apiClient.get<PaginatedData<BackendBus>>(url);
  return page.items.map(toBus);
}

export async function getBus(id: string): Promise<Bus> {
  const bus = await apiClient.get<BackendBus>(`/buses/${id}`);
  return toBus(bus);
}

export async function createBus(data: CreateBusPayload): Promise<Bus> {
  const bus = await apiClient.post<BackendBus>("/buses", toBusApiPayload(data));
  return toBus(bus);
}

export async function updateBus(id: string, data: Partial<CreateBusPayload>): Promise<Bus> {
  const bus = await apiClient.patch<BackendBus>(
    `/buses/${id}`,
    toBusApiPayload({
      bus_number: data.bus_number || "",
      bus_type: data.bus_type || "Normal",
      route_id: data.route_id || "",
      operator_name: data.operator_name || "",
      phone: data.phone || "",
      total_seats: data.total_seats ?? 1,
      departure_times: data.departure_times,
    })
  );
  return toBus(bus);
}

export async function deleteBus(id: string): Promise<void> {
  return apiClient.delete(`/buses/${id}`);
}

export async function approveBus(id: string): Promise<Bus> {
  const bus = await apiClient.patch<BackendBus>(`/buses/${id}`, { status: "active" });
  return toBus(bus);
}

export async function rejectBus(id: string): Promise<void> {
  return apiClient.post(`/buses/${id}/reject`, {});
}
