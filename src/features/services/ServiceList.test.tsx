import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { ServiceList } from "./ServiceList";
import { bookingService } from "../../api/services/bookingService";



vi.mock("../../api/services/bookingService", () => ({
  bookingService: { listServices: vi.fn() },
}));
beforeEach(() => vi.clearAllMocks());
it("renders services returned by the API", async () => {
  vi.mocked(bookingService.listServices).mockResolvedValue([
    {
      id: "one",
      name: "Window cleaning",
      description: "Clean windows",
      category: "Home",
      provider: "Acme",
      price: 12,
      currency: "USD",
      durationMinutes: 30,
      rating: 5,
      availability: "Available",
    },
  ]);
  render(<ServiceList onSelect={vi.fn()} />);
  expect(await screen.findByText("Window cleaning")).toBeInTheDocument();
});
it("renders an API error with retry action", async () => {
  vi.mocked(bookingService.listServices).mockRejectedValue({
    message: "Network unavailable",
  });
  render(<ServiceList onSelect={vi.fn()} />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Network unavailable",
  );
});
