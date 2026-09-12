import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pill, AlertTriangle, Check, X, MessageCircleQuestion, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DemoNote, PageHeader, StatCard } from "@/components/clinical";
import { prescriptions, type PrescriptionRequest } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prescriptions")({
  head: () => ({
    meta: [
      { title: "Repeat Prescription Approvals — MedConnect" },
      {
        name: "description",
        content:
          "Batch review repeat prescription requests with interaction warnings, overdue monitoring alerts and nominated pharmacy details.",
      },
      { property: "og:title", content: "Repeat Prescription Approvals — MedConnect" },
      {
        property: "og:description",
        content: "Safe, batched repeat prescription review. Interface demonstration.",
      },
    ],
  }),
  component: PrescriptionsPage,
});

const statusStyle: Record<PrescriptionRequest["status"], string> = {
  pending: "border-warning/45 bg-warning/15 text-warning",
  approved: "border-success/35 bg-success/12 text-success",
  declined: "border-destructive/40 bg-destructive/12 text-destructive",
  query: "border-info/35 bg-info/12 text-info",
};

function RequestCard({
  r,
  selected,
  onToggle,
}: {
  r: PrescriptionRequest;
  selected: boolean;
  onToggle: () => void;
}) {
  const warn = r.interactionWarnings.length > 0 || r.overdueReview;
  return (
    <Card className={cn("shadow-card", warn ? "border-warning/35" : undefined)}>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="flex min-w-0 gap-3">
            {r.status === "pending" ? (
              <Checkbox
                checked={selected}
                onCheckedChange={onToggle}
                className="mt-1 shrink-0"
                aria-label={`Select ${r.medication} for ${r.patientName}`}
              />
            ) : (
              <span className="mt-1 size-4 shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="min-w-0 truncate font-display text-base font-bold">
                  {r.medication} {r.dose}
                </h2>
                <Badge variant="outline" className={cn("capitalize", statusStyle[r.status])}>
                  {r.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm">
                <Link
                  to="/patients/$patientId"
                  params={{ patientId: r.patientId }}
                  className="focus-ring font-semibold hover:underline"
                >
                  {r.patientName}
                </Link>
                <span className="text-muted-foreground"> · {r.age} years</span>
              </p>
              <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
                {[
                  ["Quantity", r.quantity],
                  ["Last issued", r.lastIssued],
                  ["Requested", `${r.requestedAt} · ${r.requesterChannel}`],
                  ["Nominated pharmacy", r.pharmacy],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[132px_minmax(0,1fr)] gap-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="min-w-0 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>

              {(r.interactionWarnings.length > 0 || r.overdueReview) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.overdueReview ? (
                    <Badge variant="outline" className="gap-1 border-destructive/40 bg-destructive/12 text-destructive">
                      <Clock className="size-3" />
                      Medication review overdue
                    </Badge>
                  ) : null}
                  {r.interactionWarnings.map((w) => (
                    <Badge key={w} variant="outline" className="gap-1 border-warning/45 bg-warning/15 text-warning">
                      <AlertTriangle className="size-3" />
                      {w}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {r.status === "pending" || r.status === "query" ? (
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button size="sm">
                <Check className="size-3.5" />
                Approve
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircleQuestion className="size-3.5" />
                Query
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                <X className="size-3.5" />
                Decline
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground lg:text-right">
              Actioned by Dr A. Nwosu
              <br />
              20 August 2026
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PrescriptionsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const pending = prescriptions.filter((p) => p.status === "pending" || p.status === "query");
  const actioned = prescriptions.filter((p) => p.status === "approved" || p.status === "declined");

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <>
      <PageHeader
        title="Repeat prescriptions"
        description="Review requests in batches with monitoring and interaction warnings surfaced before approval, then send to the patient's nominated pharmacy."
        actions={
          <>
            <Button variant="outline" disabled={selected.length === 0}>
              Decline selected
            </Button>
            <Button disabled={selected.length === 0}>
              <Check className="size-4" />
              Approve {selected.length || ""} selected
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Awaiting decision" value={String(pending.length)} hint="Oldest waiting 26 hours" tone="warning" icon={<Pill className="size-5" />} />
        <StatCard label="Safety warnings" value="4" hint="Interaction or monitoring flags" tone="critical" icon={<AlertTriangle className="size-5" />} />
        <StatCard label="Issued this week" value="218" hint="94% within 48 hours" tone="positive" />
        <StatCard label="Median turnaround" value="18 hrs" hint="Target within 48 hours" tone="positive" />
      </div>

      <Tabs defaultValue="queue" className="mt-6">
        <TabsList>
          <TabsTrigger value="queue">Awaiting decision ({pending.length})</TabsTrigger>
          <TabsTrigger value="actioned">Recently actioned ({actioned.length})</TabsTrigger>
          <TabsTrigger value="policy">Practice policy</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4 space-y-3">
          {pending.map((r) => (
            <RequestCard key={r.id} r={r} selected={selected.includes(r.id)} onToggle={() => toggle(r.id)} />
          ))}
          <DemoNote>
            No prescription is ever created, signed, or sent from this prototype. Warnings shown are illustrative
            examples, not clinical decision support.
          </DemoNote>
        </TabsContent>

        <TabsContent value="actioned" className="mt-4 space-y-3">
          {actioned.map((r) => (
            <RequestCard key={r.id} r={r} selected={false} onToggle={() => {}} />
          ))}
        </TabsContent>

        <TabsContent value="policy" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Approval rules</CardTitle>
                <CardDescription>Configured by the prescribing lead</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  "Requests for controlled drugs always route to a named prescriber.",
                  "Items with an overdue medication review cannot be batch approved.",
                  "Requests more than seven days early are held and the patient is notified.",
                  "Pharmacy-originated requests require reconciliation against the repeat template.",
                ].map((t) => (
                  <div key={t} className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    <p className="min-w-0 leading-relaxed">{t}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Decline reason template</CardTitle>
                <CardDescription>Sent to the patient with their request outcome</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  rows={7}
                  defaultValue={
                    "Thank you for your repeat request. Before we can issue this medication we need to review your recent test results. Please book a medication review appointment — reception can offer a telephone slot within the next week.\n\nIf you have run out of medication, contact the practice so we can arrange an interim supply."
                  }
                />
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Save template</Button>
                  <Button size="sm" variant="outline">
                    Restore default
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
