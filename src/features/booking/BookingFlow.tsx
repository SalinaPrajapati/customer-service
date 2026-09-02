import { useEffect, useState } from "react";
import { bookingService } from "../../api/services/bookingService";
import { ErrorState, Skeleton } from "../../components/AsyncState";
import { useAsync } from "../../hooks/useAsync";
import type { Address, Booking, Service, Slot } from "../../types/domain";
import { Badge, Button, Card, Input } from "../../components/ui";

export const BookingFlow = ({
  service,
  onComplete,
  onBack,
}: {
  service: Service;
  onComplete: (booking: Booking) => void;
  onBack: () => void;
}) => {
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState("");
  const [addressId, setAddressId] = useState("");
  const availability = useAsync<Slot[]>();
  const addressRequest = useAsync<Address[]>();
  const create = useAsync<Booking>();
  useEffect(() => {
    addressRequest.execute(() => bookingService.getAddresses());
  }, []);
  useEffect(() => {
    setSlotId("");
    if (date)
      availability.execute(() =>
        bookingService.getAvailability(service.id, date),
      );
  }, [date, service.id]);
  const confirm = async () => {
    const booking = await create.execute(() =>
      bookingService.createBooking({
        serviceId: service.id,
        date,
        slotId,
        addressId,
      }),
    );
    if (booking) onComplete(booking);
  };
  return (
    <section>
      <Button variant="ghost" className="back" onClick={onBack}>
        ← All services
      </Button>
      <div className="booking-layout">
        <div>
          <Badge>{service.category}</Badge>
          <h1>{service.name}</h1>
          <p className="lead">{service.description}</p>
          <div className="service-meta">
            <span>✦ {service.provider}</span>
            <span>★ {service.rating} rating</span>
            <span>{service.durationMinutes} min</span>
          </div>
          <h2>When should we come by?</h2>
          <label>
            Date{" "}
            <Input
              aria-label="Booking date"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          {availability.loading && (
            <div className="slots">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="skeleton-slot" />
              ))}
            </div>
          )}
          {availability.data && (
            <div className="slots">
              {availability.data.map((slot) => (
                <Button
                  variant="outline"
                  key={slot.id}
                  disabled={!slot.available}
                  className={slotId === slot.id ? "selected" : ""}
                  onClick={() => setSlotId(slot.id)}
                >
                  {slot.startTime}
                </Button>
              ))}
            </div>
          )}
          <h2>Where should we meet?</h2>
          {addressRequest.data?.map((address) => (
            <label className="address" key={address.id}>
              <input
                type="radio"
                name="address"
                checked={addressId === address.id}
                onChange={() => setAddressId(address.id)}
              />
              <span>
                <b>{address.label}</b>
                <small>
                  {address.line1}, {address.city}
                </small>
              </span>
            </label>
          ))}
        </div>
        <aside className="summary">
          <p className="eyebrow">Booking summary</p>
          <h2>{service.name}</h2>
          <p className="muted">with {service.provider}</p>
          <hr />
          <p>
            {date || "Choose a date"}{" "}
            {slotId && ` · ${slotId.split("-").at(-1)}`}
          </p>
          <div className="summary-total">
            <span>Total</span>
            <strong>
              ${service.price} {service.currency}
            </strong>
          </div>
          {create.error && <ErrorState message={create.error.message} />}
          {create.error?.fields && (
            <ul>
              {Object.values(create.error.fields).map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
          <Button disabled={create.loading} onClick={confirm}>
            {create.loading ? "Confirming…" : "Confirm booking"}
          </Button>
        </aside>
      </div>
    </section>
  );
};
