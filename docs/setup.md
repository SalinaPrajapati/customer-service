# Setup

Prerequisites: Node.js 20+ and npm.

Install with `npm install`, start the app with `npm run dev`, build with `npm run build`, and run the test suite with `npm test`.

No environment variables or separate mock-server process are required. The mock API runs in-browser as an adapter and simulates latency; replacing it with an HTTP client only requires changing `api/services/bookingService.ts`.
