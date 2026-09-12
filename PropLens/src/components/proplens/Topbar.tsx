import { Bell, Command, Search, Settings, Plus } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-surface/85 px-5 py-4 backdrop-blur-md lg:px-8">
      <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search properties, applicants, landlords or postcodes…"
          aria-label="Search PropLens"
        />
        <span className="hidden items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground sm:flex">
          <Command className="size-3" />K
        </span>
      </label>

      <div className="flex items-center gap-2">
        <button className="hidden h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:flex">
          <Plus className="size-4" /> Add property
        </button>
        <IconButton label="Notifications">
          <Bell className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" />
        </IconButton>
        <IconButton label="Settings">
          <Settings className="size-[18px]" />
        </IconButton>
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background py-1.5 pl-1.5 pr-3">
          <span className="grid size-8 place-items-center rounded-lg bg-primary-soft text-sm font-bold text-primary">
            AW
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold">Amelia Ward</p>
            <p className="text-[11px] text-muted-foreground">Kensington branch</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function IconButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="relative grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </button>
  );
}
