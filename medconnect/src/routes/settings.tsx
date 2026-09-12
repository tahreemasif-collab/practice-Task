import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert, Plug, ShieldCheck, Bell, Building2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, DemoNote, DisciplineBadge, PageHeader, initialsOf } from "@/components/clinical";
import { clinicians, practice } from "@/lib/mock-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Practice Settings — MedConnect" },
      {
        name: "description",
        content:
          "Configure practice details, reminder rules, team access, and review the integration surfaces a live deployment would connect to.",
      },
      { property: "og:title", content: "Practice Settings — MedConnect" },
      {
        property: "og:description",
        content: "Practice configuration and integration surfaces. Interface demonstration.",
      },
    ],
  }),
  component: SettingsPage,
});

const integrations = [
  { name: "SMS & voice reminders", detail: "Outbound patient messaging provider", status: "Not connected" },
  { name: "Calendar synchronisation", detail: "Two-way clinician calendar sync", status: "Not connected" },
  { name: "Clinical record system", detail: "Patient demographics and coded entries", status: "Not connected" },
  { name: "Electronic prescribing", detail: "Send signed prescriptions to pharmacies", status: "Not connected" },
  { name: "Video consultation service", detail: "Real-time media for remote clinics", status: "Not connected" },
  { name: "Single sign-on", detail: "Smartcard or directory-based staff sign-in", status: "Not connected" },
];

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Practice configuration, reminder policy, team access and the integration surfaces a production deployment would require."
        actions={<Button>Save changes</Button>}
      />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/12 p-4">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-warning" />
        <div className="min-w-0">
          <p className="text-sm font-bold">This is an interface demonstration</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            No integrations are wired up, no accounts exist, and nothing you change on this page is saved. Messaging,
            calendar, records, prescribing, video and sign-in panels below show how those surfaces would be presented
            and configured — they are deliberately inert.
          </p>
        </div>
      </div>

      <Tabs defaultValue="practice">
        <TabsList className="flex-wrap">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="size-4 text-primary" />
                  Practice details
                </CardTitle>
                <CardDescription>Shown on patient correspondence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="s-name">Practice name</Label>
                  <Input id="s-name" defaultValue={practice.name} className="mt-1.5" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="s-ods">ODS code</Label>
                    <Input id="s-ods" defaultValue={practice.odsCode} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="s-phone">Main telephone</Label>
                    <Input id="s-phone" defaultValue="0113 496 0100" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="s-address">Address</Label>
                  <Textarea id="s-address" rows={3} defaultValue={practice.address} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="s-tz">Time zone</Label>
                  <Select defaultValue="london">
                    <SelectTrigger id="s-tz" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="london">Europe/London (GMT+1)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Service lines and opening hours</CardTitle>
                <CardDescription>Bookable capacity windows per service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "General practice", hours: "08:00 – 18:30, Monday to Friday", on: true },
                  { name: "Extended access", hours: "18:30 – 20:00, Tuesday and Thursday", on: true },
                  { name: "Dental", hours: "09:00 – 17:00, Monday to Friday", on: true },
                  { name: "Physiotherapy", hours: "08:00 – 16:00, Monday to Friday", on: true },
                  { name: "Saturday morning clinic", hours: "09:00 – 12:00, Saturday", on: false },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.hours}</p>
                    </div>
                    <Switch defaultChecked={s.on} aria-label={`Enable ${s.name}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="size-4 text-primary" />
                  Reminder schedule
                </CardTitle>
                <CardDescription>When patients are contacted before an appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "7 days before — SMS", on: true },
                  { label: "48 hours before — email with intake link", on: true },
                  { label: "24 hours before — SMS requesting confirmation", on: true },
                  { label: "2 hours before — arrival instructions", on: true },
                  { label: "Automated voice call for high-risk slots", on: false },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface p-3"
                  >
                    <p className="min-w-0 text-sm">{r.label}</p>
                    <Switch defaultChecked={r.on} aria-label={r.label} />
                  </div>
                ))}
                <Separator />
                <div>
                  <Label htmlFor="s-threshold">Escalate to a phone call above risk score</Label>
                  <Select defaultValue="65">
                    <SelectTrigger id="s-threshold" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50% — cautious</SelectItem>
                      <SelectItem value="65">65% — balanced</SelectItem>
                      <SelectItem value="80">80% — highest risk only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Message templates</CardTitle>
                <CardDescription>Plain-English wording sent to patients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="s-sms">Confirmation SMS</Label>
                  <Textarea
                    id="s-sms"
                    rows={4}
                    className="mt-1.5"
                    defaultValue={
                      "Ashgrove Health Group: your appointment is on {date} at {time} with {clinician}. Reply Y to confirm or N to cancel so we can offer the slot to someone else."
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="s-email">Intake form email</Label>
                  <Textarea
                    id="s-email"
                    rows={4}
                    className="mt-1.5"
                    defaultValue={
                      "Before your appointment on {date}, please complete a few questions. It takes about four minutes and helps your clinician prepare. If you need help, call the practice and we can complete it with you."
                    }
                  />
                </div>
                <DemoNote>Templates are illustrative and no messages can be sent from this prototype.</DemoNote>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-primary" />
                Team and access levels
              </CardTitle>
              <CardDescription>Role-based permissions across the practice suite</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Access level</TableHead>
                    <TableHead>Prescribing</TableHead>
                    <TableHead className="text-right">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinicians.map((c, i) => (
                    <TableRow key={c.id}>
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
                      <TableCell className="text-sm">
                        {i === 0 ? "Practice administrator" : i < 3 ? "Clinical" : "Clinical (service scoped)"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            i < 2 || i === 3
                              ? "border-success/35 bg-success/12 text-success"
                              : "border-border text-muted-foreground"
                          }
                        >
                          {i < 2 || i === 3 ? "Enabled" : "Not enabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <DemoNote>
                  There is no sign-in, user account, or permission enforcement in this prototype — the table shows how
                  access management would be presented.
                </DemoNote>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plug className="size-4 text-primary" />
                Integration surfaces
              </CardTitle>
              <CardDescription>
                Every connection below is intentionally unconfigured in this demonstration build
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {integrations.map((i) => (
                <div key={i.name} className="rounded-xl border border-border bg-surface p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{i.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{i.detail}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 border-border text-muted-foreground">
                      {i.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full" disabled>
                    Configure — unavailable in demo
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-4 text-primary" />
                Information governance surface
              </CardTitle>
              <CardDescription>How safeguards would be presented in a live deployment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Access to patient records restricted by role and legitimate relationship",
                "Full audit trail of record views, edits and prescription decisions",
                "Retention schedules aligned to national records management guidance",
                "Data protection impact assessment completed before go-live",
              ].map((t) => (
                <div
                  key={t}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <p className="min-w-0 text-sm leading-relaxed">{t}</p>
                  <Badge variant="outline" className="shrink-0 border-border text-muted-foreground">
                    Design intent
                  </Badge>
                </div>
              ))}
              <DemoNote>
                These statements describe intended production behaviour. This prototype implements no authentication,
                access control, audit logging, or encryption.
              </DemoNote>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Display preferences</CardTitle>
                <CardDescription>Applied for every user of this workstation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "High contrast clinical palette", on: false },
                  { label: "Larger base text size", on: false },
                  { label: "Reduce interface motion", on: true },
                  { label: "Always show status text alongside colour", on: true },
                  { label: "Underline links in body content", on: true },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface p-3"
                  >
                    <p className="min-w-0 text-sm">{p.label}</p>
                    <Switch defaultChecked={p.on} aria-label={p.label} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Accessibility commitments</CardTitle>
                <CardDescription>Baked into the component library</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Text contrast meets WCAG 2.2 AA in both light and dark themes.",
                  "Every interactive element is reachable and operable by keyboard with a visible focus ring.",
                  "Clinical status is conveyed by icon and text as well as colour.",
                  "Layouts reflow to a single column without horizontal scrolling at 320px.",
                  "Form fields have persistent visible labels, never placeholder-only labelling.",
                  "A skip link precedes the main navigation on every screen.",
                ].map((t) => (
                  <p key={t} className="leading-relaxed">
                    · {t}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
