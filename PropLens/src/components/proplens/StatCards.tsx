import { Building2, Radar, Handshake, KeyRound, type LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  delta: string;
  hint: string;
  icon: LucideIcon;
  tone: "primary" | "accent" | "success" | "warning";
}

const stats: Stat[] = [
  {
    label: "Live listings",
    value: "184",
    delta: "+16 this week",
    hint: "Across 3 UK branches",
    icon: Building2,
    tone: "primary",
  },
  {
    label: "AI buyer matches",
    value: "72",
    delta: "+9 overnight",
    hint: "Auto-sent to applicants",
    icon: Radar,
    tone: "accent",
  },
  {
    label: "Offers in play",
    value: "23",
    delta: "6 awaiting reply",
    hint: "£14.2m pipeline value",
    icon: Handshake,
    tone: "success",
  },
  {
    label: "Tenancies expiring",
    value: "11",
    delta: "next 60 days",
    hint: "4 renewals unsent",
    icon: KeyRound,
    tone: "warning",
  },
];

const toneMap: Record<Stat["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <article key={s.label} className="panel p-5">
          <div className="flex items-start justify-between">
            <span className={`grid size-10 place-items-center rounded-xl ${toneMap[s.tone]}`}>
              <s.icon className="size-5" />
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {s.delta}
            </span>
          </div>
          <p className="mt-5 font-display text-4xl font-bold tracking-tight">{s.value}</p>
          <p className="mt-1 text-sm font-medium">{s.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>
        </article>
      ))}
    </div>
  );
}
