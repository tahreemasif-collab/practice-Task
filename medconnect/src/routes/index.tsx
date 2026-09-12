import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  UserRoundX,
  Pill,
  ClipboardList,
  ArrowRight,
  Activity,
  PhoneCall,
  TriangleAlert,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  DemoNote,
  DisciplineBadge,
  PageHeader,
  ReminderBadge,
  RiskMeter,
  StatCard,
  StatusBadge,
  initialsOf,
} from "@/components/clinical";
import {
  activityFeed,
  appointments,
  clinicianById,
  demandByDiscipline,
  prescriptions,
  riskFactors,
  weeklyAttendance,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Practice Overview — MedConnect" },
      {
        name: "description",
        content:
          "MedConnect practice overview: today's clinic list, no-show risk, repeat prescription queue and intake form activity for UK GP, dental and physiotherapy teams.",
      },
      { property: "og:title", content: "Practice Overview — MedConnect" },
      {
        property: "og:description",
        content: "A unified daily overview for GP, dental and physiotherapy practices. Interface demonstration.",
      },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const today = appointments.filter((a) => a.date === "2026-08-21");
  const highRisk = today.filter((a) => a.noShowRisk >= 65);
  const pendingRx = prescriptions.filter((p) => p.status === "pending");

  return (
    <>
      <PageHeader
        title="Practice overview"
        description="Everything the front desk and clinical team need before the morning huddle — one list, one risk picture, one queue."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/rota">View rota</Link>
            </Button>
            <Button asChild>
              <Link to="/appointments">
                Open clinic list
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Booked today"
          value={String(today.length)}
          hint="Across GP, dental and physiotherapy lists"
          trend="+6 vs last Friday"
          icon={<CalendarCheck className="size-5" />}
        />
        <StatCard
          label="High no-show risk"
          value={String(highRisk.length)}
          hint="Predicted from attendance history and reminder state"
          trend="Escalate to phone call"
          tone="critical"
          icon={<UserRoundX className="size-5" />}
        />
        <StatCard
          label="Repeats awaiting approval"
          value={String(pendingRx.length)}
          hint="2 carry interaction or monitoring warnings"
          trend="Oldest waiting 26 hours"
          tone="warning"
          icon={<Pill className="size-5" />}
        />
        <StatCard
          label="Intake forms to review"
          value="3"
          hint="1 red-flagged MSK self-assessment"
          trend="Avg completion 4m 12s"
          tone="positive"
          icon={<ClipboardList className="size-5" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="shadow-card xl:col-span-2">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <CardTitle>Today's clinic list</CardTitle>
              <CardDescription>Friday 21 August 2026 · sorted by start time</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link to="/appointments">See all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {today.slice(0, 6).map((a) => {
              const clinician = clinicianById(a.clinicianId);
              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-lift"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="shrink-0 rounded-lg bg-muted px-2 py-1 font-display text-sm font-bold tabular-nums">
                        {a.start}
                      </span>
                      <div className="min-w-0">
                        <Link
                          to="/patients/$patientId"
                          params={{ patientId: a.patientId }}
                          className="focus-ring block truncate font-semibold hover:underline"
                        >
                          {a.patientName}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {a.type} · {a.mode} · {a.durationMins} min · {clinician?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <StatusBadge status={a.status} />
                      <DisciplineBadge discipline={a.discipline} />
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <RiskMeter score={a.noShowRisk} />
                    <div className="sm:pb-0.5">
                      <ReminderBadge status={a.reminder} />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Attendance risk drivers</CardTitle>
              <CardDescription>Weighting used by the demo risk model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskFactors.map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="min-w-0 truncate text-muted-foreground">{f.label}</span>
                    <span className="shrink-0 font-semibold tabular-nums">{f.weight}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${f.weight * 2.6}%` }} />
                  </div>
                </div>
              ))}
              <DemoNote>
                Illustrative weightings for layout purposes. No predictive model or patient data is processed.
              </DemoNote>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Today's activity</CardTitle>
              <CardDescription>Front desk and clinical events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {activityFeed.map((n, i) => (
                <div key={n.id}>
                  {i > 0 ? <Separator /> : null}
                  <div className="flex items-start gap-3 py-3">
                    <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                      {n.time}
                    </span>
                    <p className="min-w-0 text-xs leading-relaxed">{n.text}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Attendance this week</CardTitle>
            <CardDescription>Attended, did not attend and cancelled by day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance} margin={{ left: -18, right: 6, top: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "var(--color-popover-foreground)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="attended" name="Attended" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dna" name="DNA" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelled" name="Cancelled" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Demand by service line</CardTitle>
            <CardDescription>Completed appointments, last six months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandByDiscipline} margin={{ left: -18, right: 6, top: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "var(--color-popover-foreground)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="GP" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.18} />
                  <Area type="monotone" dataKey="Dental" stroke="var(--color-chart-3)" fill="var(--color-chart-3)" fillOpacity={0.18} />
                  <Area type="monotone" dataKey="Physio" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="shadow-card border-destructive/25">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TriangleAlert className="size-4 text-destructive" />
              Escalation suggestions
            </CardTitle>
            <CardDescription>Highest risk slots in the next 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {highRisk.map((a) => (
              <div key={a.id} className="rounded-lg border border-border bg-surface p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <p className="min-w-0 truncate text-sm font-semibold">{a.patientName}</p>
                  <span className="shrink-0 text-xs font-bold tabular-nums text-destructive">{a.noShowRisk}%</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.start} · {a.type}
                </p>
                <Button variant="outline" size="sm" className="mt-2.5 w-full">
                  <PhoneCall className="size-3.5" />
                  Queue courtesy call
                </Button>
              </div>
            ))}
            <DemoNote>Buttons are non-functional in this prototype — no calls or messages are sent.</DemoNote>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-primary" />
              Operational health
            </CardTitle>
            <CardDescription>Rolling 30-day practice indicators</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Third available appointment", value: "4.2 days", note: "Target under 5 days", tone: "positive" as const },
              { label: "Did-not-attend rate", value: "5.8%", note: "Down from 7.4% in July", tone: "positive" as const },
              { label: "Telephone abandonment", value: "9.1%", note: "Peak 08:00–08:30", tone: "warning" as const },
              { label: "Digital intake completion", value: "82%", note: "18% still completed at reception", tone: "default" as const },
              { label: "Video consultation uptake", value: "23%", note: "Physio highest at 41%", tone: "default" as const },
              { label: "Repeat turnaround", value: "18 hrs", note: "Target within 48 hours", tone: "positive" as const },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.label}</p>
                <p className="mt-1.5 font-display text-2xl font-bold tabular-nums">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Clinicians on site today</CardTitle>
          <CardDescription>Room allocation and current status</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {["c1", "c2", "c3", "c4", "c5", "c6"].map((id, i) => {
            const c = clinicianById(id)!;
            const states = ["In consultation", "Available", "On break", "In consultation", "Available", "Video clinic"];
            return (
              <div key={id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                <Avatar initials={initialsOf(c.name)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.role} · {c.room}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-muted-foreground">{states[i]}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}
