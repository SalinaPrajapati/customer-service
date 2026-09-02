import { useNavigate } from "react-router-dom";
import { ServiceList } from "../features/services/ServiceList";

export const ServicesPage = () => {
  const navigate = useNavigate();
  return (
    <ServiceList onSelect={(service) => navigate(`/services/${service.id}`)} />
  );
};
