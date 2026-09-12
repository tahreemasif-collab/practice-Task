import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardList, Plus, CheckCheck, AlertTriangle, FilePlus2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DemoNote, DisciplineBadge, PageHeader, StatCard } from "@/components/clinical";
import { intakeForms } from "@/lib/mock-data";

export const Route = createFileRoute("/intake-forms")({
  head: () => ({
    meta: [
      { title: "Digital Intake Forms — MedConnect" },
      {
        name: "description",
        content:
          "Review digital pre-appointment questionnaires, red-flag triggers and completion rates, plus a patient-facing intake form preview.",
      },
      { property: "og:title", content: "Digital Intake Forms — MedConnect" },
      {
        property: "og:description",
        content: "Pre-appointment questionnaires with red-flag review. Interface demonstration.",
      },
    ],
  }),
  component: IntakeFormsPage,
});

const statusStyles = {
  "awaiting-review": { label: "Awaiting review", className: "border-info/35 bg-info/12 text-info" },
  "action-needed": { label: "Action needed", className: "border-destructive/40 bg-destructive/12 text-destructive" },
  reviewed: { label: "Reviewed", className: "border-success/35 bg-success/12 text-success" },
  draft: { label: "Patient draft", className: "border-border bg-muted text-muted-foreground" },
} as const;

