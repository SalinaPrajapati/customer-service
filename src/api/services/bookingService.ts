/** Application-facing facade: swap mockApi for an HTTP implementation without changing features. */
import {
  mockApi,
  type CreateBookingRequest,
  type ServiceQuery,
} from "../mock/mockApi";

export const bookingService = {
  listServices: (q?: ServiceQuery) => mockApi.listServices(q),
  getService: (id: string) => mockApi.getService(id),
  getAvailability: (id: string, date: string) =>
    mockApi.getAvailability(id, date),
  getAddresses: () => mockApi.getAddresses(),
  createBooking: (request: CreateBookingRequest) =>
    mockApi.createBooking(request),
  listBookings: () => mockApi.listBookings(),
  getBooking: (id: string) => mockApi.getBooking(id),
};
