import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { UserPlus, Download, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  DemoNote,
  DisciplineBadge,
  PageHeader,
  RiskBadge,
  StatCard,
  initialsOf,
} from "@/components/clinical";
import { patients, practice, type Discipline, type RiskLevel } from "@/lib/mock-data";

export const Route = createFileRoute("/patients/")({
  head: () => ({
    meta: [
      { title: "Patient Directory — MedConnect" },
      {
        name: "description",
        content:
          "Searchable patient directory with service line, risk stratification and clinical flags for GP, dental and physiotherapy caseloads.",
      },
      { property: "og:title", content: "Patient Directory — MedConnect" },
      {
        property: "og:description",
        content: "Search and stratify the practice list across service lines. Interface demonstration.",
      },
    ],
  }),
  component: PatientsPage,
});

function PatientsPage() {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState<"all" | Discipline>("all");
  const [risk, setRisk] = useState<"all" | RiskLevel>("all");

  const rows = useMemo(
    () =>
      patients
        .filter((p) => (discipline === "all" ? true : p.discipline === discipline))
        .filter((p) => (risk === "all" ? true : p.risk === risk))
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.nhsNumber.replace(/\s/g, "").includes(query.replace(/\s/g, "")) ||
            p.postcode.toLowerCase().includes(query.toLowerCase()),
        ),
    [query, discipline, risk],
  );

  return (
    <>
      <PageHeader
        title="Patient directory"
        description="Search the practice list by name, NHS number or postcode. Risk banding highlights patients who need proactive contact."
        actions={
          <>
            <Button variant="outline">
              <Download className="size-4" />
              Export view
            </Button>
            <Button>
              <UserPlus className="size-4" />
              Register patient
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered list size" value={practice.listSize.toLocaleString("en-GB")} hint="Weighted list 9,860" />
        <StatCard label="Active caseloads" value="1,284" hint="Open GP, dental or physio episodes" />
        <StatCard label="High-risk cohort" value="212" hint="Frailty, DNA history or overdue review" tone="critical" />
        <StatCard label="Overdue reviews" value="68" hint="Long-term condition recalls" tone="warning" />
      </div>

      <Card className="mt-6 shadow-card">
        <CardHeader className="gap-4">
          <div>
            <CardTitle>Directory</CardTitle>
            <CardDescription>
              Showing {rows.length} of {patients.length} demonstration records
            </CardDescription>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor="pt-search" className="text-xs">
                Search
              </Label>
              <Input
                id="pt-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, NHS number or postcode"
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
              <Label className="text-xs">Risk band</Label>
              <Select value={risk} onValueChange={(v) => setRisk(v as "all" | RiskLevel)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All risk bands</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>NHS number</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Last seen</TableHead>
                  <TableHead>Next appointment</TableHead>
                  <TableHead className="text-right">Record</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar initials={initialsOf(p.name)} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {p.age} · {p.sex} · {p.postcode}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums">{p.nhsNumber}</TableCell>
                    <TableCell>
                      <DisciplineBadge discipline={p.discipline} />
                    </TableCell>
                    <TableCell>
                      <RiskBadge level={p.risk} />
                    </TableCell>
                    <TableCell className="text-xs tabular-nums text-muted-foreground">{p.lastSeen}</TableCell>
                    <TableCell className="text-xs tabular-nums text-muted-foreground">
                      {p.nextAppointment ?? "Not booked"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to="/patients/$patientId" params={{ patientId: p.id }}>
                          Open
                          <ChevronRight className="size-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {rows.map((p) => (
              <Link
                key={p.id}
                to="/patients/$patientId"
                params={{ patientId: p.id }}
                className="focus-ring block rounded-xl border border-border bg-surface p-4"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar initials={initialsOf(p.name)} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.age} · {p.sex} · {p.nhsNumber}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <DisciplineBadge discipline={p.discipline} />
                  <RiskBadge level={p.risk} />
                  {p.flags[0] ? (
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                      {p.flags[0]}
                    </Badge>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>

          {rows.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No records match these filters.
            </p>
          ) : null}

          <DemoNote>
            Every record shown is fabricated for demonstration. NHS numbers follow the display format but are not valid
            identifiers, and no clinical system is connected.
          </DemoNote>
        </CardContent>
      </Card>
    </>
  );
}
