import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { bookingService } from "../api/services/bookingService";
import { ErrorState, Skeleton } from "../components/AsyncState";
import { Badge, Button, Card } from "../components/ui";
import { useAsync } from "../hooks/useAsync";
import type { Booking } from "../types/domain";

export const BookingDetailsPage = () => {
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
          <Skeleton className="skeleton-text" style={{ width: "40%" }} />
          <Skeleton className="skeleton-title" style={{ height: 32 }} />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line" style={{ width: "70%" }} />
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
      <Link to="/bookings">
        <Button variant="ghost" className="back">
          ← My bookings
        </Button>
      </Link>
      <Card>
        <Badge className="status">{booking.status}</Badge>
        <p className="eyebrow">{booking.bookingNumber}</p>
        <h1>{booking.service.name}</h1>
        <p className="muted">with {booking.service.provider}</p>
        <hr />
        <p>
          {new Date(booking.scheduledAt).toLocaleString(undefined, {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
        <p className="booking-address">
          ⌖ {booking.address.label}, {booking.address.line1},{" "}
          {booking.address.city}
        </p>
        <div className="summary-total">
          <span>Total</span>
          <strong>
            ${booking.total} {booking.currency}
          </strong>
        </div>
      </Card>
    </section>
  );
};
