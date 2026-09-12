import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange, Download, Plus, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, DemoNote, DisciplineBadge, PageHeader, StatCard, initialsOf } from "@/components/clinical";
import { clinicianById, clinicians, rota, rotaDays, staffPerformance } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rota")({
  head: () => ({
    meta: [
      { title: "Staff Rota & Performance — MedConnect" },
      {
        name: "description",
        content:
          "Weekly clinical rota with leave and duty cover, alongside utilisation, consultation length and did-not-attend rates by clinician.",
      },
      { property: "og:title", content: "Staff Rota & Performance — MedConnect" },
      {
        property: "og:description",
        content: "Weekly rota planning and clinician performance indicators. Interface demonstration.",
      },
    ],
  }),
  component: RotaPage,
});

const shiftStyle = {
  clinic: "border-primary/30 bg-primary/10 text-foreground",
  admin: "border-info/30 bg-info/10 text-foreground",
  leave: "border-warning/40 bg-warning/12 text-foreground",
  "on-call": "border-chart-2/40 bg-chart-2/12 text-foreground",
  off: "border-dashed border-border bg-muted/50 text-muted-foreground",
} as const;

function RotaPage() {
  return (
    <>
      <PageHeader
        title="Rota & performance"
        description="Plan the week across three service lines and monitor how capacity converts into completed appointments."
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" />
              Export rota
            </Button>
            <Button>
              <Plus className="size-4" />
              Add shift
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Clinical sessions" value="58" hint="Week commencing 24 August" icon={<CalendarRange className="size-5" />} />
        <StatCard label="Cover gaps" value="2" hint="Thu PM duty · Fri hygiene list" tone="warning" />
        <StatCard label="Average utilisation" value="88%" hint="Target band 85–92%" tone="positive" icon={<TrendingUp className="size-5" />} />
        <StatCard label="Practice DNA rate" value="5.8%" hint="Down 1.6 points on July" tone="positive" />
      </div>

      <Tabs defaultValue="rota" className="mt-6">
        <TabsList>
          <TabsTrigger value="rota">Weekly rota</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
        </TabsList>

        <TabsContent value="rota" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Week commencing Monday 24 August 2026</CardTitle>
              <CardDescription>Clinic, admin, duty cover and leave by clinician</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[860px]">
                  <div className="grid grid-cols-[200px_repeat(5,minmax(0,1fr))] gap-2 pb-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Clinician
                    </div>
                    {rotaDays.map((d) => (
                      <div key={d} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {rota.map((row) => {
                      const c = clinicianById(row.clinicianId)!;
                      return (
                        <div key={row.clinicianId} className="grid grid-cols-[200px_repeat(5,minmax(0,1fr))] gap-2">
                          <div className="flex min-w-0 items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5">
                            <Avatar initials={initialsOf(c.name)} className="size-8 text-[11px]" />
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold">{c.name}</p>
                              <p className="truncate text-[11px] text-muted-foreground">{c.role}</p>
                            </div>
                          </div>
                          {rotaDays.map((day) => {
                            const shift = row.shifts.find((s) => s.day === day);
                            return (
                              <div
                                key={day}
                                className={cn(
                                  "rounded-lg border p-2.5 text-xs leading-snug",
                                  shift ? shiftStyle[shift.kind] : shiftStyle.off,
                                )}
                              >
                                {shift?.label ?? "—"}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  [
                    ["clinic", "Clinical session"],
                    ["admin", "Admin & referrals"],
                    ["on-call", "Duty cover"],
                    ["leave", "Leave / study"],
                    ["off", "Non-working"],
                  ] as const
                ).map(([kind, label]) => (
                  <span
                    key={kind}
                    className={cn("rounded-md border px-2.5 py-1 text-xs font-medium", shiftStyle[kind])}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <DemoNote>
                  Rota data is fictional and does not synchronise with any workforce, payroll, or calendar system.
                </DemoNote>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Clinician indicators</CardTitle>
              <CardDescription>Rolling 30 days · appointments completed and quality signals</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clinician</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Seen</TableHead>
                    <TableHead className="text-right">Avg mins</TableHead>
                    <TableHead className="text-right">DNA rate</TableHead>
                    <TableHead className="text-right">Satisfaction</TableHead>
                    <TableHead className="min-w-[160px]">Utilisation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformance.map((s) => {
                    const c = clinicianById(s.clinicianId)!;
                    return (
                      <TableRow key={s.clinicianId}>
                        <TableCell>
                          <div className="flex min-w-0 items-center gap-2.5">
                            <Avatar initials={initialsOf(c.name)} className="size-8 text-[11px]" />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{c.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DisciplineBadge discipline={c.discipline} />
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{s.seen}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{s.avgMins}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
                          <span className={s.dnaRate > 7 ? "font-semibold text-destructive" : undefined}>
                            {s.dnaRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{s.satisfaction}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={s.utilisation} className="h-1.5 min-w-0 flex-1" />
                            <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums">
                              {s.utilisation}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Appointments completed by clinician</CardTitle>
              <CardDescription>Rolling 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={staffPerformance.map((s) => ({
                      name: clinicianById(s.clinicianId)!.name.split(" ").slice(-1)[0],
                      seen: s.seen,
                    }))}
                    margin={{ left: -18, right: 6, top: 6 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
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
                    <Bar dataKey="seen" name="Appointments" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <DemoNote>
                Indicators are illustrative. Real performance reporting should be agreed with staff and used
                supportively rather than punitively.
              </DemoNote>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clinicians.map((c) => {
              const perf = staffPerformance.find((s) => s.clinicianId === c.id)!;
              return (
                <Card key={c.id} className="shadow-card">
                  <CardContent className="p-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar initials={initialsOf(c.name)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{c.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{c.room}</p>
                      </div>
                      <DisciplineBadge discipline={c.discipline} />
                    </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Utilisation</span>
                          <span className="font-semibold tabular-nums">{perf.utilisation}%</span>
                        </div>
                        <Progress value={perf.utilisation} className="mt-1.5 h-1.5" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                          {perf.seen} seen
                        </Badge>
                        <Badge variant="outline" className="font-normal text-muted-foreground">
                          {perf.avgMins} min average
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
