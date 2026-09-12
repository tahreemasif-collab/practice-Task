import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Clock, XCircle, MessageSquareOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ApptStatus, Discipline, ReminderStatus, RiskLevel } from "@/lib/mock-data";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold leading-tight sm:text-[28px]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  trend,
  tone = "default",
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: string;
  tone?: "default" | "positive" | "warning" | "critical";
  icon?: ReactNode;
}) {
  const toneRing = {
    default: "",
    positive: "ring-success/30",
    warning: "ring-warning/40",
    critical: "ring-destructive/35",
  }[tone];
  const toneText = {
    default: "text-muted-foreground",
    positive: "text-success",
    warning: "text-warning",
    critical: "text-destructive",
  }[tone];

  return (
    <Card className={cn("shadow-card ring-1 ring-inset ring-transparent", toneRing)}>
      <CardContent className="p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <p className="min-w-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          {icon ? <span className={cn("shrink-0", toneText)}>{icon}</span> : null}
        </div>
        <p className="mt-2 font-display text-3xl font-bold tabular-nums leading-none">{value}</p>
        {hint ? <p className="mt-2 text-xs leading-snug text-muted-foreground">{hint}</p> : null}
        {trend ? <p className={cn("mt-1.5 text-xs font-semibold", toneText)}>{trend}</p> : null}
      </CardContent>
    </Card>
  );
}

const riskStyles: Record<RiskLevel, string> = {
  low: "border-success/35 bg-success/12 text-success",
  medium: "border-warning/45 bg-warning/15 text-warning",
  high: "border-destructive/40 bg-destructive/12 text-destructive",
};

export function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  const label = { low: "Low risk", medium: "Medium risk", high: "High risk" }[level];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-semibold", riskStyles[level])}>
      {level === "high" ? <AlertTriangle className="size-3" aria-hidden="true" /> : null}
      {label}
      {typeof score === "number" ? <span className="tabular-nums opacity-80">{score}%</span> : null}
    </Badge>
  );
}

export function RiskMeter({ score, label = "No-show risk" }: { score: number; label?: string }) {
  const tone = score >= 65 ? "bg-destructive" : score >= 35 ? "bg-warning" : "bg-success";
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{score}%</span>
      </div>
      <div
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

const reminderMeta: Record<ReminderStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  confirmed: { label: "Confirmed", className: "border-success/35 bg-success/12 text-success", icon: CheckCircle2 },
  sent: { label: "Reminder sent", className: "border-info/35 bg-info/12 text-info", icon: MessageSquareOff },
  pending: { label: "Reminder queued", className: "border-border bg-muted text-muted-foreground", icon: Clock },
  failed: { label: "Delivery failed", className: "border-destructive/40 bg-destructive/12 text-destructive", icon: XCircle },
  "no-response": {
    label: "No response",
    className: "border-warning/45 bg-warning/15 text-warning",
    icon: AlertTriangle,
  },
};

export function ReminderBadge({ status }: { status: ReminderStatus }) {
  const { label, className, icon: Icon } = reminderMeta[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", className)}>
      <Icon className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}

const statusMeta: Record<ApptStatus, { label: string; className: string }> = {
  booked: { label: "Booked", className: "border-border bg-muted text-muted-foreground" },
  arrived: { label: "Arrived", className: "border-info/35 bg-info/12 text-info" },
  "in-consultation": { label: "In consultation", className: "border-primary/40 bg-primary/12 text-primary" },
  completed: { label: "Completed", className: "border-success/35 bg-success/12 text-success" },
  dna: { label: "Did not attend", className: "border-destructive/40 bg-destructive/12 text-destructive" },
  cancelled: { label: "Cancelled", className: "border-border bg-muted text-muted-foreground line-through" },
};

export function StatusBadge({ status }: { status: ApptStatus }) {
  const { label, className } = statusMeta[status];
  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}

const disciplineStyles: Record<Discipline, string> = {
  GP: "border-primary/35 bg-primary/12 text-primary",
  Dental: "border-info/35 bg-info/12 text-info",
  Physio: "border-chart-2/40 bg-chart-2/12 text-chart-2",
};

export function DisciplineBadge({ discipline }: { discipline: Discipline }) {
  return (
    <Badge variant="outline" className={cn("font-semibold", disciplineStyles[discipline])}>
      {discipline}
    </Badge>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-bold text-primary",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export const initialsOf = (name: string) =>
  name
    .replace(/^(Dr|Mr|Ms|Mrs|Nurse|Parent of)\s+/i, "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
