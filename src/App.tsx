import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./pages/AppLayout";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";
import { BookingDetailsPage } from "./pages/BookingDetailsPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { ServiceBookingPage } from "./pages/ServiceBookingPage";
import { ServicesPage } from "./pages/ServicesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ServicesPage />} />
          <Route path="services/:serviceId" element={<ServiceBookingPage />} />
          <Route path="bookings" element={<MyBookingsPage />} />
          <Route path="bookings/:bookingId" element={<BookingDetailsPage />} />
          <Route
            path="bookings/:bookingId/confirmed"
            element={<BookingConfirmationPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
