import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, Plus, Trash2, Check } from "lucide-react";
import { AppShell } from "@/components/eventflow/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { progressOf, useEventFlow } from "@/lib/eventflow/store";
import { toast } from "sonner";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — EventFlow" },
      {
        name: "description",
        content: "Create and manage events with dates, locations, imagery and task progress.",
      },
      { property: "og:title", content: "Events — EventFlow" },
      {
        property: "og:description",
        content: "Create and manage events with dates, locations, imagery and task progress.",
      },
    ],
  }),
  component: EventsPage,
});

const longDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function EventsPage() {
  const { events, tasks, currentEventId, setCurrentEventId, addEvent, deleteEvent } =
    useEventFlow();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const submit = () => {
    if (!name.trim()) {
      toast.error("Give your event a name first.");
      return;
    }
    addEvent({
      name: name.trim(),
      date,
      location: location.trim() || "To be confirmed",
      description: description.trim(),
      ...(image.trim() ? { image: image.trim() } : {}),
    });
    toast.success("Event created");
    setName("");
    setLocation("");
    setDescription("");
    setImage("");
    setOpen(false);
  };

  return (
    <AppShell
      title="Events"
      subtitle="Everything you're planning, in one place."
      actions={
        <Button className="rounded-full" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> New Event
        </Button>
      }
    >
      {events.length === 0 ? (
        <div className="surface-card grid place-items-center gap-3 p-12 text-center">
          <p className="font-display text-lg font-semibold">No events yet</p>
          <p className="text-sm text-muted-foreground">Create one to start adding tasks.</p>
          <Button className="rounded-full" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> New Event
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {events.map((event) => {
            const stats = progressOf(tasks.filter((t) => t.eventId === event.id));
            const active = event.id === currentEventId;
            return (
              <article
                key={event.id}
                className={cn(
                  "surface-card surface-card-hover overflow-hidden",
                  active && "ring-2 ring-primary",
                )}
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="h-36 w-full object-cover"
                  />
                ) : null}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-lg font-semibold">{event.name}</h2>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" /> {longDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5" /> {event.location}
                        </span>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-full text-muted-foreground hover:text-destructive"
                          aria-label={`Delete ${event.name}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            “{event.name}” and its tasks will be removed permanently.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="rounded-full"
                            onClick={() => {
                              deleteEvent(event.id);
                              toast.success("Event deleted");
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  {event.description ? (
                    <p className="mt-3 text-sm text-muted-foreground">{event.description}</p>
                  ) : null}

                  <Progress value={stats.percent} className="mt-4 h-2" />
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {stats.total} tasks · {stats.completed} completed · {stats.remaining}{" "}
                      remaining
                    </span>
                    <span className="font-display text-sm font-semibold text-foreground">
                      {stats.percent}%
                    </span>
                  </div>

                  <Button
                    variant={active ? "secondary" : "outline"}
                    className="mt-4 w-full rounded-full"
                    onClick={() => {
                      setCurrentEventId(event.id);
                      toast.success(`${event.name} is now your current event`);
                    }}
                    disabled={active}
                  >
                    {active ? (
                      <>
                        <Check className="size-4" /> Current event
                      </>
                    ) : (
                      "Set as current"
                    )}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Create event</DialogTitle>
            <DialogDescription>Add the basics — tasks come next.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-name">Event name</Label>
              <Input
                id="event-name"
                value={name}
                placeholder="Wedding Celebration"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="event-location">Location</Label>
                <Input
                  id="event-location"
                  value={location}
                  placeholder="Johannesburg"
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-image">Image URL</Label>
              <Input
                id="event-image"
                value={image}
                placeholder="https://…"
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-full" onClick={submit}>
              Create event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
