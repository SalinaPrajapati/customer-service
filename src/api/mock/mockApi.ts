import { ApiClientError, delay } from "../client/apiClient";
import { addresses, bookings, services } from "./data";
import type { Booking, Service, Slot } from "../../types/domain";

export type ServiceQuery = {
  search?: string;
  category?: string;
  scenario?: "empty" | "error";
};
export type CreateBookingRequest = {
  serviceId: string;
  date: string;
  slotId: string;
  addressId: string;
};
const slots = ["09:00", "11:00", "14:00", "16:00"];
const fail = (
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string>,
): never => {
  throw new ApiClientError(status, code, message, fields);
};

export const mockApi = {
  async listServices(query: ServiceQuery = {}): Promise<Service[]> {
    await delay();
    if (query.scenario === "error")
      fail(500, "INTERNAL_ERROR", "We could not load services. Please retry.");
    if (query.scenario === "empty") return [];
    const term = query.search?.trim().toLowerCase();
    return services.filter(
      (service) =>
        (!term ||
          `${service.name} ${service.description}`
            .toLowerCase()
            .includes(term)) &&
        (!query.category || service.category === query.category),
    );
  },
  async getService(id: string) {
    await delay();
    return (
      services.find((service) => service.id === id) ??
      fail(404, "SERVICE_NOT_FOUND", "This service is no longer available.")
    );
  },
  async getAvailability(serviceId: string, date: string): Promise<Slot[]> {
    await delay();
    if (!services.some((s) => s.id === serviceId))
      fail(404, "SERVICE_NOT_FOUND", "Service not found.");
    if (!date)
      fail(422, "VALIDATION_ERROR", "Choose a date.", {
        date: "Date is required.",
      });
    return slots.map((startTime) => ({
      id: `${date}-${startTime}`,
      startTime,
      available: !bookings.some(
        (b) =>
          b.service.id === serviceId &&
          b.scheduledAt === `${date}T${startTime}:00`,
      ),
    }));
  },
  async getAddresses() {
    await delay(120);
    return addresses;
  },
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    await delay();
    const fields: Record<string, string> = {};
    if (!request.serviceId) fields.serviceId = "Service is required.";
    if (!request.date) fields.date = "Date is required.";
    if (!request.slotId) fields.slotId = "Time slot is required.";
    if (!request.addressId) fields.addressId = "Address is required.";
    if (Object.keys(fields).length)
      fail(
        422,
        "VALIDATION_ERROR",
        "Please complete the booking form.",
        fields,
      );
    const service = services.find((s) => s.id === request.serviceId);
    const address = addresses.find((a) => a.id === request.addressId);
    if (!service || !address)
      return fail(
        422,
        "VALIDATION_ERROR",
        "The selected service or address is invalid.",
      );
    const scheduledAt = `${request.date}T${request.slotId.split("-").at(-1)}:00`;
    if (
      bookings.some(
        (b) => b.service.id === service.id && b.scheduledAt === scheduledAt,
      )
    )
      fail(
        409,
        "SLOT_UNAVAILABLE",
        "That time was just booked. Please choose another slot.",
      );
    const booking: Booking = {
      id: crypto.randomUUID(),
      bookingNumber: `DMP-${String(bookings.length + 1001)}`,
      service: {
        id: service.id,
        name: service.name,
        provider: service.provider,
      },
      scheduledAt,
      address,
      status: "CONFIRMED",
      total: service.price,
      currency: service.currency,
    };
    bookings.unshift(booking);
    return booking;
  },
  async listBookings() {
    await delay();
    return bookings;
  },
  async getBooking(id: string) {
    await delay();
    return (
      bookings.find((b) => b.id === id) ??
      fail(404, "BOOKING_NOT_FOUND", "Booking not found.")
    );
  },
};
