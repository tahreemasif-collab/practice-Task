import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CalendarClock,
  FileText,
  Pill,
  AlertTriangle,
  ShieldAlert,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Avatar,
  DemoNote,
  DisciplineBadge,
  ReminderBadge,
  RiskBadge,
  StatusBadge,
  initialsOf,
} from "@/components/clinical";
import { appointments, intakeForms, patientById, prescriptions, clinicianById } from "@/lib/mock-data";

export const Route = createFileRoute("/patients/$patientId")({
  loader: ({ params }) => {
    const patient = patientById(params.patientId);
    if (!patient) throw notFound();
    return { patient };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Record unavailable — MedConnect" }, { name: "robots", content: "noindex" }] };
    }
    const { patient } = loaderData;
    return {
      meta: [
        { title: `${patient.name} — Patient Record — MedConnect` },
        {
          name: "description",
          content: `Demonstration patient record for ${patient.name}: summary, medications, appointment history, intake forms and repeat requests.`,
        },
        { property: "og:title", content: `${patient.name} — Patient Record — MedConnect` },
        {
          property: "og:description",
          content: "Consolidated patient record view. Fictional data, interface demonstration only.",
        },
      ],
    };
  },
  component: PatientProfile,
});

function PatientProfile() {
  const { patient } = Route.useLoaderData();
  const history = appointments.filter((a) => a.patientId === patient.id);
  const forms = intakeForms.filter((f) => f.patientId === patient.id);
  const rx = prescriptions.filter((p) => p.patientId === patient.id);

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link to="/patients">
          <ArrowLeft className="size-4" />
          Back to directory
        </Link>
      </Button>

      <Card className="shadow-card">
        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="flex min-w-0 items-start gap-4">
              <Avatar initials={initialsOf(patient.name)} className="size-14 text-lg" />
              <div className="min-w-0">
                <h1 className="truncate font-display text-2xl font-bold leading-tight">{patient.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {patient.age} years · {patient.sex} · Born {patient.dob}
                </p>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                  NHS {patient.nhsNumber}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <DisciplineBadge discipline={patient.discipline} />
                  <RiskBadge level={patient.risk} />
                  {patient.flags.map((f) => (
                    <Badge key={f} variant="outline" className="gap-1 font-normal text-muted-foreground">
                      <ShieldAlert className="size-3" />
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button variant="outline" size="sm">
                <CalendarClock className="size-4" />
                Book appointment
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/consultation">
                  <Video className="size-4" />
                  Start video consultation
                </Link>
              </Button>
            </div>
          </div>

          <Separator className="my-5" />

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Phone, label: "Telephone", value: patient.phone },
              { icon: Mail, label: "Email", value: patient.email },
              { icon: MapPin, label: "Address", value: `${patient.address}, ${patient.postcode}` },
              { icon: CalendarClock, label: "Registered", value: patient.registered },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex min-w-0 items-start gap-2.5">
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
                  <dd className="mt-0.5 truncate text-sm font-medium">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {patient.allergies[0] && patient.allergies[0] !== "None recorded" ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/35 bg-destructive/10 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-destructive">Allergies and adverse reactions</p>
            <p className="mt-0.5 text-sm">{patient.allergies.join(" · ")}</p>
          </div>
        </div>
      ) : null}

      <Tabs defaultValue="summary" className="mt-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Problems and active conditions</CardTitle>
                <CardDescription>Significant clinical history, most recent first</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {patient.conditions.map((c, i) => (
                  <div key={c} className="rounded-xl border border-border bg-surface p-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <p className="min-w-0 font-semibold">{c}</p>
                      <Badge variant="outline" className="shrink-0 font-normal text-muted-foreground">
                        {i === 0 ? "Active" : "Ongoing"}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      Reviewed {patient.lastSeen} · managed under the long-term condition recall pathway.
                    </p>
                  </div>
                ))}
                {patient.conditions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active conditions recorded.</p>
                ) : null}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Recent observations</CardTitle>
                  <CardDescription>Last recorded values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {[
                    ["Blood pressure", "138/84 mmHg"],
                    ["Pulse", "72 bpm"],
                    ["BMI", "27.4"],
                    ["Smoking status", "Ex-smoker"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 text-sm">
                      <span className="min-w-0 truncate text-muted-foreground">{k}</span>
                      <span className="shrink-0 font-semibold tabular-nums">{v}</span>
                    </div>
                  ))}
                  <DemoNote>Placeholder values — not derived from any clinical system.</DemoNote>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Communication preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  {[
                    ["Preferred channel", "SMS"],
                    ["Accessible format", "Large print letters"],
                    ["Consent to remind", "Given"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2">
                      <span className="min-w-0 truncate text-muted-foreground">{k}</span>
                      <span className="shrink-0 font-semibold">{v}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="medications" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Repeat medication</CardTitle>
              <CardDescription>Current items and last issue dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.medications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No repeat medication recorded.</p>
              ) : (
                <div className="space-y-3">
                  {patient.medications.map((m) => (
                    <div key={m.name} className="rounded-xl border border-border bg-surface p-4">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {m.name} {m.dose}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {m.frequency} · last issued {m.lastIssued}
                          </p>
                        </div>
                        <Pill className="size-4 shrink-0 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {rx.length > 0 ? (
                <>
                  <Separator />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Repeat requests
                  </p>
                  {rx.map((r) => (
                    <div key={r.id} className="rounded-lg border border-border bg-surface p-3 text-sm">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                        <span className="min-w-0 truncate font-medium">
                          {r.medication} {r.dose}
                        </span>
                        <Badge variant="outline" className="shrink-0 capitalize">
                          {r.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Requested {r.requestedAt} via {r.requesterChannel}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/prescriptions">Open approvals queue</Link>
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Appointment history</CardTitle>
              <CardDescription>Past and upcoming contacts</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Clinician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reminder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="whitespace-nowrap text-xs tabular-nums">
                        {a.date} {a.start}
                      </TableCell>
                      <TableCell className="text-sm">
                        {a.type}
                        <span className="block text-xs text-muted-foreground">{a.mode}</span>
                      </TableCell>
                      <TableCell className="text-sm">{clinicianById(a.clinicianId)?.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={a.status} />
                      </TableCell>
                      <TableCell>
                        <ReminderBadge status={a.reminder} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {history.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">No appointments recorded.</p>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Submitted intake forms</CardTitle>
              <CardDescription>Digital questionnaires completed before appointments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {forms.map((f) => (
                <div key={f.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{f.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Submitted {f.submittedAt} · {f.sections} sections · {f.completion}% complete
                      </p>
                    </div>
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                  {f.flagged.length > 0 ? (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {f.flagged.map((fl) => (
                        <Badge key={fl} variant="outline" className="border-warning/45 bg-warning/15 text-warning">
                          {fl}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {forms.length === 0 ? (
                <p className="text-sm text-muted-foreground">No forms submitted by this patient.</p>
              ) : null}
              <Button variant="outline" size="sm" asChild>
                <Link to="/intake-forms">Open intake form workspace</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Documents and correspondence</CardTitle>
              <CardDescription>Letters, results and referrals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Outpatient clinic letter — Cardiology", date: "2026-07-18", size: "182 KB" },
                { name: "Blood results — full blood count", date: "2026-08-04", size: "94 KB" },
                { name: "Physiotherapy discharge summary", date: "2026-05-22", size: "121 KB" },
                { name: "Referral — MSK triage service", date: "2026-04-09", size: "76 KB" },
              ].map((d) => (
                <div
                  key={d.name}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.date} · {d.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    Preview
                  </Button>
                </div>
              ))}
              <DemoNote>Document previews are placeholders; no files are stored or retrieved.</DemoNote>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