function IntakeFormsPage() {
  const [pain, setPain] = useState([6]);

  return (
    <>
      <PageHeader
        title="Digital intake forms"
        description="Patients complete structured questionnaires before arriving. Red-flag answers are surfaced to the clinical team for triage."
        actions={
          <>
            <Button variant="outline">
              <FilePlus2 className="size-4" />
              Form templates
            </Button>
            <Button>
              <Plus className="size-4" />
              Send form to patient
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Submitted this week" value="146" hint="Across all service lines" tone="positive" icon={<ClipboardList className="size-5" />} />
        <StatCard label="Awaiting review" value="3" hint="Target: reviewed within 24 hours" tone="warning" />
        <StatCard label="Red flags raised" value="1" hint="MSK night pain — physio triage" tone="critical" icon={<AlertTriangle className="size-5" />} />
        <StatCard label="Completion rate" value="82%" hint="Median time 4m 12s" icon={<CheckCheck className="size-5" />} />
      </div>

      <Tabs defaultValue="queue" className="mt-6">
        <TabsList>
          <TabsTrigger value="queue">Review queue</TabsTrigger>
          <TabsTrigger value="preview">Patient form preview</TabsTrigger>
          <TabsTrigger value="builder">Template library</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          <div className="space-y-3">
            {intakeForms.map((f) => {
              const s = statusStyles[f.status];
              return (
                <Card key={f.id} className="shadow-card">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="min-w-0 truncate font-display text-base font-bold">{f.title}</h2>
                          <DisciplineBadge discipline={f.discipline} />
                          <Badge variant="outline" className={s.className}>
                            {s.label}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {f.submittedBy} · submitted {f.submittedAt}
                        </p>
                        {f.flagged.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {f.flagged.map((fl) => (
                              <Badge
                                key={fl}
                                variant="outline"
                                className="gap-1 border-warning/45 bg-warning/15 font-medium text-warning"
                              >
                                <AlertTriangle className="size-3" />
                                {fl}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-4 max-w-sm">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Completion · {f.sections} sections
                            </span>
                            <span className="font-semibold tabular-nums">{f.completion}%</span>
                          </div>
                          <Progress value={f.completion} className="mt-1.5 h-1.5" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/patients/$patientId" params={{ patientId: f.patientId }}>
                            Patient record
                          </Link>
                        </Button>
                        <Button size="sm" disabled={f.status === "reviewed"}>
                          {f.status === "reviewed" ? "Reviewed" : "Review answers"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <DemoNote>
              Reviewing does not write to any clinical record — this queue is a static demonstration of the workflow.
            </DemoNote>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>MSK self-assessment</CardTitle>
                <CardDescription>
                  This is how the questionnaire appears to a patient on their phone or computer before a
                  physiotherapy appointment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Section 1 of 5 — About you
                  </p>
                  <Progress value={20} className="mt-2 h-1.5" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="if-name">Full name</Label>
                    <Input id="if-name" defaultValue="Tomasz Kaminski" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="if-dob">Date of birth</Label>
                    <Input id="if-dob" type="date" defaultValue="1991-11-24" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="if-phone">Contact number</Label>
                    <Input id="if-phone" defaultValue="07700 900338" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="if-nhs">NHS number (if known)</Label>
                    <Input id="if-nhs" defaultValue="512 660 3184" className="mt-1.5" />
                  </div>
                </div>

                <Separator />

                <fieldset>
                  <legend className="text-sm font-semibold">Where is your main problem?</legend>
                  <RadioGroup defaultValue="lower-back" className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(
                      [
                        ["lower-back", "Lower back"],
                        ["neck", "Neck or shoulder"],
                        ["knee", "Hip or knee"],
                        ["other", "Somewhere else"],
                      ] as const
                    ).map(([v, l]) => (
                      <Label
                        key={v}
                        htmlFor={`loc-${v}`}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface p-3 text-sm font-normal"
                      >
                        <RadioGroupItem value={v} id={`loc-${v}`} />
                        {l}
                      </Label>
                    ))}
                  </RadioGroup>
                </fieldset>

                <div>
                  <Label htmlFor="if-pain">
                    Pain today — 0 is no pain, 10 is the worst imaginable
                  </Label>
                  <div className="mt-3 flex items-center gap-4">
                    <Slider
                      id="if-pain"
                      value={pain}
                      onValueChange={setPain}
                      max={10}
                      step={1}
                      className="min-w-0 flex-1"
                    />
                    <span className="w-10 shrink-0 rounded-md bg-muted py-1 text-center font-display text-sm font-bold tabular-nums">
                      {pain[0]}
                    </span>
                  </div>
                </div>

                <fieldset>
                  <legend className="text-sm font-semibold">
                    Please tick anything that applies to you
                  </legend>
                  <p className="mt-1 text-xs text-muted-foreground">
                    These questions help us spot problems that need urgent assessment.
                  </p>
                  <div className="mt-3 space-y-2">
                    {[
                      ["Pain that wakes me at night", true],
                      ["Numbness around the groin or buttocks", false],
                      ["Loss of bladder or bowel control", false],
                      ["Unexplained weight loss", false],
                      ["Recent significant injury or fall", false],
                    ].map(([label, checked]) => (
                      <Label
                        key={String(label)}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3 text-sm font-normal"
                      >
                        <Checkbox defaultChecked={Boolean(checked)} className="mt-0.5" />
                        <span className="min-w-0">{label}</span>
                      </Label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <Label htmlFor="if-notes">Anything else your physiotherapist should know?</Label>
                  <Textarea
                    id="if-notes"
                    className="mt-1.5"
                    rows={4}
                    defaultValue="Pain is worse in the morning and after driving. Would prefer an interpreter if possible."
                  />
                </div>

                <Label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/50 p-3 text-sm font-normal">
                  <Checkbox defaultChecked className="mt-0.5" />
                  <span className="min-w-0">
                    I agree that the practice may use my answers to prepare for my appointment.
                  </span>
                </Label>

                <div className="flex flex-wrap gap-2">
                  <Button>Continue to section 2</Button>
                  <Button variant="outline">Save and finish later</Button>
                </div>
                <DemoNote>
                  Nothing entered here is submitted, stored, or transmitted anywhere — this is a visual prototype of
                  the patient experience.
                </DemoNote>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-destructive/30 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="size-4 text-destructive" />
                    Triage flags detected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-xs">
                  <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 leading-relaxed">
                    <span className="font-bold">Night pain reported.</span> Route to senior MSK physiotherapist for
                    same-week assessment.
                  </p>
                  <p className="rounded-lg border border-border bg-surface p-3 leading-relaxed">
                    <span className="font-semibold">Interpreter requested (Polish).</span> Add to appointment notes and
                    extend slot by 10 minutes.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Accessibility built in</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  {[
                    "Every field carries a visible label and a keyboard-reachable control.",
                    "Questions use plain English at reading age 9 or below.",
                    "Forms reflow to a single column on small screens with 44px touch targets.",
                    "Colour is never the only signal — flags also carry icons and text.",
                  ].map((t) => (
                    <p key={t} className="leading-relaxed">
                      · {t}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="builder" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { name: "New patient registration", discipline: "GP", fields: 34, used: "412 times" },
              { name: "Long-term condition review", discipline: "GP", fields: 22, used: "268 times" },
              { name: "MSK self-assessment", discipline: "Physio", fields: 18, used: "191 times" },
              { name: "Dental medical history", discipline: "Dental", fields: 26, used: "377 times" },
              { name: "Paediatric consent", discipline: "Dental", fields: 14, used: "88 times" },
              { name: "Post-operative rehab diary", discipline: "Physio", fields: 11, used: "64 times" },
            ].map((t) => (
              <Card key={t.name} className="shadow-card">
                <CardContent className="p-5">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <p className="min-w-0 font-semibold">{t.name}</p>
                    <DisciplineBadge discipline={t.discipline as "GP" | "Dental" | "Physio"} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t.fields} fields · used {t.used}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      Duplicate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
