import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  MapPin,
  Phone,
  Play,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Compass,
  Activity,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { updateJobStatus, pingLocation } from "@/lib/jobs.functions";

export const Route = createFileRoute("/engineer/jobs")({
  head: () => ({
    meta: [{ title: "My Schedule — TradePro 360" }],
  }),
  component: EngineerJobsPage,
});

interface JobItem {
  id: string;
  reference: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  postcode: string;
  address_line1: string | null;
  scheduled_date: string | null;
  slot: string | null;
  lat: number | null;
  lng: number | null;
  customers?: { full_name: string; phone: string } | null;
}

function EngineerJobsPage() {
  const [engineerId, setEngineerId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Complete Job Modal State
  const [completeOpen, setCompleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [finalPrice, setFinalPrice] = useState("120.00");
  const [notes, setNotes] = useState("");
  const [completing, setCompleting] = useState(false);

  // GPS Simulation State
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsLogs, setGpsLogs] = useState<string[]>([]);
  const gpsInterval = useRef<any>(null);

  // Current location tracking variables
  const currentCoords = useRef({ lat: 51.501, lng: -0.141 });

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: eng } = await supabase
        .from("engineers")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

      if (!eng) {
        toast.error("Engineer profile not found");
        return;
      }
      setEngineerId(eng.id);

      const { data: jobData, error } = await supabase
        .from("jobs")
        .select("*, customers(full_name, phone)")
        .eq("engineer_id", eng.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs((jobData as any[]) || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      if (gpsInterval.current) clearInterval(gpsInterval.current);
    };
  }, []);

  // Simulate GPS coordinates moving slightly towards target or randomly
  const simulateGPSPing = async () => {
    // Generate slight walk deviation (approx 10-20m)
    currentCoords.current.lat += (Math.random() - 0.5) * 0.002;
    currentCoords.current.lng += (Math.random() - 0.5) * 0.002;

    const lat = Number(currentCoords.current.lat.toFixed(6));
    const lng = Number(currentCoords.current.lng.toFixed(6));

    // Find any job currently active (en_route or in_progress) to link to ping
    const activeJob = jobs.find(j => j.status === "en_route" || j.status === "in_progress");

    try {
      await pingLocation({
        data: {
          lat,
          lng,
          jobId: activeJob?.id || undefined,
        }
      });

      const logMsg = `[${new Date().toLocaleTimeString()}] Pinged: ${lat}, ${lng} ${activeJob ? `(linked: ${activeJob.reference})` : "(idle)"}`;
      setGpsLogs(prev => [logMsg, ...prev.slice(0, 4)]);
    } catch (err: any) {
      console.error("GPS Ping failed", err);
    }
  };

  const handleGpsToggle = () => {
    if (gpsActive) {
      if (gpsInterval.current) clearInterval(gpsInterval.current);
      setGpsActive(false);
      toast.info("GPS Location sharing paused");
    } else {
      setGpsActive(true);
      toast.success("GPS Simulation sharing active (Every 10 seconds)");
      // Run once immediately
      simulateGPSPing();
      gpsInterval.current = setInterval(simulateGPSPing, 10000);
    }
  };

  const handleUpdateStatus = async (jobId: string, status: any) => {
    setUpdatingId(jobId);
    try {
      await updateJobStatus({
        data: {
          jobId,
          status,
        }
      });
      toast.success(`Status updated to ${status.replace("_", " ")}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const openCompleteModal = (job: JobItem) => {
    setSelectedJob(job);
    setCompleteOpen(true);
  };

  const handleCompleteJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setCompleting(true);
    try {
      const pricePence = Math.round(parseFloat(finalPrice) * 100);
      if (isNaN(pricePence) || pricePence < 0) {
        toast.error("Please enter a valid price");
        setCompleting(false);
        return;
      }

      // Update status to completed and log final price
      await updateJobStatus({
        data: {
          jobId: selectedJob.id,
          status: "completed",
          finalPricePence: pricePence,
        }
      });

      // Update job description notes or trigger log
      if (notes) {
        await supabase.from("job_events").insert({
          job_id: selectedJob.id,
          event_type: "completion_notes",
          meta: { notes },
        });
      }

      toast.success(`Job ${selectedJob.reference} completed successfully!`);
      setCompleteOpen(false);
      setNotes("");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to complete job");
    } finally {
      setCompleting(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "emergency") {
      return <Badge className="bg-red-600 text-white font-bold">🚨 Emergency</Badge>;
    }
    if (priority === "urgent") {
      return <Badge className="bg-amber-600 text-white font-semibold">⚡ Urgent</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Standard</Badge>;
  };

  const currentJob = jobs.find(j => j.status === "en_route" || j.status === "in_progress");
  const upcomingJobs = jobs.filter(j => j.status !== "completed" && j.status !== "cancelled" && j.id !== currentJob?.id);
  const historyJobs = jobs.filter(j => j.status === "completed" || j.status === "cancelled");

  return (
    <div className="space-y-6">
      {/* Mobile Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          My Jobs & Dispatch
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your routes, update booking statuses, and share real-time locations.
        </p>
      </div>

      {/* GPS Simulation Widget */}
      <Card className="card-elevated border-brand/30 bg-brand/5 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`grid size-10 place-items-center rounded-xl font-bold ${gpsActive ? "bg-emerald-500 text-white animate-pulse" : "bg-brand/10 text-brand"}`}>
              <Compass className={`size-5 ${gpsActive ? "animate-spin" : ""}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <span>GPS Location Simulation</span>
                {gpsActive && <Badge className="bg-emerald-500 text-white text-[9px] h-4">LIVE TRANSMITTING</Badge>}
              </h3>
              <p className="text-xs text-muted-foreground">
                Sends coordinates to the Dispatch Center every 10 seconds.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <Button
              variant={gpsActive ? "destructive" : "brand"}
              onClick={handleGpsToggle}
              size="sm"
              className="rounded-xl font-bold text-xs"
            >
              <Activity className="size-3.5 mr-1" />
              {gpsActive ? "Stop GPS Broadcast" : "Start GPS Broadcast"}
            </Button>
          </div>
        </CardContent>
        {gpsLogs.length > 0 && (
          <div className="border-t border-border px-4 py-2 bg-accent/40 text-[10px] font-mono space-y-0.5 max-h-[85px] overflow-y-auto">
            {gpsLogs.map((log, index) => (
              <div key={index} className="text-muted-foreground">{log}</div>
            ))}
          </div>
        )}
      </Card>

      {/* Active Job Feature */}
      {currentJob ? (
        <Card className="card-elevated border-brand bg-brand/10 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                {currentJob.reference}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide bg-brand text-brand-foreground">
                {currentJob.status === "en_route" ? "🚙 En Route" : "🔧 In Progress"}
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-foreground mt-2">{currentJob.title}</CardTitle>
            <CardDescription className="text-xs">{currentJob.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Details */}
            <div className="grid gap-3 rounded-xl border border-border p-3.5 bg-background text-xs">
              <div className="flex items-start gap-2.5">
                <User className="size-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-foreground">Customer</div>
                  <div className="text-muted-foreground">{currentJob.customers?.full_name}</div>
                  <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="size-3" /> {currentJob.customers?.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-border pt-2">
                <MapPin className="size-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-foreground">Location postcode</div>
                  <div className="text-muted-foreground">{currentJob.postcode}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {currentJob.status === "en_route" ? (
                <Button
                  variant="brand"
                  className="w-full rounded-xl font-bold shadow-md"
                  disabled={updatingId === currentJob.id}
                  onClick={() => handleUpdateStatus(currentJob.id, "in_progress")}
                >
                  <Play className="size-4 mr-1.5 fill-current" /> Arrived at Site & Start
                </Button>
              ) : (
                <Button
                  variant="brand"
                  className="w-full rounded-xl font-bold shadow-md bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => openCompleteModal(currentJob)}
                >
                  <CheckCircle2 className="size-4 mr-1.5" /> Mark Job Completed
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Schedule / Upcoming Section */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
          <Briefcase className="size-4.5 text-brand" />
          <span>My Assigned Tasks</span>
          <Badge variant="secondary" className="rounded-full">{upcomingJobs.length}</Badge>
        </h3>

        {loading ? (
          <div className="py-8 text-center text-xs text-muted-foreground">Loading roster...</div>
        ) : upcomingJobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
            No upcoming assignments. Select offline or available status in the dashboard.
          </div>
        ) : (
          <div className="grid gap-3">
            {upcomingJobs.map((job) => (
              <Card key={job.id} className="card-elevated hover:border-brand/30 transition-all">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                        {job.reference}
                      </span>
                      {getPriorityBadge(job.priority)}
                      <Badge variant="outline" className="capitalize text-[10px]">{job.status}</Badge>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span>{job.scheduled_date} ({job.slot || "anytime"})</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground text-sm">{job.title}</h4>
                    {job.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{job.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 text-brand" /> {job.postcode}
                    </div>

                    {job.status === "assigned" && !currentJob && (
                      <Button
                        variant="brand"
                        size="sm"
                        disabled={updatingId === job.id}
                        onClick={() => handleUpdateStatus(job.id, "en_route")}
                        className="rounded-lg font-bold text-[11px] gap-1"
                      >
                        <Navigation className="size-3 fill-current" /> Dispatch
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* History section */}
      {historyJobs.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-muted-foreground">Completed / Logged Jobs</h3>
          <div className="grid gap-2">
            {historyJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-xl border border-border p-3 bg-accent/20 text-xs">
                <div>
                  <div className="font-bold text-foreground flex items-center gap-2">
                    <span className="font-mono text-[10px]">{job.reference}</span>
                    <span>{job.title}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Postcode: {job.postcode} · {job.scheduled_date}</div>
                </div>
                <Badge className={job.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                  {job.status === "completed" ? "Completed" : "Cancelled"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete Job Dialog */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Complete Job {selectedJob?.reference}</DialogTitle>
            <DialogDescription>
              Confirm job completion details and final price for invoice generation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCompleteJob} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="finalPrice" className="text-xs font-semibold">Final Price (£ GBP) *</Label>
              <Input
                id="finalPrice"
                type="number"
                step="0.01"
                placeholder="120.00"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs font-semibold">Job Summary / Notes</Label>
              <Textarea
                id="notes"
                placeholder="Details of repair, access notes, parts replaced, or customer feedback..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setCompleteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" disabled={completing} className="bg-emerald-600 hover:bg-emerald-700">
                Submit & Complete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
