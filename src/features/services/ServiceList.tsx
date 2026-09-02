import { useEffect, useMemo, useState } from "react";
import { bookingService } from "../../api/services/bookingService";
import { EmptyState, ErrorState, Skeleton } from "../../components/AsyncState";
import { useAsync } from "../../hooks/useAsync";
import type { Service } from "../../types/domain";
import { Badge, Button, Card, Input } from "../../components/ui";

export const ServiceList = ({
  onSelect,
}: {
  onSelect: (service: Service) => void;
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data, loading, error, execute } = useAsync<Service[]>();
  const load = () =>
    execute(() => bookingService.listServices({ search, category }));
  useEffect(() => {
    const timer = setTimeout(load, 180);
    return () => clearTimeout(timer);
  }, [search, category]);
  const categories = useMemo(
    () => [...new Set(data?.map((s) => s.category) ?? [])],
    [data],
  );
  return (
    <section>
      <div className="hero">
        <Badge>Trusted local experts</Badge>
        <h1>Make space for what matters.</h1>
        <p>
          Find a skilled professional, choose a time, and let us take care of
          the rest.
        </p>
      </div>
      <div className="filters">
        <Input
          aria-label="Search services"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="⌕  Search services"
        />
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {error && <ErrorState message={error.message} retry={load} />}
      {!loading && !error && data?.length === 0 && (
        <EmptyState>No services match your search.</EmptyState>
      )}
      <div className="grid">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="skeleton-card">
              <Skeleton className="skeleton-badge" />
              <Skeleton className="skeleton-title" />
              <Skeleton className="skeleton-text" />
              <Skeleton className="skeleton-text" style={{ width: "60%" }} />
              <div className="card-footer">
                <Skeleton className="skeleton-price" />
                <Skeleton className="skeleton-button" />
              </div>
            </Card>
          ))}
        {!loading &&
          data?.map((service) => (
          <Card key={service.id}>
            <Badge>{service.category}</Badge>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <p className="muted">
              {service.provider} <span>★ {service.rating}</span>
            </p>
            <div className="card-footer">
              <strong>
                ${service.price}
                <small> / visit</small>
              </strong>
              <Button variant="outline" onClick={() => onSelect(service)}>
                Details →
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
