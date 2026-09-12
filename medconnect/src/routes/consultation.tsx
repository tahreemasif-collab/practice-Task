import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  MonitorUp,
  MessageSquare,
  FileText,
  Pill,
  Signal,
  Users,
  Lock,
  UserRoundCheck,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, DemoNote, PageHeader, initialsOf } from "@/components/clinical";
import { patientById, waitingRoom } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Telemedicine Consultation Room — MedConnect" },
      {
        name: "description",
        content:
          "Video consultation room interface with virtual waiting room, in-call clinical notes, shared documents and prescribing shortcuts.",
      },
      { property: "og:title", content: "Telemedicine Consultation Room — MedConnect" },
      {
        property: "og:description",
        content: "Video consultation workspace for remote clinics. Interface demonstration, no live video.",
      },
    ],
  }),
  component: ConsultationPage,
});

function ConsultationPage() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const patient = patientById("p2")!;

  return (
    <>
      <PageHeader
        title="Consultation room"
        description="Remote clinic workspace: virtual waiting room, in-call notes and clinical shortcuts side by side with the video stage."
        actions={
          <Badge variant="outline" className="gap-1.5 border-warning/45 bg-warning/15 py-1.5 font-semibold text-warning">
            <Lock className="size-3.5" />
            Simulated session — no video connection
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <Card className="overflow-hidden shadow-card">
            <div className="relative aspect-video w-full bg-sidebar">
              <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="absolute inset-0 grid place-items-center p-6 pb-24 text-center sm:pb-28">
                <div>
                  <Avatar
                    initials={initialsOf(patient.name)}
                    className="mx-auto size-20 bg-sidebar-primary/20 text-2xl text-sidebar-primary"
                  />
                  <p className="mt-4 font-display text-xl font-bold text-sidebar-foreground">{patient.name}</p>
                  <p className="mt-1 text-sm text-sidebar-foreground/70">
                    Lower back follow-up · 30 minutes · Ms Kirsty Lomax
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-sidebar-accent px-3 py-1.5 text-xs font-medium text-sidebar-accent-foreground">
                    <Signal className="size-3.5" />
                    Video placeholder — this prototype renders no real media stream
                  </p>
                </div>
              </div>

              <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                <Badge className="border-transparent bg-destructive text-destructive-foreground">
                  <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-destructive-foreground" />
                  In consultation 06:41
                </Badge>
                <Badge variant="outline" className="border-white/25 bg-black/30 text-white">
                  Connection: good
                </Badge>
              </div>

              <div className="absolute bottom-3 right-3 w-28 overflow-hidden rounded-lg border border-white/20 bg-sidebar-accent sm:w-40">
                <div className="grid aspect-video place-items-center">
                  <span className="text-[10px] font-semibold text-sidebar-foreground/70 sm:text-xs">
                    {cam ? "Your camera" : "Camera off"}
                  </span>
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant={mic ? "outline" : "destructive"}
                  size="lg"
                  onClick={() => setMic((m) => !m)}
                  aria-pressed={!mic}
                >
                  {mic ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                  {mic ? "Mute" : "Unmute"}
                </Button>
                <Button
                  variant={cam ? "outline" : "destructive"}
                  size="lg"
                  onClick={() => setCam((c) => !c)}
                  aria-pressed={!cam}
                >
                  {cam ? <VideoIcon className="size-4" /> : <VideoOff className="size-4" />}
                  {cam ? "Stop video" : "Start video"}
                </Button>
                <Button variant="outline" size="lg">
                  <MonitorUp className="size-4" />
                  Share
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="size-4" />
                  Invite
                </Button>
                <Button variant="destructive" size="lg">
                  <PhoneOff className="size-4" />
                  End consultation
                </Button>
              </div>
              <DemoNote>
                Controls change local interface state only. No microphone, camera, or network permissions are requested.
              </DemoNote>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Consultation note</CardTitle>
              <CardDescription>Structured note drafted during the call</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Presenting problem",
                  value:
                    "Six-week history of lower back pain radiating to left buttock. Reports night pain on the pre-appointment questionnaire.",
                },
                {
                  label: "Assessment",
                  value:
                    "Reduced lumbar flexion. Straight leg raise 60 degrees on the left. No saddle anaesthesia or bladder disturbance. No red flags on direct questioning.",
                },
                {
                  label: "Plan",
                  value:
                    "Continue graded loading programme. Review in three weeks. Advise on analgesia timing before exercise. Safety-net advice given.",
                },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {f.label}
                  </label>
                  <Textarea className="mt-1.5" rows={3} defaultValue={f.value} />
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button>Save to record</Button>
                <Button variant="outline">Insert template</Button>
                <Button variant="ghost">Add SNOMED code</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRoundCheck className="size-4 text-primary" />
                Virtual waiting room
              </CardTitle>
              <CardDescription>{waitingRoom.length} patients checked in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {waitingRoom.map((w) => (
                <div key={w.patientId} className="rounded-xl border border-border bg-surface p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{w.patientName}</p>
                      <p className="truncate text-xs text-muted-foreground">{w.device}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0",
                        w.waitingMins > 10
                          ? "border-warning/45 bg-warning/15 text-warning"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {w.waitingMins} min
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-muted-foreground">Connection {w.connection}</span>
                    {w.consentRecorded ? (
                      <span className="font-medium text-success">Consent recorded</span>
                    ) : (
                      <span className="font-medium text-destructive">Consent outstanding</span>
                    )}
                  </div>
                  <Button size="sm" className="mt-3 w-full">
                    Admit to room
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Patient context</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary">
                <TabsList className="w-full">
                  <TabsTrigger value="summary" className="flex-1">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex-1">
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="flex-1">
                    Actions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-4 space-y-3 text-sm">
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conditions</p>
                    <p className="mt-1">{patient.conditions.join(", ")}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Medication</p>
                    <p className="mt-1">
                      {patient.medications.map((m) => `${m.name} ${m.dose}`).join(", ") || "None recorded"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alerts</p>
                    <p className="mt-1">{patient.flags.join(" · ")}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
                      Open full record
                    </Link>
                  </Button>
                </TabsContent>

                <TabsContent value="chat" className="mt-4">
                  <div className="space-y-2.5">
                    {[
                      { from: "clinician", text: "Hello Tomasz, can you hear me clearly?" },
                      { from: "patient", text: "Yes, all good thank you." },
                      { from: "clinician", text: "I'm sharing your exercise sheet now." },
                      { from: "patient", text: "Received it, thanks." },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className={cn(
                          "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                          m.from === "clinician"
                            ? "ml-auto bg-primary text-primary-foreground"
                            : "bg-muted text-foreground",
                        )}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                    <Input placeholder="Type a message" aria-label="Message" />
                    <Button size="icon" aria-label="Send message">
                      <Send className="size-4" />
                    </Button>
                  </div>
                  <DemoNote>Messages are local to this page and are never transmitted.</DemoNote>
                </TabsContent>

                <TabsContent value="actions" className="mt-4 space-y-2">
                  {[
                    { icon: Pill, label: "Issue prescription" },
                    { icon: FileText, label: "Send exercise plan" },
                    { icon: MessageSquare, label: "Request follow-up form" },
                    { icon: Users, label: "Refer to MSK service" },
                  ].map(({ icon: Icon, label }) => (
                    <Button key={label} variant="outline" className="w-full justify-start">
                      <Icon className="size-4" />
                      {label}
                    </Button>
                  ))}
                  <Separator className="my-3" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    In a production system these actions would write to the clinical record. Here they are inert.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
