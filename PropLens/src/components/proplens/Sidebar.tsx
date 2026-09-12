import {
  LayoutDashboard,
  Building2,
  Users,
  Handshake,
  KeyRound,
  Radar,
  Video,
  Search,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainMenu = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Listings", icon: Building2, active: true },
  { label: "Buyer matcher", icon: Radar, badge: "AI" },
  { label: "Offers", icon: Handshake, badge: "4" },
  { label: "Virtual tours", icon: Video },
];

const portfolio = [
  { label: "Landlord portal", icon: KeyRound },
  { label: "Applicants", icon: Users },
  { label: "Portal syndication", icon: Search },
  { label: "Insights", icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="hidden w-[264px] shrink-0 flex-col justify-between bg-sidebar px-4 py-6 text-sidebar-foreground lg:flex">
      <div>
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Building2 className="size-5" strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-display text-lg font-bold leading-none">PropLens</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-sidebar-muted">
              Agent OS
            </p>
          </div>
        </div>

        <NavGroup title="Main menu" items={mainMenu} />
        <NavGroup title="Portfolio" items={portfolio} />
      </div>

      <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent p-4">
        <Sparkles className="size-5 text-accent" />
        <p className="mt-3 font-display text-sm font-semibold">Premium GMB page</p>
        <p className="mt-1 text-xs leading-relaxed text-sidebar-muted">
          Get an SEO landing page linked straight from your Google Business Profile.
        </p>
        <button className="mt-4 w-full rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          Upgrade branch
        </button>
      </div>
    </aside>
  );
}

function NavGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{
    label: string;
    icon: typeof Building2;
    active?: boolean;
    badge?: string;
  }>;
}) {
  return (
    <div className="mt-8">
      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-muted">
        {title}
      </p>
      <nav className="mt-3 space-y-1">
        {items.map(({ label, icon: Icon, active, badge }) => (
          <button
            key={label}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-semibold text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-[18px]" />
            <span className="flex-1 text-left">{label}</span>
            {badge ? (
              <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                {badge}
              </span>
            ) : null}
            {active ? <span className="size-1.5 rounded-full bg-primary" /> : null}
          </button>
        ))}
      </nav>
    </div>
  );
}
