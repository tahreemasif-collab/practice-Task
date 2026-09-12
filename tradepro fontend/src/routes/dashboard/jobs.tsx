import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createJob } from "@/lib/jobs.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Calendar,
  Clock,
  Filter,
  Loader2,
  MapPin,
  Plus,
  Search,
  Sparkles,
  User,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/jobs")({
  head: () => ({
    meta: [{ title: "Jobs Board — TradePro 360" }],
  }),
  component: JobsBoardPage,
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
  dispatch_score: number | null;
  dispatch_reason: string | null;
  company_id: string;
  engineer_id: string | null;
  customers?: { full_name: string; phone: string } | null;
  engineers?: { user_id: string; profiles?: { full_name: string } } | null;
}

function JobsBoardPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Create Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postcode, setPostcode] = useState("");
  const [priority, setPriority] = useState<"standard" | "urgent" | "emergency">("standard");
  const [slot, setSlot] = useState<string>("morning");
  const [scheduledDate, setScheduledDate] = useState("");

  // Customer & Service States
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [newCustomerMode, setNewCustomerMode] = useState<boolean>(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  // Inline Customer Form Fields
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPostcode, setCustPostcode] = useState("");

  const loadJobs = async () => {
    setLoading(true);
    try {
      // Get companies for tenant selection
      const { data: compData } = await supabase.from("companies").select("id, name").limit(10);
      if (compData && compData.length > 0) {
        setCompanies(compData);
        if (!selectedCompanyId && compData[0]) setSelectedCompanyId(compData[0].id);
      }

      // Fetch customers & services for linking
      const { data: custData } = await supabase.from("customers").select("id, full_name, phone");
      setCustomers(custData || []);

      const { data: svcData } = await supabase.from("services").select("id, name").eq("is_active", true);
      setServices(svcData || []);

      let query = supabase
        .from("jobs")
        .select("*, customers(full_name, phone)");

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (priorityFilter !== "all") {
        query = query.eq("priority", priorityFilter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setJobs((data as any[]) || []);
    } catch (err: any) {
      toast.error(err.message || "Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [statusFilter, priorityFilter]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !postcode) {
      toast.error("Title and Postcode are required");
      return;
    }

    setSubmitting(true);
    try {
      const currentCompanyId = selectedCompanyId || (companies.length > 0 ? companies[0].id : null);

      // Handle Customer insertion if new mode
      let customerId = selectedCustomerId;
      if (newCustomerMode) {
        if (!custName || !custPhone) {
          toast.error("Customer Name and Phone are required for new registration");
          setSubmitting(false);
          return;
        }

        const { data: newCust, error: custErr } = await supabase
          .from("customers")
          .insert({
            company_id: currentCompanyId,
            full_name: custName,
            phone: custPhone,
            email: custEmail || null,
            postcode: custPostcode || postcode,
          })
          .select("id")
          .single();

        if (custErr) throw custErr;
        customerId = newCust.id;
      }

      // Call server fn which inserts and performs geocoding
      const job = await createJob({
        data: {
          companyId: currentCompanyId,
          customerId: customerId || undefined,
          serviceId: selectedServiceId || undefined,
          title,
          description: description || undefined,
          postcode: postcode.toUpperCase(),
          priority,
          slot: slot as any,
          scheduledDate: scheduledDate || undefined,
        },
      });

      toast.success(`Job created successfully!`);
      setCreateOpen(false);
      // Reset form
      setTitle("");
      setDescription("");
      setPostcode("");
      setPriority("standard");
      setSelectedCustomerId("");
      setNewCustomerMode(false);
      setCustName("");
      setCustPhone("");
      setCustEmail("");
      setCustPostcode("");
      setSelectedServiceId("");
      loadJobs();
    } catch (err: any) {
      toast.error(err.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoAssign = async (jobId: string) => {
    setAssigningId(jobId);
    try {
      const { data, error } = await supabase.rpc("auto_assign_job", { _job_id: jobId });
      if (error) throw error;

      if (data && data.assigned) {
        toast.success(`Assigned engineer! (Score: ${data.score})`);
        loadJobs();
      } else {
        toast.warning(data?.reason || "No available engineer matched");
      }
    } catch (err: any) {
      toast.error(err.message || "Auto assign failed");
    } finally {
      setAssigningId(null);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ status: newStatus as any })
        .eq("id", jobId);

      if (error) throw error;
      toast.success(`Status updated to ${newStatus}`);
      loadJobs();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(s) ||
      j.reference.toLowerCase().includes(s) ||
      j.postcode.toLowerCase().includes(s) ||
      j.customers?.full_name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & New Job Modal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Jobs Board
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage all customer jobs, scheduled calls, and AI dispatches
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" size="default" className="gap-2 rounded-xl font-bold shadow-md">
              <Plus className="size-4" /> Create New Job
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create New Job Booking</DialogTitle>
              <DialogDescription>
                Add job details to dispatch an engineer or schedule a callout.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateJob} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto px-1">
              {/* Customer Selector / Inline Create Toggle */}
              <div className="space-y-3 rounded-xl border border-border p-3 bg-accent/25">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground">Customer Association</Label>
                  <button
                    type="button"
                    onClick={() => setNewCustomerMode(!newCustomerMode)}
                    className="text-xs text-brand font-bold hover:underline"
                  >
                    {newCustomerMode ? "Choose Existing" : "+ Add New Customer"}
                  </button>
                </div>

                {!newCustomerMode ? (
                  <div className="space-y-1">
                    <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="-- Choose an existing customer --" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.full_name} ({c.phone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="custName" className="text-[10px] font-semibold text-muted-foreground">Full Name *</Label>
                        <Input
                          id="custName"
                          placeholder="John Doe"
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          className="h-8 text-xs bg-background"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="custPhone" className="text-[10px] font-semibold text-muted-foreground">Phone *</Label>
                        <Input
                          id="custPhone"
                          placeholder="07700 900123"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="h-8 text-xs bg-background"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="custEmail" className="text-[10px] font-semibold text-muted-foreground">Email</Label>
                        <Input
                          id="custEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="custPostcode" className="text-[10px] font-semibold text-muted-foreground">Postcode</Label>
                        <Input
                          id="custPostcode"
                          placeholder="e.g. B1 1AA"
                          value={custPostcode}
                          onChange={(e) => setCustPostcode(e.target.value)}
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Selection & Job Title */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Service Catalogue</Label>
                  <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- Select Service --" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-semibold">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Boiler Leak Repair"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="postcode" className="text-xs font-semibold">UK Postcode *</Label>
                  <Input
                    id="postcode"
                    placeholder="e.g. B1 1AA"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Priority</Label>
                  <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">🚨 Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-xs font-semibold">Scheduled Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Time Slot</Label>
                  <Select value={slot} onValueChange={setSlot}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                      <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
                      <SelectItem value="asap">⚡ ASAP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold">Notes / Description</Label>
                <Textarea
                  id="description"
                  placeholder="Customer notes, access instructions, or reported issues..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="brand" disabled={submitting}>
                  {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Save & Create Job
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter Bar */}
      <Card className="card-elevated p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search reference, title, postcode, customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-xl text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] rounded-xl text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Jobs Grid / List */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <Card className="card-elevated p-12 text-center text-muted-foreground">
          <Briefcase className="mx-auto size-10 text-muted-foreground/30 mb-3" />
          <h3 className="text-lg font-bold text-foreground">No jobs found</h3>
          <p className="text-xs mt-1">Try adjusting your filters or create a new job.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="card-elevated transition-all hover:border-brand/40">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Info Column */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                        {job.reference}
                      </span>

                      {/* Status Tag */}
                      <span className={cn(
                        "text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize",
                        job.status === "pending" && "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
                        job.status === "assigned" && "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
                        job.status === "in_progress" && "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30",
                        job.status === "completed" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
                        job.status === "cancelled" && "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                      )}>
                        {job.status.replace("_", " ")}
                      </span>

                      {/* Priority Tag */}
                      {job.priority === "emergency" && (
                        <Badge className="bg-red-600 text-white font-bold animate-pulse text-[11px]">
                          🚨 Emergency
                        </Badge>
                      )}
                      {job.priority === "urgent" && (
                        <Badge className="bg-amber-600 text-white font-semibold text-[11px]">
                          ⚡ Urgent
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-foreground">{job.title}</h3>

                    {job.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="size-3.5 text-brand" /> {job.postcode}
                      </span>
                      {job.scheduled_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5" /> {job.scheduled_date} ({job.slot || "anytime"})
                        </span>
                      )}
                      {job.customers?.full_name && (
                        <span className="flex items-center gap-1">
                          <User className="size-3.5" /> {job.customers.full_name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border pt-3 lg:border-t-0 lg:pt-0">
                    {job.status === "pending" && (
                      <Button
                        variant="brand"
                        size="sm"
                        disabled={assigningId === job.id}
                        onClick={() => handleAutoAssign(job.id)}
                        className="gap-1.5 rounded-xl font-bold text-xs"
                      >
                        <Sparkles className="size-3.5" />
                        {assigningId === job.id ? "Assigning..." : "AI Auto-Assign"}
                      </Button>
                    )}

                    <Select
                      value={job.status}
                      onValueChange={(val) => handleStatusChange(job.id, val)}
                    >
                      <SelectTrigger className="h-9 w-[130px] rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="en_route">En Route</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
