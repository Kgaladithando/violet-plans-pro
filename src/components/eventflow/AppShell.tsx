import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  Moon,
  Settings,
  Sun,
  Tags,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useEventFlow } from "@/lib/eventflow/store";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function ThemeToggle() {
  const { theme, toggleTheme } = useEventFlow();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="rounded-full border border-border bg-card"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { currentEvent } = useEventFlow();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg font-semibold">
            E
          </span>
          <span>
            <span className="block font-display text-lg font-semibold leading-none">
              EventFlow
            </span>
            <span className="text-xs text-muted-foreground">Plan less. Organize better.</span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {currentEvent ? (
          <div className="surface-card mt-6 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Current event</p>
            <p className="mt-1 font-display text-sm font-semibold">{currentEvent.name}</p>
            <p className="text-xs text-muted-foreground">{currentEvent.location}</p>
          </div>
        ) : null}
      </aside>

      <div className="md:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold sm:text-2xl">{title}</h1>
              {subtitle ? (
                <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-12">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="flex items-stretch justify-around">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
