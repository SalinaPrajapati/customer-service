import { useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../../api/services/bookingService";
import { ErrorState, Skeleton } from "../../components/AsyncState";
import { useAsync } from "../../hooks/useAsync";
import type { Booking } from "../../types/domain";
import { Badge, Button, Card } from "../../components/ui";

export const MyBookings = () => {
  const request = useAsync<Booking[]>();
  const load = () => request.execute(() => bookingService.listBookings());
  useEffect(() => {
    load();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <Badge>Your schedule</Badge>
        <h1>My bookings</h1>
        <p>Everything you have planned in one place.</p>
      </div>
      {request.loading && (
        <div className="booking-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="skeleton-card">
              <div>
                <Skeleton className="skeleton-badge" />
                <Skeleton className="skeleton-text" style={{ width: "40%" }} />
                <Skeleton className="skeleton-title" />
              </div>
              <Skeleton className="skeleton-text" style={{ width: 60 }} />
            </Card>
          ))}
        </div>
      )}
      {!request.loading && request.error && (
        <ErrorState message={request.error.message} retry={load} />
      )}
      {!request.loading && !request.error && !request.data?.length && (
        <Card className="empty-state">
          <span className="empty-state-icon">📅</span>
          <h2>No bookings yet</h2>
          <p className="muted">
            Once you book a service, it'll show up here with all the details.
          </p>
          <Link to="/">
            <Button>Browse services</Button>
          </Link>
        </Card>
      )}
      {!request.loading && !request.error && !!request.data?.length && (
        <div className="booking-list">
          {request.data.map((booking) => (
            <Link key={booking.id} to={`/bookings/${booking.id}`}>
              <Card>
                <div>
                  <Badge className="status">{booking.status}</Badge>
                  <p className="eyebrow">{booking.bookingNumber}</p>
                  <h2 className="text-color">{booking.service.name}</h2>
                  <p className="muted">{booking.service.provider}</p>
                </div>
                <div className="booking-date">
                  <strong>
                    {new Date(booking.scheduledAt).toLocaleDateString(
                      undefined,
                      { month: "short", day: "numeric" },
                    )}
                  </strong>
                  <span>
                    {new Date(booking.scheduledAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="booking-address">
                  ⌖ {booking.address.label}, {booking.address.line1}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
