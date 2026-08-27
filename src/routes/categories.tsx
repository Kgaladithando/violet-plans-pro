import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/eventflow/AppShell";
import { Progress } from "@/components/ui/progress";
import { progressOf, useEventFlow } from "@/lib/eventflow/store";
import { CATEGORIES } from "@/lib/eventflow/types";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — EventFlow" },
      {
        name: "description",
        content: "See venue, catering, guests, marketing, logistics and budget progress.",
      },
      { property: "og:title", content: "Categories — EventFlow" },
      {
        property: "og:description",
        content: "See venue, catering, guests, marketing, logistics and budget progress.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { tasks, currentEventId, currentEvent } = useEventFlow();
  const eventTasks = tasks.filter((t) => t.eventId === currentEventId);

  return (
    <AppShell title="Categories" subtitle={currentEvent?.name ?? "Organize your work"}>
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category) => {
          const list = eventTasks.filter((t) => t.category === category.id);
          const stats = progressOf(list);
          return (
            <Link
              key={category.id}
              to="/tasks"
              className="surface-card surface-card-hover block p-5"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-lg">
                  {category.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold">{category.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.total} {stats.total === 1 ? "task" : "tasks"} · {stats.remaining}{" "}
                    remaining
                  </p>
                </div>
                <span className="font-display text-sm font-semibold">{stats.percent}%</span>
              </div>
              <Progress value={stats.percent} className="mt-4 h-2" />
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
