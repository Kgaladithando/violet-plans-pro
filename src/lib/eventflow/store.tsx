import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EventItem, Task, Theme } from "./types";
import weddingImage from "@/assets/event-wedding.jpg";
import conferenceImage from "@/assets/event-conference.jpg";

const STORAGE_KEY = "eventflow.data.v1";
const THEME_KEY = "eventflow.theme";

const uid = () => Math.random().toString(36).slice(2, 10);

const seedEvents: EventItem[] = [
  {
    id: "evt-wedding",
    name: "Wedding Celebration",
    date: "2026-06-24",
    location: "Johannesburg",
    description:
      "An intimate garden ceremony followed by a long-table dinner for 120 guests.",
    image: weddingImage,
  },
  {
    id: "evt-summit",
    name: "Product Summit",
    date: "2026-09-10",
    location: "Cape Town",
    description: "A one-day summit for partners, press and the product community.",
    image: conferenceImage,
  },
];

const t = (
  eventId: string,
  name: string,
  category: Task["category"],
  dueDate: string,
  completed: boolean,
  notes = "",
): Task => ({
  id: uid(),
  eventId,
  name,
  category,
  dueDate,
  notes,
  completed,
  createdAt: new Date().toISOString(),
});

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const buildSeedTasks = (): Task[] => [
  t("evt-wedding", "Confirm catering headcount", "catering", today(), false, "Final numbers due to the chef."),
  t("evt-wedding", "Send invitations", "guests", today(), false),
  t("evt-wedding", "Book photographer", "marketing", today(), true),
  t("evt-wedding", "Confirm venue walkthrough", "venue", today(), false),
  t("evt-wedding", "Sign venue contract", "venue", inDays(3), true),
  t("evt-wedding", "Tasting session with chef", "catering", inDays(5), true),
  t("evt-wedding", "Order flowers", "logistics", inDays(6), false),
  t("evt-wedding", "Finalise seating chart", "guests", inDays(9), false),
  t("evt-wedding", "Approve budget spreadsheet", "budget", inDays(11), true),
  t("evt-wedding", "Arrange shuttle transport", "logistics", inDays(14), false),
  t("evt-wedding", "Design ceremony programme", "marketing", inDays(16), true),
  t("evt-wedding", "Reserve rehearsal dinner", "catering", inDays(20), true),
  t("evt-summit", "Lock keynote speakers", "marketing", inDays(4), false),
  t("evt-summit", "Confirm auditorium booking", "venue", inDays(8), true),
  t("evt-summit", "Open attendee registration", "guests", inDays(12), false),
  t("evt-summit", "Negotiate AV supplier", "logistics", inDays(18), false),
];

type Data = { events: EventItem[]; tasks: Task[]; currentEventId: string };

type Store = {
  ready: boolean;
  theme: Theme;
  toggleTheme: () => void;
  events: EventItem[];
  tasks: Task[];
  currentEventId: string;
  currentEvent: EventItem | undefined;
  setCurrentEventId: (id: string) => void;
  addTask: (input: Omit<Task, "id" | "createdAt" | "completed">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addEvent: (input: Omit<EventItem, "id">) => void;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function EventFlowProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [data, setData] = useState<Data>({
    events: seedEvents,
    tasks: [],
    currentEventId: seedEvents[0].id,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Data;
        if (parsed?.events?.length) setData(parsed);
        else setData({ events: seedEvents, tasks: buildSeedTasks(), currentEventId: seedEvents[0].id });
      } else {
        setData({ events: seedEvents, tasks: buildSeedTasks(), currentEventId: seedEvents[0].id });
      }
      const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
      const next =
        storedTheme ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setTheme(next);
    } catch {
      setData({ events: seedEvents, tasks: buildSeedTasks(), currentEventId: seedEvents[0].id });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (ready) localStorage.setItem(THEME_KEY, theme);
  }, [theme, ready]);

  const patchData = useCallback((fn: (d: Data) => Data) => setData((d) => fn(d)), []);

  const value = useMemo<Store>(
    () => ({
      ready,
      theme,
      toggleTheme: () => setTheme((v) => (v === "dark" ? "light" : "dark")),
      events: data.events,
      tasks: data.tasks,
      currentEventId: data.currentEventId,
      currentEvent: data.events.find((e) => e.id === data.currentEventId) ?? data.events[0],
      setCurrentEventId: (id) => patchData((d) => ({ ...d, currentEventId: id })),
      addTask: (input) =>
        patchData((d) => ({
          ...d,
          tasks: [
            { ...input, id: uid(), completed: false, createdAt: new Date().toISOString() },
            ...d.tasks,
          ],
        })),
      updateTask: (id, patch) =>
        patchData((d) => ({
          ...d,
          tasks: d.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)),
        })),
      toggleTask: (id) =>
        patchData((d) => ({
          ...d,
          tasks: d.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        })),
      deleteTask: (id) =>
        patchData((d) => ({ ...d, tasks: d.tasks.filter((task) => task.id !== id) })),
      addEvent: (input) =>
        patchData((d) => {
          const event = { ...input, id: uid() };
          return { ...d, events: [...d.events, event], currentEventId: event.id };
        }),
      updateEvent: (id, patch) =>
        patchData((d) => ({
          ...d,
          events: d.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      deleteEvent: (id) =>
        patchData((d) => {
          const events = d.events.filter((e) => e.id !== id);
          return {
            events,
            tasks: d.tasks.filter((task) => task.eventId !== id),
            currentEventId: d.currentEventId === id ? (events[0]?.id ?? "") : d.currentEventId,
          };
        }),
    }),
    [data, ready, theme, patchData],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useEventFlow() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useEventFlow must be used inside EventFlowProvider");
  return ctx;
}

export function progressOf(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total,
    completed,
    remaining: total - completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
