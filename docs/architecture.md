# Architecture

The app is a small React single-page flow. `features/` owns screen-level state and orchestration; `components/` holds reusable presentation states; `hooks/` owns generic async lifecycle behavior; and `types/` holds shared domain contracts.

`api/services/bookingService.ts` is the only boundary consumed by features. Today it delegates to the promise-based mock adapter in `api/mock/`; a future HTTP adapter can preserve the facade methods and domain types. `api/client/` normalizes technical failures into a consistent `ApiClientError` shape.

The mock data is deliberately outside components. It applies availability and conflict rules, while components only render results and send user intent. Local `useAsync` state keeps requests isolated by screen: loading, data, and normalized errors are always handled together. Features render loading, empty, retryable error, and successful states explicitly.

```
src/api       transport adapters, facade, mock data/rules
src/features  service discovery, booking, bookings screens
src/components reusable state UI
src/hooks     generic state mechanics
src/types     API/domain types
```
