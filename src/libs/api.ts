import { ApiResponse, Booking, BookingInput, Spot, SpotInput, User } from "@/interface";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({ success: false, error: res.statusText }));
  if (!res.ok || !json.success) {
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json;
}

export interface AuthData {
  id: string;
  name: string;
  email: string;
  role: User["role"];
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  tel: string;
  role: User["role"];
  password: string;
}

export const login = (email: string, password: string) =>
  request<AuthData>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const register = (input: RegisterInput) =>
  request<AuthData>("/auth/register", { method: "POST", body: JSON.stringify(input) });

export const getMe = (token: string) => request<User>("/auth/me", {}, token);

export const logout = (token: string) => request<object>("/auth/logout", {}, token);

export const getSpots = () => request<Spot[]>("/spots");

export const getSpot = (id: string) => request<Spot>(`/spots/${id}`);

export const createSpot = (input: SpotInput, token: string) =>
  request<Spot>("/spots", { method: "POST", body: JSON.stringify(input) }, token);

export const updateSpot = (id: string, input: SpotInput, token: string) =>
  request<Spot>(`/spots/${id}`, { method: "PUT", body: JSON.stringify(input) }, token);

export const deleteSpot = (id: string, token: string) =>
  request<object>(`/spots/${id}`, { method: "DELETE" }, token);

export const getBookings = (token: string) => request<Booking[]>("/bookings", {}, token);

export const getBooking = (id: string, token: string) => request<Booking>(`/bookings/${id}`, {}, token);

export const createBooking = (input: BookingInput, token: string) =>
  request<Booking>("/bookings", { method: "POST", body: JSON.stringify(input) }, token);

export const updateBooking = (id: string, input: BookingInput, token: string) =>
  request<Booking>(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(input) }, token);

export const deleteBooking = (id: string, token: string) =>
  request<object>(`/bookings/${id}`, { method: "DELETE" }, token);

export const todayUTC = () => new Date().toISOString().slice(0, 10);

export const formatDate = (iso: string) => iso.slice(0, 10);
