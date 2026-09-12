import { AlertTriangle, ArrowUpRight, KeyRound, Sparkles, Wrench, Banknote, CalendarClock } from "lucide-react";
import { buyerMatches, landlordAlerts, type LandlordAlert } from "@/data/proplens";

const alertIcon: Record<LandlordAlert["type"], typeof Wrench> = {
  "Tenancy expiry": CalendarClock,
  Maintenance: Wrench,
  "Rent received": Banknote,
  Arrears: AlertTriangle,
};

const alertTone: Record<LandlordAlert["type"], string> = {
  "Tenancy expiry": "bg-warning-soft text-warning",
  Maintenance: "bg-primary-soft text-primary",
  "Rent received": "bg-success-soft text-success",
  Arrears: "bg-destructive-soft text-destructive",
};

export function InsightPanels() {
  return (
    <div className="mt-8 grid gap-5 xl:grid-cols-2">
      <section className="panel p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <Sparkles className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">AI buyer matcher</h2>
              <p className="text-sm text-muted-foreground">Ranked on budget, area, garden, schools</p>
            </div>
          </div>
          <button className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex">
            View all <ArrowUpRight className="size-4" />
          </button>
        </div>

        <ul className="mt-5 space-y-3">
          {buyerMatches.map((m) => (
            <li key={m.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{m.buyer}</p>
                  <p className="text-xs text-muted-foreground">{m.budget}</p>
                </div>
                <span className="rounded-lg bg-primary-soft px-2 py-1 font-display text-sm font-bold text-primary">
                  {m.score}%
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.wants.map((w) => (
                  <span
                    key={w}
                    className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                  >
                    {w}
                  </span>
                ))}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${m.score}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Auto-suggested: <span className="font-medium text-foreground">{m.property}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <KeyRound className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Landlord portal feed</h2>
              <p className="text-sm text-muted-foreground">Rent, maintenance &amp; tenancy alerts</p>
            </div>
          </div>
          <button className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex">
            Open portal <ArrowUpRight className="size-4" />
          </button>
        </div>

        <ul className="mt-5 space-y-3">
          {landlordAlerts.map((a) => {
            const Icon = alertIcon[a.type];
            return (
              <li key={a.id} className="flex gap-3 rounded-xl border border-border p-4">
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${alertTone[a.type]}`}>
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-semibold">{a.property}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{a.when}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{a.detail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Landlord: {a.landlord}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 rounded-xl bg-muted p-4">
          <p className="text-sm font-semibold">Rental income this month</p>
          <p className="mt-1 font-display text-3xl font-bold">£128,460</p>
          <p className="text-xs text-muted-foreground">97.4% collected · 3 accounts in arrears</p>
        </div>
      </section>
    </div>
  );
}
