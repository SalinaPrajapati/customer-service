import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { BookingFlow } from "./BookingFlow";
import { bookingService } from "../../api/services/bookingService";
import type { Service } from "../../types/domain";


vi.mock("../../api/services/bookingService", () => ({
  bookingService: {
    getAddresses: vi.fn(),
    getAvailability: vi.fn(),
    createBooking: vi.fn(),
  },
}));
const service: Service = {
  id: "cleaning",
  name: "Cleaning",
  description: "Desc",
  category: "Home",
  provider: "Acme",
  price: 10,
  currency: "USD",
  durationMinutes: 30,
  rating: 4.5,
  availability: "Available",
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(bookingService.getAddresses).mockResolvedValue([
    { id: "home", label: "Home", line1: "1 Main", city: "SF" },
  ]);
});
it("shows validation errors returned by booking API", async () => {
  vi.mocked(bookingService.createBooking).mockRejectedValue({
    message: "Please complete the booking form.",
    fields: { date: "Date is required." },
  });
  const user = userEvent.setup();
  render(
    <BookingFlow service={service} onBack={vi.fn()} onComplete={vi.fn()} />,
  );
  await user.click(screen.getByRole("button", { name: "Confirm booking" }));
  expect(await screen.findByText("Date is required.")).toBeInTheDocument();
});
it("completes a successful booking", async () => {
  vi.mocked(bookingService.getAvailability).mockResolvedValue([
    { id: "2030-05-20-09:00", startTime: "09:00", available: true },
  ]);
  vi.mocked(bookingService.createBooking).mockResolvedValue({
    id: "b",
    bookingNumber: "DMP-1",
    service: { id: "cleaning", name: "Cleaning", provider: "Acme" },
    scheduledAt: "2030-05-20T09:00:00",
    address: { id: "home", label: "Home", line1: "1 Main", city: "SF" },
    status: "CONFIRMED",
    total: 10,
    currency: "USD",
  });
  const done = vi.fn();
  const user = userEvent.setup();
  render(<BookingFlow service={service} onBack={vi.fn()} onComplete={done} />);
  fireEvent.change(screen.getByLabelText("Booking date"), {
    target: { value: "2030-05-20" },
  });
  await user.click(await screen.findByText("09:00"));
  await user.click(screen.getByRole("radio"));
  await user.click(screen.getByRole("button", { name: "Confirm booking" }));
  expect(done).toHaveBeenCalledWith(
    expect.objectContaining({ bookingNumber: "DMP-1" }),
  );
});
