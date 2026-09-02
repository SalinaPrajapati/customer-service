import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { bookingService } from "../api/services/bookingService";
import { ErrorState, Skeleton } from "../components/AsyncState";
import { Badge, Button, Card } from "../components/ui";
import { useAsync } from "../hooks/useAsync";
import type { Booking } from "../types/domain";

export const BookingConfirmationPage = () => {
  const { bookingId = "" } = useParams();
  const { data: booking, error, loading, execute } = useAsync<Booking>();

  useEffect(() => {
    execute(() => bookingService.getBooking(bookingId));
  }, [bookingId]);

  if (loading)
    return (
      <section>
        <Card className="skeleton-card">
          <Skeleton className="skeleton-badge" />
          <Skeleton className="skeleton-title" style={{ height: 32 }} />
          <Skeleton className="skeleton-line" style={{ width: "60%" }} />
          <Skeleton className="skeleton-line" style={{ width: "40%" }} />
        </Card>
      </section>
    );
  if (error || !booking)
    return (
      <ErrorState
        message={error?.message ?? "Booking not found."}
        retry={() => execute(() => bookingService.getBooking(bookingId))}
      />
    );

  return (
    <section>
      <Card>
        <Badge>Booking confirmed</Badge>
        <h1>You're all set, it's booked.</h1>
        <p className="eyebrow">{booking.bookingNumber}</p>
        <p className="muted">
          {booking.service.name} with {booking.service.provider}
        </p>
        <p>
          {new Date(booking.scheduledAt).toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
        <div className="page-actions">
          <Link to="/bookings">
            <Button>View my bookings</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Book another service</Button>
          </Link>
        </div>
      </Card>
    </section>
  );
};
