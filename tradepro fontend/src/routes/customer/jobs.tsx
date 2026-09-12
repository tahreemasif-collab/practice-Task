import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Star,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  AlertTriangle,
  Activity,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/customer/jobs")({
  head: () => ({
    meta: [{ title: "My Bookings — TradePro 360" }],
  }),
  component: CustomerJobsPage,
});

interface JobItem {
  id: string;
  reference: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  postcode: string;
  scheduled_date: string | null;
  slot: string | null;
  company_id: string;
  engineer_id: string | null;
  engineers?: {
    id: string;
    profiles?: {
      full_name: string;
    } | null;
  } | null;
}

function CustomerJobsPage() {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [reviewedJobIds, setReviewedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // 1. Fetch customer matching this auth user
      const { data: cust } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!cust) {
        // Customer profile doesn't exist yet - means no jobs booked under this user
        setJobs([]);
        setLoading(false);
        return;
      }
      setCustomerId(cust.id);

      // 2. Fetch jobs booked by this customer
      const { data: jobData, error } = await supabase
        .from("jobs")
        .select("*, engineers(id, profiles:user_id(full_name))")
        .eq("customer_id", cust.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs((jobData as any[]) || []);

      // 3. Fetch already submitted reviews
      const { data: reviews } = await supabase
        .from("reviews")
        .select("job_id")
        .eq("customer_id", cust.id);

      if (reviews) {
        setReviewedJobIds(new Set(reviews.map((r) => r.job_id)));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openReviewModal = (job: JobItem) => {
    setSelectedJob(job);
    setRating(5);
    setComment("");
    setReviewOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !customerId) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        job_id: selectedJob.id,
        company_id: selectedJob.company_id,
        engineer_id: selectedJob.engineer_id,
        customer_id: customerId,
        rating,
        comment: comment || null,
        is_published: true, // auto-publish for demo, will recalculate engineer avg rating trigger
      });

      if (error) throw error;

      toast.success("Thank you for your feedback!");
      setReviewOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Pending Confirmation</Badge>;
      case "assigned":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Engineer Assigned</Badge>;
      case "en_route":
        return <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 animate-pulse">🚙 Engineer En Route</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">🔧 Work In Progress</Badge>;
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status.replace("_", " ")}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            My Service Bookings
          </h1>
          <p className="text-sm text-muted-foreground">
            Track status, engineer dispatches, and review completed service work.
          </p>
        </div>

        <Button variant="brand" className="rounded-xl font-bold gap-2" asChild>
          <a href="/#book">
            <PlusCircle className="size-4" /> Book New Quote
          </a>
        </Button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground text-sm">Loading bookings...</div>
      ) : jobs.length === 0 ? (
        <Card className="card-elevated p-12 text-center text-muted-foreground">
          <Briefcase className="mx-auto size-10 text-muted-foreground/30 mb-3" />
          <h3 className="text-lg font-bold text-foreground">No bookings found</h3>
          <p className="text-xs mt-1">Bookings will appear here once you schedule a free quote.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const hasReview = reviewedJobIds.has(job.id);
            const isCompleted = job.status === "completed";

            return (
              <Card key={job.id} className="card-elevated hover:border-brand/30 transition-all">
                <CardContent className="p-5 space-y-4">
                  {/* Status header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                        {job.reference}
                      </span>
                      {getStatusBadge(job.status)}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span>{job.scheduled_date || "To be scheduled"} ({job.slot || "anytime"})</span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground text-base">{job.title}</h3>
                    {job.description && (
                      <p className="text-xs text-muted-foreground">{job.description}</p>
                    )}
                  </div>

                  {/* Footer metadata & actions */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 text-brand" /> {job.postcode}
                      </span>

                      {job.engineers?.profiles?.full_name && (
                        <span className="flex items-center gap-1 bg-accent px-2 py-1 rounded-lg text-foreground font-semibold">
                          <User className="size-3.5 text-brand" /> Eng: {job.engineers.profiles.full_name}
                        </span>
                      )}
                    </div>

                    {isCompleted && (
                      <div>
                        {hasReview ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="size-3.5" /> Feedback Submitted
                          </span>
                        ) : (
                          <Button
                            variant="brand"
                            size="sm"
                            onClick={() => openReviewModal(job)}
                            className="rounded-xl text-xs font-bold gap-1 bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            <Star className="size-3.5 fill-current" /> Rate service
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Rate Your Service</DialogTitle>
            <DialogDescription>
              Help us improve! Rate your experience with engineer {selectedJob?.engineers?.profiles?.full_name || "assigned"}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 py-2">
            {/* Star selector */}
            <div className="space-y-2 text-center">
              <Label className="text-xs font-semibold block text-left">Your Rating *</Label>
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-all scale-100 hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`size-8 ${
                        star <= rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment area */}
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-xs font-semibold">Review Comment</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts on the quality of work, punctuality, and professionalism..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setReviewOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="brand" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
