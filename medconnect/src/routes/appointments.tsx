import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarPlus, Filter, Sparkles, Send, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DemoNote,
  DisciplineBadge,
  PageHeader,
  ReminderBadge,
  RiskBadge,
  RiskMeter,
  StatCard,
  StatusBadge,
} from "@/components/clinical";
import { appointments, clinicians, clinicianById, riskBand, type Discipline } from "@/lib/mock-data";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "Intelligent Appointments — MedConnect" },
      {
        name: "description",
        content:
          "Day and week clinic scheduling with predicted no-show risk, reminder delivery status and escalation actions across GP, dental and physiotherapy lists.",
      },
      { property: "og:title", content: "Intelligent Appointments — MedConnect" },
      {
        property: "og:description",
        content: "Scheduling with no-show risk scoring and reminder status. Interface demonstration.",
      },
    ],
  }),
  component: AppointmentsPage,
});

const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

function AppointmentsPage() {
  const [discipline, setDiscipline] = useState<"all" | Discipline>("all");
  const [clinician, setClinician] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("a3");

  const dayAppts = useMemo(
    () =>
      appointments
        .filter((a) => a.date === "2026-08-21")
        .filter((a) => (discipline === "all" ? true : a.discipline === discipline))
        .filter((a) => (clinician === "all" ? true : a.clinicianId === clinician))
        .filter((a) => a.patientName.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.start.localeCompare(b.start)),
    [discipline, clinician, query],
  );

  const selected = appointments.find((a) => a.id === selectedId) ?? dayAppts[0];

  return (
    <>
      <PageHeader
        title="Appointments"
        description="A single scheduling surface for every service line, with predicted attendance risk and reminder delivery state on each slot."
        actions={
          <>
            <Button variant="outline">
              <Filter className="size-4" />
              Saved views
            </Button>
            <Button>
              <CalendarPlus className="size-4" />
              New appointment
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Slots today" value="9" hint="7 in person · 2 remote" />
        <StatCard label="Predicted DNAs" value="2" hint="Risk score 65% or above" tone="critical" />
        <StatCard label="Reminders unconfirmed" value="4" hint="1 hard delivery failure" tone="warning" />
        <StatCard label="Capacity used" value="88%" hint="1 same-day slot held back" tone="positive" />
      </div>

      <Card className="mt-6 shadow-card">
        <CardHeader className="gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <CardTitle>Friday 21 August 2026</CardTitle>
              <CardDescription>Select a slot to review risk detail and reminder history</CardDescription>
            </div>
            <Tabs defaultValue="day">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="clinician">By clinician</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="appt-search" className="text-xs">
                Search patient
              </Label>
              <Input
                id="appt-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Surname or full name"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs">Service line</Label>
              <Select value={discipline} onValueChange={(v) => setDiscipline(v as "all" | Discipline)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All service lines</SelectItem>
                  <SelectItem value="GP">General practice</SelectItem>
                  <SelectItem value="Dental">Dental</SelectItem>
                  <SelectItem value="Physio">Physiotherapy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Clinician</Label>
              <Select value={clinician} onValueChange={setClinician}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All clinicians</SelectItem>
                  {clinicians.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-2">
              {HOURS.map((hour) => {
                const slot = dayAppts.filter((a) => a.start.slice(0, 2) === hour.slice(0, 2));
                return (
                  <div key={hour} className="grid grid-cols-[54px_minmax(0,1fr)] gap-3">
                    <div className="pt-2 text-right text-xs font-semibold tabular-nums text-muted-foreground">
                      {hour}
                    </div>
                    <div className="min-w-0 space-y-2 border-l border-border pl-3">
                      {slot.length === 0 ? (
                        <button
                          type="button"
                          className="focus-ring w-full rounded-lg border border-dashed border-border px-3 py-3 text-left text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                        >
                          Free capacity — click to book
                        </button>
                      ) : (
                        slot.map((a) => {
                          const active = a.id === selected?.id;
                          const band = riskBand(a.noShowRisk);
                          const accent =
                            band === "high"
                              ? "border-l-destructive"
                              : band === "medium"
                                ? "border-l-warning"
                                : "border-l-success";
                          return (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => setSelectedId(a.id)}
                              aria-pressed={active}
                              className={`focus-ring w-full rounded-lg border border-l-4 bg-surface p-3 text-left transition-shadow hover:shadow-lift ${accent} ${
                                active ? "ring-2 ring-primary/40" : ""
                              }`}
                            >
                              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold">
                                    {a.start} · {a.patientName}
                                  </p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {a.type} · {a.mode} · {clinicianById(a.clinicianId)?.name}
                                  </p>
                                </div>
                                <DisciplineBadge discipline={a.discipline} />
                              </div>
                              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                <RiskBadge level={band} score={a.noShowRisk} />
                                <ReminderBadge status={a.reminder} />
                                <StatusBadge status={a.status} />
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
              {dayAppts.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No appointments match these filters.
                </p>
              ) : null}
            </div>

            <div className="space-y-4">
              {selected ? (
                <Card className="border-primary/25 bg-surface-strong/50">
                  <CardHeader>
                    <CardTitle className="text-base">{selected.patientName}</CardTitle>
                    <CardDescription>
                      {selected.start} · {selected.type} · {selected.durationMins} minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RiskMeter score={selected.noShowRisk} />
                    <dl className="space-y-2 text-xs">
                      {[
                        ["Clinician", clinicianById(selected.clinicianId)?.name ?? "—"],
                        ["Room", clinicianById(selected.clinicianId)?.room ?? "—"],
                        ["Mode", selected.mode],
                        ["Service line", selected.discipline],
                      ].map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[110px_minmax(0,1fr)] gap-2">
                          <dt className="text-muted-foreground">{k}</dt>
                          <dd className="min-w-0 font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Reminder timeline
                      </p>
                      <ol className="mt-2 space-y-2.5">
                        {[
                          { when: "7 days before", what: "SMS reminder", state: "Delivered" },
                          { when: "48 hours before", what: "Email with intake link", state: "Opened" },
                          { when: "24 hours before", what: "SMS confirm request", state:
                            selected.reminder === "confirmed" ? "Confirmed by patient" : selected.reminder === "failed" ? "Delivery failed" : "Awaiting reply" },
                          { when: "2 hours before", what: "Arrival instructions", state: "Scheduled" },
                        ].map((s) => (
                          <li key={s.when} className="flex items-start gap-2.5">
                            <Clock3 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium">{s.what}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {s.when} · {s.state}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                    {selected.notes ? (
                      <div className="rounded-lg bg-muted/60 p-3 text-xs leading-relaxed">{selected.notes}</div>
                    ) : null}
                    <div className="grid grid-cols-1 gap-2">
                      <Button size="sm">
                        <Send className="size-3.5" />
                        Send extra reminder
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/patients/$patientId" params={{ patientId: selected.patientId }}>
                          Open patient record
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="size-4 text-primary" />
                    Scheduling assistant
                  </CardTitle>
                  <CardDescription>Suggestions based on demo heuristics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  {[
                    "Move Derek Ainsworth's 10:10 telephone review to a Thursday afternoon slot — attendance is 40% higher.",
                    "Offer the free 12:00 slot as same-day urgent capacity; three duty triage items are unbooked.",
                    "Callum Fraser's mobile number is unverified — request confirmation before the video consultation.",
                  ].map((t) => (
                    <p key={t} className="rounded-lg border border-border bg-surface p-3 leading-relaxed">
                      {t}
                    </p>
                  ))}
                  <DemoNote>
                    Calendar synchronisation and SMS delivery are represented visually only; nothing is transmitted.
                  </DemoNote>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
