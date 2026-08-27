import { Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
import { categoryById, type Task } from "@/lib/eventflow/types";
import { useEventFlow } from "@/lib/eventflow/store";
import { toast } from "sonner";

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

export function TaskItem({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const { toggleTask, deleteTask } = useEventFlow();
  const category = categoryById(task.category);

  return (
    <li className="surface-card surface-card-hover flex items-start gap-3 p-4">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className="mt-0.5 size-5 rounded-full"
        aria-label={task.completed ? `Mark ${task.name} incomplete` : `Complete ${task.name}`}
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium transition-colors",
            task.completed && "text-muted-foreground line-through",
          )}
        >
          {task.name}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-primary-soft px-2.5 py-0.5 font-medium text-accent-foreground">
            {category.emoji} {category.label}
          </span>
          <span>Due {formatDate(task.dueDate)}</span>
        </div>
        {task.notes ? (
          <p className="mt-2 text-xs text-muted-foreground">{task.notes}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full"
          aria-label={`Edit ${task.name}`}
          onClick={() => onEdit(task)}
        >
          <Pencil className="size-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-muted-foreground hover:text-destructive"
              aria-label={`Delete ${task.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this task?</AlertDialogTitle>
              <AlertDialogDescription>
                “{task.name}” will be removed permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-full"
                onClick={() => {
                  deleteTask(task.id);
                  toast.success("Task deleted");
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
