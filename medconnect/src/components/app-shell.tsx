import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  Video,
  Pill,
  CalendarRange,
  Settings,
  Menu,
  Bell,
  Search,
  Stethoscope,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { practice } from "@/lib/mock-data";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/appointments", label: "Appointments", icon: CalendarDays, count: "9" },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/intake-forms", label: "Intake forms", icon: ClipboardList, count: "3" },
  { to: "/consultation", label: "Consultation room", icon: Video },
  { to: "/prescriptions", label: "Prescriptions", icon: Pill, count: "3" },
  { to: "/rota", label: "Rota & performance", icon: CalendarRange },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"
      >
        <Stethoscope className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-base font-bold leading-tight text-sidebar-foreground">
          MedConnect
        </span>
        <span className="block truncate text-[11px] uppercase tracking-widest text-sidebar-foreground/60">
          Practice suite
        </span>
      </span>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon, ...rest }) => {
        const count = "count" in rest ? (rest as { count?: string }).count : undefined;
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary/15 text-sidebar-foreground ring-1 ring-inset ring-sidebar-primary/40"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon
              className={cn("size-[18px] shrink-0", active ? "text-sidebar-primary" : "text-sidebar-foreground/50")}
            />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {count ? (
              <span className="shrink-0 rounded-full bg-sidebar-primary/20 px-2 py-0.5 text-[11px] font-semibold text-sidebar-primary">
                {count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="rounded-xl bg-sidebar-accent/60 p-3 text-[11px] leading-relaxed text-sidebar-foreground/70">
      <p className="font-semibold text-sidebar-foreground">Interface demonstration</p>
      <p className="mt-1">
        Mock data only. Messaging, calendar sync, video and records surfaces are visual prototypes with no live
        connections.
      </p>
    </div>
  );
}

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <SidebarFooter />
      </aside>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] border-sidebar-border bg-sidebar p-4">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="flex h-full flex-col gap-6">
                    <Brand />
                    <div className="min-h-0 flex-1 overflow-y-auto">
                      <NavList onNavigate={() => setOpen(false)} />
                    </div>
                    <SidebarFooter />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold leading-tight">{practice.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  ODS {practice.odsCode} · Friday 21 August 2026
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <Button variant="ghost" size="icon" aria-label="Search (demo)" className="hidden sm:inline-flex">
                <Search className="size-[18px]" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications (demo)" className="relative">
                <Bell className="size-[18px]" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              >
                {dark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </Button>
              <div className="ml-1 hidden items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 sm:flex">
                <span
                  aria-hidden="true"
                  className="grid size-7 place-items-center rounded-full bg-primary/12 text-xs font-bold text-primary"
                >
                  AN
                </span>
                <span className="text-xs font-semibold">Dr A. Nwosu</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border bg-warning/12 px-4 py-1.5 sm:px-6">
            <Badge className="shrink-0 border-transparent bg-warning text-warning-foreground">UI demo</Badge>
            <p className="min-w-0 text-[11px] leading-snug text-muted-foreground sm:text-xs">
              Sample interface with fictional data. No live clinical systems, messaging, or video services are
              connected.
            </p>
          </div>
        </header>

        <main id="main" className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          MedConnect — design prototype for UK GP, dental and physiotherapy practices. All names, records and metrics
          shown are fictional.
        </footer>
      </div>
    </div>
  );
}
