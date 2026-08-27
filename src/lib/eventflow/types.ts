export type CategoryId =
  | "venue"
  | "catering"
  | "guests"
  | "marketing"
  | "logistics"
  | "budget";

export type Category = {
  id: CategoryId;
  label: string;
  emoji: string;
  chart: string;
};

export const CATEGORIES: Category[] = [
  { id: "venue", label: "Venue", emoji: "🏛", chart: "var(--chart-1)" },
  { id: "catering", label: "Catering", emoji: "🍽", chart: "var(--chart-2)" },
  { id: "guests", label: "Guests", emoji: "👥", chart: "var(--chart-3)" },
  { id: "marketing", label: "Marketing", emoji: "📣", chart: "var(--chart-4)" },
  { id: "logistics", label: "Logistics", emoji: "🚚", chart: "var(--chart-5)" },
  { id: "budget", label: "Budget", emoji: "💰", chart: "var(--chart-1)" },
];

const FALLBACK: Category = {
  id: "venue",
  label: "Venue",
  emoji: "🏛",
  chart: "var(--chart-1)",
};

export const categoryById = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id) ?? FALLBACK;

export type Task = {
  id: string;
  eventId: string;
  name: string;
  category: CategoryId;
  dueDate: string; // yyyy-mm-dd
  notes?: string;
  completed: boolean;
  createdAt: string;
};

export type EventItem = {
  id: string;
  name: string;
  date: string; // yyyy-mm-dd
  location: string;
  description: string;
  image?: string;
};

export type Theme = "light" | "dark";
