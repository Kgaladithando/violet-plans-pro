import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, CalendarDays, MapPin } from "lucide-react";
import { AppShell } from "@/components/eventflow/AppShell";
import { TaskItem } from "@/components/eventflow/TaskItem";
import { TaskDialog } from "@/components/eventflow/TaskDialog";
import { ProgressRing } from "@/components/eventflow/ProgressRing";
import { Button } from "@/components/ui/button";
import { progressOf, useEventFlow } from "@/lib/eventflow/store";
import type { Task } from "@/lib/eventflow/types";
import { categoryById } from "@/lib/eventflow/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventFlow — Event Planning Dashboard" },
      {
        name: "description",
        content:
          "Track event progress, today's tasks and upcoming deadlines in one calm dashboard.",
      },
      { property: "og:title", content: "EventFlow — Event Planning Dashboard" },
      {
        property: "og:description",
        content: "Plan less. Organize better. Celebrate more.",
      },
    ],
  }),
  component: Dashboard,
});

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const longDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function Dashboard() {
  const { ready, tasks, currentEvent, currentEventId } = useEventFlow();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const eventTasks = useMemo(
    () => tasks.filter((t) => t.eventId === currentEventId),
    [tasks, currentEventId],
  );
  const stats = progressOf(eventTasks);
  const today = new Date().toISOString().slice(0, 10);
  const todays = eventTasks.filter((t) => t.dueDate <= today);
  const upcoming = eventTasks
    .filter((t) => !t.completed && t.dueDate > today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditing(task);
    setOpen(true);
  };

  return (
    <AppShell
      title={`${greeting()} 👋`}
      subtitle="Here's how your event is coming together."
      actions={
        <Button onClick={openNew} className="rounded-full">
          <Plus className="size-4" /> Add Task
        </Button>
      }
    >
      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="surface-card h-28 animate-pulse" />
          ))}
        </div>
      ) : !currentEvent ? (
        <div className="surface-card grid place-items-center gap-3 p-12 text-center">
          <p className="font-display text-lg font-semibold">No events yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first event to start planning.
          </p>
          <Button asChild className="rounded-full">
            <Link to="/events">Create event</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="surface-card overflow-hidden">
            {currentEvent.image ? (
              <img
                src={currentEvent.image}
                alt={currentEvent.name}
                width={1280}
                height={720}
                className="h-40 w-full object-cover sm:h-52"
              />
            ) : null}
            <div className="flex flex-wrap items-center gap-6 p-6">
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl font-semibold">{currentEvent.name}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" /> {longDate(currentEvent.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" /> {currentEvent.location}
                  </span>
                </div>
              </div>
              <ProgressRing percent={stats.percent} />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total tasks", value: stats.total },
              { label: "Completed", value: stats.completed },
              { label: "Remaining", value: stats.remaining },
            ].map((card) => (
              <div key={card.label} className="surface-card surface-card-hover p-5">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 font-display text-3xl font-semibold">{card.value}</p>
              </div>
            ))}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Today's tasks</h3>
              <Button variant="ghost" onClick={openNew} className="rounded-full">
                <Plus className="size-4" /> Add Task
              </Button>
            </div>
            {todays.length === 0 ? (
              <div className="surface-card p-8 text-center text-sm text-muted-foreground">
                Nothing due today — enjoy the calm.
              </div>
            ) : (
              <ul className="space-y-3">
                {todays.map((task) => (
                  <TaskItem key={task.id} task={task} onEdit={openEdit} />
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="mb-3 text-lg font-semibold">Upcoming deadlines</h3>
            {upcoming.length === 0 ? (
              <div className="surface-card p-8 text-center text-sm text-muted-foreground">
                No upcoming deadlines.
              </div>
            ) : (
              <ul className="surface-card divide-y divide-border">
                {upcoming.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 px-5 py-3.5 text-sm">
                    <span className="text-base">{categoryById(task.category).emoji}</span>
                    <span className="min-w-0 flex-1 truncate">{task.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {longDate(task.dueDate)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <TaskDialog open={open} onOpenChange={setOpen} task={editing} />
    </AppShell>
  );
}
