import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/eventflow/AppShell";
import { TaskItem } from "@/components/eventflow/TaskItem";
import { TaskDialog } from "@/components/eventflow/TaskDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { progressOf, useEventFlow } from "@/lib/eventflow/store";
import { CATEGORIES, type CategoryId, type Task } from "@/lib/eventflow/types";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — EventFlow" },
      {
        name: "description",
        content: "Create, edit, complete and filter every task for your event.",
      },
      { property: "og:title", content: "Tasks — EventFlow" },
      {
        property: "og:description",
        content: "Create, edit, complete and filter every task for your event.",
      },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { tasks, currentEventId, currentEvent } = useEventFlow();
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const eventTasks = useMemo(
    () => tasks.filter((t) => t.eventId === currentEventId),
    [tasks, currentEventId],
  );
  const visible = eventTasks.filter((t) => filter === "all" || t.category === filter);
  const stats = progressOf(visible);

  return (
    <AppShell
      title="Tasks"
      subtitle={currentEvent ? currentEvent.name : "All tasks"}
      actions={
        <Button
          className="rounded-full"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add Task
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {stats.completed} of {stats.total} complete
            </span>
            <span className="font-display font-semibold">{stats.percent}%</span>
          </div>
          <Progress value={stats.percent} className="mt-3 h-2" />
        </div>

        <div className="-mx-1 flex flex-wrap gap-2 px-1">
          {(["all", ...CATEGORIES.map((c) => c.id)] as const).map((id) => {
            const cat = CATEGORIES.find((c) => c.id === id);
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id as CategoryId | "all")}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {cat ? `${cat.emoji} ${cat.label}` : "All tasks"}
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <div className="surface-card grid place-items-center gap-3 p-12 text-center">
            <p className="font-display text-lg font-semibold">No tasks here yet</p>
            <p className="text-sm text-muted-foreground">
              Add a task to start tracking this part of your event.
            </p>
            <Button
              className="rounded-full"
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus className="size-4" /> Add Task
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditing(t);
                  setOpen(true);
                }}
              />
            ))}
          </ul>
        )}
      </div>

      <TaskDialog open={open} onOpenChange={setOpen} task={editing} />
    </AppShell>
  );
}
