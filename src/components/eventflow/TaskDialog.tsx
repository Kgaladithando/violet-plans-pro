import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type CategoryId, type Task } from "@/lib/eventflow/types";
import { useEventFlow } from "@/lib/eventflow/store";
import { toast } from "sonner";

export function TaskDialog({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}) {
  const { addTask, updateTask, currentEventId, events, currentEvent } = useEventFlow();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("venue");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [eventId, setEventId] = useState(currentEventId);

  useEffect(() => {
    if (!open) return;
    setName(task?.name ?? "");
    setCategory(task?.category ?? "venue");
    setDueDate(task?.dueDate ?? new Date().toISOString().slice(0, 10));
    setNotes(task?.notes ?? "");
    setEventId(task?.eventId ?? currentEventId);
  }, [open, task, currentEventId]);

  const submit = () => {
    if (!name.trim()) {
      toast.error("Give the task a name first.");
      return;
    }
    if (task) {
      updateTask(task.id, { name: name.trim(), category, dueDate, notes, eventId });
      toast.success("Task updated");
    } else {
      addTask({ name: name.trim(), category, dueDate, notes, eventId });
      toast.success("Task added");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "Add new task"}</DialogTitle>
          <DialogDescription>
            {currentEvent ? `For ${currentEvent.name}` : "Plan the next step for your event."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="task-name">Task name</Label>
            <Input
              id="task-name"
              value={name}
              placeholder="Confirm catering"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="task-category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as CategoryId)}>
                <SelectTrigger id="task-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.emoji} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-date">Due date</Label>
              <Input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {events.length > 1 ? (
            <div className="grid gap-2">
              <Label htmlFor="task-event">Event</Label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger id="task-event">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="task-notes">Notes</Label>
            <Textarea
              id="task-notes"
              rows={3}
              value={notes}
              placeholder="Optional details"
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} className="rounded-full">
            {task ? "Save changes" : "Add task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
