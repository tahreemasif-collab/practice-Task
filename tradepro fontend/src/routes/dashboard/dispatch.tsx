import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Wrench,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Navigation,
  Star,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/dispatch")({
  head: () => ({
    meta: [{ title: "AI Smart Dispatch — TradePro 360" }],
  }),
  component: DispatchPage,
});

function DispatchPage() {
  const [unassignedJobs, setUnassignedJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const loadUnassigned = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, customers(full_name, phone)")
        .eq("status", "pending")
        .order("priority", { ascending: false });

      if (error) throw error;
      setUnassignedJobs(data || []);
      if (data && data.length > 0) {
        handleSelectJob(data[0]);
      } else {
        setSelectedJob(null);
        setRankings([]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load dispatch queue");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = async (job: any) => {
    setSelectedJob(job);
    setRankingLoading(true);
    try {
      const { data, error } = await supabase.rpc("rank_engineers_for_job", {
        _job_id: job.id,
      });

      if (error) throw error;
      setRankings(data || []);
    } catch (err: any) {
      toast.error(err.message || "Could not calculate engineer ranking");
    } finally {
      setRankingLoading(false);
    }
  };

  const handleAssign = async (engineerId: string, engineerName: string) => {
    if (!selectedJob) return;
    setAssigningId(engineerId);
    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          engineer_id: engineerId,
          status: "assigned",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedJob.id);

      if (error) throw error;

      toast.success(`Assigned ${selectedJob.reference} to ${engineerName}`);
      loadUnassigned();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign engineer");
    } finally {
      setAssigningId(null);
    }
  };

  useEffect(() => {
    loadUnassigned();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              AI Smart Dispatch Center
            </h1>
            <Badge className="bg-brand text-brand-foreground font-bold">LIVE AI</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Multi-factor scoring algorithm: Distance (40%) + Skill match (25%) + Workload (20%) + Rating (15%)
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadUnassigned} disabled={loading} className="gap-2 rounded-xl">
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh Queue
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Pending Jobs Queue */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>Unassigned Jobs Queue</span>
              <Badge variant="secondary">{unassignedJobs.length}</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Select a job to view real-time ranked engineer matches
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            {loading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">Loading queue...</div>
            ) : unassignedJobs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <CheckCircle2 className="mx-auto size-8 text-emerald-500 mb-2" />
                <p className="font-medium text-foreground text-sm">Queue is empty!</p>
                <p className="text-xs mt-1">All pending jobs have been dispatched.</p>
              </div>
            ) : (
              unassignedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                    selectedJob?.id === job.id
                      ? "border-brand bg-brand/10 shadow-sm"
                      : "border-border hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-brand">{job.reference}</span>
                    {job.priority === "emergency" && (
                      <Badge className="bg-red-600 text-white text-[10px]">🚨 Emergency</Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-foreground truncate">{job.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1"><MapPin className="size-3 text-brand" /> {job.postcode}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right Column: AI Ranking Breakdown & Assignment */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-brand" />
              <span>Ranked Candidate Engineers</span>
            </CardTitle>
            <CardDescription className="text-xs">
              {selectedJob ? (
                <>Candidates for <span className="font-semibold text-foreground">{selectedJob.reference}: {selectedJob.title}</span> ({selectedJob.postcode})</>
              ) : (
                "Select a job on the left to see ranked candidates"
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!selectedJob ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                No job selected
              </div>
            ) : rankingLoading ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                Calculating spatial distance & engineer workload matrix...
              </div>
            ) : rankings.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <AlertCircle className="mx-auto size-8 text-amber-500 mb-2" />
                <p className="font-semibold text-foreground">No matching active engineers found</p>
                <p className="text-xs mt-1">Check if engineers are set to 'Available' status.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rankings.map((candidate, idx) => (
                  <div
                    key={candidate.engineer_id}
                    className="flex flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`grid size-10 shrink-0 place-items-center rounded-xl font-extrabold text-sm ${
                        idx === 0 ? "bg-brand text-brand-foreground shadow-md" : "bg-muted text-muted-foreground"
                      }`}>
                        #{idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground text-sm">{candidate.engineer_name}</h4>
                          <Badge variant="outline" className="text-[10px]">
                            <Star className="size-3 fill-amber-500 text-amber-500 mr-1" />
                            {candidate.engineer_rating}
                          </Badge>
                          {candidate.skill_match && (
                            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px]">
                              Skill Match ✓
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">{candidate.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-brand">{candidate.score}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Score</div>
                      </div>

                      <Button
                        variant={idx === 0 ? "brand" : "outline"}
                        size="sm"
                        disabled={assigningId === candidate.engineer_id}
                        onClick={() => handleAssign(candidate.engineer_id, candidate.engineer_name)}
                        className="rounded-xl font-bold text-xs"
                      >
                        {assigningId === candidate.engineer_id ? "Assigning..." : "Assign Engineer"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
