import type { Address, Booking, Service } from "../../types/domain";

export const services: Service[] = [
  {
    id: "cleaning",
    name: "Home Deep Cleaning",
    description: "A detailed, room-by-room clean for your home.",
    category: "Home care",
    provider: "Sparkle Co.",
    price: 89,
    currency: "USD",
    durationMinutes: 180,
    rating: 4.8,
    availability: "Available",
  },
  {
    id: "repair",
    name: "Appliance Repair Visit",
    description: "Diagnosis and repair for common household appliances.",
    category: "Repairs",
    provider: "FixRight",
    price: 65,
    currency: "USD",
    durationMinutes: 90,
    rating: 4.6,
    availability: "Limited",
  },
  {
    id: "beauty",
    name: "At-home Haircut",
    description: "Professional haircut in the comfort of your home.",
    category: "Beauty",
    provider: "Studio Mobile",
    price: 45,
    currency: "USD",
    durationMinutes: 60,
    rating: 4.9,
    availability: "Available",
  },
];

export const addresses: Address[] = [
  {
    id: "home",
    label: "Home",
    line1: "142 Market Street",
    city: "San Francisco",
  },
  {
    id: "office",
    label: "Office",
    line1: "75 Mission Street",
    city: "San Francisco",
  },
];

export let bookings: Booking[] = [];

export const resetMockData = () => {
  bookings = [];
};
