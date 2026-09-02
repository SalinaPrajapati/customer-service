import { beforeEach, describe, expect, it } from "vitest";
import { mockApi } from "./mockApi";
import { resetMockData } from "./data";

beforeEach(resetMockData);

describe("mock booking API", () => {
  it("lists services and supports search", async () =>
    expect(await mockApi.listServices({ search: "clean" })).toHaveLength(1));
  it("returns an empty result for a search with no matches", async () =>
    expect(await mockApi.listServices({ search: "zebra" })).toEqual([]));
  it("returns a structured server error", async () =>
    await expect(
      mockApi.listServices({ scenario: "error" }),
    ).rejects.toMatchObject({ status: 500, code: "INTERNAL_ERROR" }));
  it("validates incomplete bookings", async () =>
    await expect(
      mockApi.createBooking({
        serviceId: "",
        date: "",
        slotId: "",
        addressId: "",
      }),
    ).rejects.toMatchObject({
      status: 422,
      fields: { date: "Date is required." },
    }));
  it("creates a booking then rejects a conflicting slot", async () => {
    const request = {
      serviceId: "cleaning",
      date: "2030-05-20",
      slotId: "2030-05-20-09:00",
      addressId: "home",
    };
    await expect(mockApi.createBooking(request)).resolves.toMatchObject({
      status: "CONFIRMED",
    });
    await expect(mockApi.createBooking(request)).rejects.toMatchObject({
      status: 409,
      code: "SLOT_UNAVAILABLE",
    });
  });
});
