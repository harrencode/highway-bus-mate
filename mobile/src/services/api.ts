// ============ TYPES ============

export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T> {
  data: T | null;
  status: ApiStatus;
  message?: string;
  error_code?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  skip?: number;
  limit?: number;
}

// Auth Types
export interface UserLogin {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TokenRefresh {
  refresh_token: string;
}

export interface UserResponse {
  id: number;
  username: string;
  full_name?: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
}

// Route Types
export interface RouteResponse {
  id: number;
  origin: string;
  destination: string;
  province_origin?: string;
  province_destination?: string;
  estimated_minutes?: number;
}

// Bus Types
export interface BusResponse {
  id: number;
  registration_no: string;
  operator_name: string;
  operator_phone?: string;
  bus_type: 'normal' | 'semi_luxury' | 'luxury' | 'super_luxury' | 'ac_express';
  total_seats: number;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
}

// Trip Types
export interface TripResponse {
  id: number;
  schedule_id: number;
  trip_date: string;
  available_seats: number;
  status: 'scheduled' | 'boarding' | 'departed' | 'completed' | 'cancelled';
  created_at: string;
}

// Seat Types
export interface SeatResponse {
  id: number;
  trip_id: number;
  seat_number: string;
  status: 'AVAILABLE' | 'BOOKED' | 'RESERVED';
  booked_by?: number;
}

// Booking Types
export interface BookingCreate {
  trip_id: number;
  seat_ids: number[];
  total_fare: number;
}

export interface BookingResponse {
  id: number;
  user_id: number;
  trip_id: number;
  booking_ref: string;
  total_fare: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  booked_at: string;
  cancelled_at?: string;
}

// Ticket Types
export interface TicketResponse {
  id: number;
  booking_id: number;
  ticket_number: string;
  qr_code: string;
  created_at: string;
}

// Payment Types
export interface PaymentCreate {
  booking_id: number;
  amount: number;
  method: string;
}

export interface PaymentResponse {
  id: number;
  booking_id: number;
  amount: string;
  method: string;
  status: string;
  created_at: string;
}

// Contribution Types
export interface ContributionCreate {
  type: 'new_route' | 'new_bus' | 'update_bus_info' | 'update_route_info';
  payload: Record<string, any>;
  notes?: string;
}

export interface ContributionResponse {
  id: number;
  submitted_by: number;
  reviewed_by?: number;
  type: 'new_route' | 'new_bus' | 'update_bus_info' | 'update_route_info';
  payload: Record<string, any>;
  notes?: string;
  status: 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  submitted_at: string;
  reviewed_at?: string;
}

// ============ API CLIENT ============

class ApiClient {
  private baseURL: string;
  private token: string = '';

  constructor() {
    const base = (
      process.env.EXPO_PUBLIC_API_BASE_URL ||
      process.env.EXPO_PUBLIC_BASE_URL ||
      'http://10.0.2.2:8000'
    ).replace(/\/$/, '');
    this.baseURL = base.endsWith('/api/v1') ? base : `${base}/api/v1`;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = '';
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any,
  ): Promise<T> {
    const url = `${this.baseURL}${path}`;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || `Request failed with ${response.status}`);
      }

      return data.data as T;
    } catch (error) {
      throw error;
    }
  }

  // ============ AUTH ============

  async login(username: string, password: string): Promise<Token> {
    return this.request('POST', '/auth/login', { username, password });
  }

  async refreshToken(refreshToken: string): Promise<Token> {
    return this.request('POST', '/auth/refresh', { refresh_token: refreshToken });
  }

  async logout(): Promise<void> {
    await this.request('POST', '/auth/logout', {});
  }

  async register(username: string, email: string, password: string, fullName?: string): Promise<UserResponse> {
    return this.request('POST', '/users/register', { username, email, password, full_name: fullName });
  }

  // ============ ROUTES ============

  async searchRoutes(query: string, skip = 0, limit = 100): Promise<PaginatedData<RouteResponse>> {
    return this.request('GET', `/routes/public/search?query=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
  }

  // ============ BUSES ============

  async searchBuses(query: string, skip = 0, limit = 100): Promise<PaginatedData<BusResponse>> {
    return this.request('GET', `/buses/public/search?query=${encodeURIComponent(query)}&skip=${skip}&limit=${limit}`);
  }

  // ============ TRIPS ============

  async searchTrips(tripDate?: string, skip = 0, limit = 100): Promise<PaginatedData<TripResponse>> {
    let path = `/trips/public/search?skip=${skip}&limit=${limit}`;
    if (tripDate) {
      path += `&trip_date=${encodeURIComponent(tripDate)}`;
    }
    return this.request('GET', path);
  }

  // ============ SEATS ============

  async getSeatsForTrip(tripId: number, skip = 0, limit = 100): Promise<PaginatedData<SeatResponse>> {
    return this.request('GET', `/seats/public/trip/${tripId}?skip=${skip}&limit=${limit}`);
  }

  // ============ BOOKINGS ============

  async createBooking(body: BookingCreate): Promise<BookingResponse> {
    return this.request('POST', '/bookings/me', body);
  }

  async listMyBookings(): Promise<BookingResponse[]> {
    return this.request('GET', '/bookings/me');
  }

  async getBooking(bookingId: number): Promise<BookingResponse> {
    return this.request('GET', `/bookings/${bookingId}`);
  }

  // ============ TICKETS ============

  async getTicketForBooking(bookingId: number): Promise<TicketResponse> {
    return this.request('GET', `/tickets?booking_id=${bookingId}`);
  }

  // ============ PAYMENTS ============

  async createPayment(body: PaymentCreate): Promise<PaymentResponse> {
    return this.request('POST', '/payments', body);
  }

  // ============ CONTRIBUTIONS ============

  async submitContribution(body: ContributionCreate): Promise<any> {
    return this.request('POST', '/contributions/me', body);
  }

  // ============ USERS ============

  async getCurrentUser(): Promise<UserResponse> {
    return this.request('GET', '/users/me');
  }
}

export const apiClient = new ApiClient();
