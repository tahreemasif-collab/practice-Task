import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Star,
  Users,
  Wrench,
  TrendingUp,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "Overview — TradePro 360 Dashboard" }],
  }),
  component: DashboardOverview,
});

interface Job {
  id: string;
  reference: string;
  title: string;
  status: string;
  priority: string;
  postcode: string;
  scheduled_date: string | null;
  quote_pence: number | null;
  dispatch_score: number | null;
  dispatch_reason: string | null;
  customers?: { full_name: string; phone: string } | null;
}

function DashboardOverview() {
  const [stats, setStats] = useState({
    jobsTotal: 0,
    jobsOpen: 0,
    jobsToday: 0,
    jobsCompleted30d: 0,
    revenue30d: 0,
    engineersAvailable: 0,
    avgRating: 5.0,
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get logged in user's profile to find their company_id
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", userData.user.id)
        .single();

      const companyId = profile?.company_id;
      if (!companyId) {
        toast.error("No company associated with this user profile.");
        return;
      }

      // 1. Fetch recent jobs for this company
      const { data: jobs, error: jobsErr } = await supabase
        .from("jobs")
        .select("id, reference, title, status, priority, postcode, scheduled_date, quote_pence, dispatch_score, dispatch_reason, customers(full_name, phone)")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (jobsErr) throw jobsErr;
      setRecentJobs(jobs as any[] || []);

      // 2. Fetch counts/stats via RPC
      const { data: rpcStats, error: rpcErr } = await supabase.rpc("company_dashboard_stats", {
        _company_id: companyId,
      });

      if (rpcErr) throw rpcErr;

      if (rpcStats) {
        setStats({
          jobsTotal: rpcStats.jobs_total || 0,
          jobsOpen: rpcStats.jobs_open || 0,
          jobsToday: rpcStats.jobs_today || 0,
          jobsCompleted30d: rpcStats.jobs_completed_30d || 0,
          revenue30d: (rpcStats.revenue_30d_pence || 0) / 100, // convert pence to pounds
          engineersAvailable: rpcStats.engineers_available || 0,
          avgRating: rpcStats.avg_rating || 5.0,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAutoAssign = async (jobId: string) => {
    setAssigningId(jobId);
    try {
      const { data, error } = await supabase.rpc("auto_assign_job", { _job_id: jobId });
      if (error) throw error;

      if (data && data.assigned) {
        toast.success(`Assigned to ${data.engineer_name} (Score: ${data.score})`);
        loadData();
      } else {
        toast.warning(data?.reason || "No engineer available for auto-assign");
      }
    } catch (err: any) {
      toast.error(err.message || "Auto-assign failed");
    } finally {
      setAssigningId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">Pending</Badge>;
      case "assigned":
        return <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">Assigned</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "emergency") {
      return <Badge className="bg-red-600 text-white font-bold animate-pulse">🚨 Emergency</Badge>;
    }
    if (priority === "urgent") {
      return <Badge className="bg-amber-600 text-white font-semibold">⚡ Urgent</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Standard</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Business Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Live dispatch status, active jobs, and engineer availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="gap-2 rounded-xl">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="brand" size="sm" asChild className="gap-2 rounded-xl font-semibold shadow-md">
            <Link to="/dashboard/jobs" search={{ new: true } as any}>
              <Plus className="size-4" /> Create New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Active Jobs */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Open Jobs
            </CardTitle>
            <div className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">
              <Briefcase className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.jobsOpen}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Out of <span className="font-semibold text-foreground">{stats.jobsTotal}</span> bookings ({stats.jobsCompleted30d} completed in 30d)
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Today's Scheduled */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Scheduled Today
            </CardTitle>
            <div className="grid size-8 place-items-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.jobsToday}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Jobs dispatching today
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Available Engineers */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Engineers Ready
            </CardTitle>
            <div className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wrench className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.engineersAvailable}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active & ready for dispatch
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Avg Rating */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customer Satisfaction
            </CardTitle>
            <div className="grid size-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star className="size-4 fill-amber-500 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-2xl font-bold text-foreground">
              {stats.avgRating} <span className="text-xs text-amber-500 font-normal">/ 5.0</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground font-semibold text-emerald-600 dark:text-emerald-400">
              £{stats.revenue30d.toLocaleString("en-GB", { minimumFractionDigits: 2 })} (30d revenue)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Jobs & AI Smart Dispatch Preview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Jobs List (2 cols) */}
        <Card className="lg:col-span-2 card-elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Jobs</CardTitle>
              <CardDescription>Latest customer bookings and service calls</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-xs font-semibold text-brand">
              <Link to="/dashboard/jobs">View all jobs →</Link>
            </Button>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading recent jobs...</div>
            ) : recentJobs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Briefcase className="mx-auto size-8 text-muted-foreground/40 mb-2" />
                <p className="font-medium text-foreground">No jobs created yet</p>
                <p className="text-xs mt-1">Create your first job or convert incoming leads</p>
              </div>
            ) : (
              <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-accent/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          {job.reference}
                        </span>
                        {getStatusBadge(job.status)}
                        {getPriorityBadge(job.priority)}
                      </div>

                      <h3 className="font-semibold text-foreground text-sm">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-brand" /> {job.postcode}
                        </span>
                        {job.customers?.full_name && (
                          <span className="flex items-center gap-1">
                            <Users className="size-3" /> {job.customers.full_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {job.status === "pending" && (
                        <Button
                          variant="brand"
                          size="sm"
                          disabled={assigningId === job.id}
                          onClick={() => handleAutoAssign(job.id)}
                          className="gap-1.5 rounded-lg text-xs font-bold"
                        >
                          <Sparkles className="size-3.5" />
                          {assigningId === job.id ? "Assigning..." : "AI Auto-Assign"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Smart Dispatch Info Widget */}
        <Card className="card-elevated surface-glass bg-navy-gradient text-navy-foreground border-white/15">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground font-bold">
                <Sparkles className="size-4" />
              </div>
              <CardTitle className="text-lg font-bold text-navy-foreground">
                AI Smart Dispatch
              </CardTitle>
            </div>
            <CardDescription className="text-navy-foreground/70">
              Automated engineer allocation powered by Haversine distance & skill match matrix.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2 rounded-xl bg-white/5 p-3.5 border border-white/10 text-xs">
              <div className="flex items-center justify-between font-semibold">
                <span>Distance Weight</span>
                <span className="text-brand">40%</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Skill Match Weight</span>
                <span className="text-brand">25%</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Workload Balance</span>
                <span className="text-brand">20%</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Rating & Availability</span>
                <span className="text-brand">15%</span>
              </div>
            </div>

            <Button
              variant="brand"
              size="lg"
              asChild
              className="w-full rounded-xl font-bold shadow-lg gap-2"
            >
              <Link to="/dashboard/dispatch">
                Open Dispatch Center →
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
