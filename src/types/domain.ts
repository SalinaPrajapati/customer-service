export type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  price: number;
  currency: "USD";
  durationMinutes: number;
  rating: number;
  availability: "Available" | "Limited";
};

export type Slot = { id: string; startTime: string; available: boolean };

export type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
};

export type BookingStatus = "CONFIRMED" | "PENDING";

export type Booking = {
  id: string;
  bookingNumber: string;
  service: Pick<Service, "id" | "name" | "provider">;
  scheduledAt: string;
  address: Address;
  status: BookingStatus;
  total: number;
  currency: string;
};

export type ApiError = {
  status: number;
  code: string;
  message: string;
  fields?: Record<string, string>;
};
