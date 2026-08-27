import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { AppShell } from "@/components/eventflow/AppShell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventFlow } from "@/lib/eventflow/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — EventFlow" },
      { name: "description", content: "Switch themes and choose your current event." },
      { property: "og:title", content: "Settings — EventFlow" },
      {
        property: "og:description",
        content: "Switch themes and choose your current event.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggleTheme, events, currentEventId, setCurrentEventId } = useEventFlow();

  return (
    <AppShell title="Settings" subtitle="Personalise how EventFlow looks and works.">
      <div className="space-y-4">
        <section className="surface-card flex items-center gap-4 p-5">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft">
            {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </span>
          <div className="flex-1">
            <Label htmlFor="theme-switch" className="text-sm font-semibold">
              Dark mode
            </Label>
            <p className="text-xs text-muted-foreground">
              {theme === "dark" ? "Soft purple on deep charcoal" : "Purple on clean white"}
            </p>
          </div>
          <Switch id="theme-switch" checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </section>

        <section className="surface-card p-5">
          <Label className="text-sm font-semibold">Current event</Label>
          <p className="mb-3 text-xs text-muted-foreground">
            Dashboard, tasks and categories follow this event.
          </p>
          <Select value={currentEventId} onValueChange={setCurrentEventId}>
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
      </div>
    </AppShell>
  );
}
