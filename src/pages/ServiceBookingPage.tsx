import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookingService } from "../api/services/bookingService";
import { ErrorState, Skeleton } from "../components/AsyncState";
import { Card } from "../components/ui";
import { BookingFlow } from "../features/booking/BookingFlow";
import { useAsync } from "../hooks/useAsync";
import type { Service } from "../types/domain";

export const ServiceBookingPage = () => {
  const { serviceId = "" } = useParams();
  const navigate = useNavigate();
  const { data: service, error, loading, execute } = useAsync<Service>();

  useEffect(() => {
    execute(() => bookingService.getService(serviceId));
  }, [serviceId]);

  if (loading)
    return (
      <section>
        <div className="booking-layout">
          <div>
            <Skeleton className="skeleton-badge" />
            <Skeleton className="skeleton-title" style={{ height: 40 }} />
            <Skeleton className="skeleton-text" />
            <Skeleton className="skeleton-text" style={{ width: "60%" }} />
          </div>
          <Card className="summary skeleton-card">
            <Skeleton className="skeleton-text" style={{ width: "50%" }} />
            <Skeleton className="skeleton-title" />
            <Skeleton className="skeleton-button" style={{ width: "100%" }} />
          </Card>
        </div>
      </section>
    );
  if (error || !service)
    return (
      <ErrorState
        message={error?.message ?? "Service not found."}
        retry={() => execute(() => bookingService.getService(serviceId))}
      />
    );

  return (
    <BookingFlow
      service={service}
      onBack={() => navigate("/")}
      onComplete={(booking) => navigate(`/bookings/${booking.id}/confirmed`)}
    />
  );
};
