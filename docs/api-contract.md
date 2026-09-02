# API contract

All responses are JSON. Error responses use `{ "code": string, "message": string, "fields"?: Record<string,string> }`. While a request is pending, UI disables duplicate submit actions and displays a loading state. Empty successful collections display a purpose-specific empty state; non-2xx responses display an error and retry where safe.

| Endpoint | Method | Purpose, parameters, and successful body | Statuses / behavior |
|---|---|---|---|
| `/api/v1/services` | GET | Discover services. Optional query: `search`, `category`. Returns `Service[]`, with `id`, name, description, category, provider, price, currency, durationMinutes, rating, availability. | 200 (including `[]` empty), 500 `INTERNAL_ERROR`. List shows loading, empty message, or retryable error. |
| `/api/v1/services/{service_id}` | GET | Return one `Service`; path id is required. | 200, 404 `SERVICE_NOT_FOUND`. Details show loading/error. |
| `/api/v1/services/{service_id}/availability` | GET | Query `date=YYYY-MM-DD`; returns `Slot[]` `{id,startTime,available}`. | 200, 404 service missing, 422 `VALIDATION_ERROR` with `fields.date`. Slots load after date selection. |
| `/api/v1/bookings` | POST | Creates a booking. Body: `{serviceId,date,slotId,addressId}`. Returns `Booking` with id, bookingNumber, service, scheduledAt, address, status, total, currency. | 201, 422 validation (`fields` identifies input), 409 `SLOT_UNAVAILABLE`, 500. Confirm button is disabled during request; errors retain form values. |
| `/api/v1/bookings` | GET | Returns `Booking[]`. | 200 (including `[]`), 500. My Bookings has loading, empty, and retry state. |
| `/api/v1/bookings/{booking_id}` | GET | Return a single `Booking`; path id required. | 200, 404 `BOOKING_NOT_FOUND`, 500. |

Example validation response: `{ "code":"VALIDATION_ERROR", "message":"Please complete the booking form.", "fields":{"date":"Date is required."} }`. Example business response: `{ "code":"SLOT_UNAVAILABLE", "message":"That time was just booked. Please choose another slot." }`.
