export type Role = "admin" | "member";

export interface User {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: Role;
}

export interface Spot {
  _id: string;
  spotNumber: string;
  zone: string;
  spotSize: string;
  locationDescription: string;
  rentalFee: number;
  isActive?: boolean;
}

export interface SpotInput {
  spotNumber: string;
  zone: string;
  spotSize: string;
  locationDescription: string;
  rentalFee: number;
}

export interface Booking {
  _id: string;
  spot: Spot | null;
  user: User | null;
  bookingDate: string;
  productType: string;
  createdAt: string;
}

export interface BookingInput {
  spot: string;
  bookingDate: string;
  productType: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  error?: string;
}
