import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Wrench, Plus, Star, CheckCircle, Loader2, User, Phone, Mail, ShieldAlert, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { inviteEngineer } from "@/lib/admin.functions";

export const Route = createFileRoute("/dashboard/engineers")({
  head: () => ({
    meta: [{ title: "Engineers — TradePro 360" }],
  }),
  component: EngineersPage,
});

interface Engineer {
  id: string;
  user_id: string;
  status: string;
  rating: number;
  jobs_completed: number;
  skills: string[];
  max_daily_jobs: number;
  home_postcode: string | null;
  current_lat?: number | null;
  current_lng?: number | null;
  profiles?: { full_name: string; email: string; phone: string } | null;
}

function EngineersPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviting, setInviting] = useState(false);

  // Invite Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [skillInput, setSkillInput] = useState("Plumbing, Electrical");
  const [homePostcode, setHomePostcode] = useState("");

  const loadEngineers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("engineers")
        .select("*, profiles:user_id(full_name, email, phone)");

      if (error) throw error;
      setEngineers(data as any[] || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load engineers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEngineers();
  }, []);

  const handleStatusChange = async (engineerId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("engineers")
        .update({ status: newStatus as any })
        .eq("id", engineerId);

      if (error) throw error;
      toast.success(`Engineer status updated to ${newStatus}`);
      loadEngineers();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      toast.error("Please enter email and full name");
      return;
    }

    setInviting(true);
    try {
      // Get current company ID
      const { data: comp } = await supabase.from("companies").select("id").limit(1).single();
      const companyId = comp?.id;

      if (!companyId) {
        toast.error("Company not found");
        return;
      }

      const skillsArray = skillInput.split(",").map((s) => s.trim()).filter(Boolean);

      // Call privileged invitation server function
      await inviteEngineer({
        data: {
          email,
          fullName,
          companyId,
          skills: skillsArray,
          homePostcode: homePostcode || undefined,
        },
      });

      toast.success(`Invitation created for ${fullName} (${email})!`);
      setInviteOpen(false);
      setFullName("");
      setEmail("");
      setHomePostcode("");
      loadEngineers();
    } catch (err: any) {
      toast.error(err.message || "Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Engineer Roster
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage active field engineers, skills, ratings and dispatch availability
          </p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button variant="brand" size="default" className="gap-2 rounded-xl font-bold shadow-md">
              <Plus className="size-4" /> Add / Invite Engineer
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Invite New Field Engineer</DialogTitle>
              <DialogDescription>
                Send an invitation to join your trade business on TradePro 360.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleInvite} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="engName" className="text-xs font-semibold">Full Name *</Label>
                <Input
                  id="engName"
                  placeholder="e.g. Dave Miller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engEmail" className="text-xs font-semibold">Email Address *</Label>
                <Input
                  id="engEmail"
                  type="email"
                  placeholder="dave@tradepro.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills" className="text-xs font-semibold">Trade Skills (comma separated)</Label>
                <Input
                  id="skills"
                  placeholder="Plumbing, Heating & HVAC, Boiler Service"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homePostcode" className="text-xs font-semibold">Home Postcode (UK)</Label>
                <Input
                  id="homePostcode"
                  placeholder="e.g. B1 1AA"
                  value={homePostcode}
                  onChange={(e) => setHomePostcode(e.target.value)}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="brand" disabled={inviting}>
                  {inviting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Send Invite
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Engineers Grid */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Loading engineers...</div>
      ) : engineers.length === 0 ? (
        <Card className="card-elevated p-12 text-center text-muted-foreground">
          <Wrench className="mx-auto size-10 text-muted-foreground/30 mb-3" />
          <h3 className="text-lg font-bold text-foreground">No engineers registered yet</h3>
          <p className="text-xs mt-1">Click "Add / Invite Engineer" above to build your team.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {engineers.map((eng) => (
            <Card key={eng.id} className="card-elevated">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-brand/15 text-brand font-bold text-base">
                    {eng.profiles?.full_name?.[0] || "E"}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">
                      {eng.profiles?.full_name || "Engineer"}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                      <Star className="size-3.5 fill-amber-500" />
                      <span>{eng.rating}</span>
                      <span className="text-muted-foreground font-normal">({eng.jobs_completed} jobs)</span>
                    </div>
                  </div>
                </div>

                <Select
                  value={eng.status}
                  onValueChange={(val) => handleStatusChange(eng.id, val)}
                >
                  <SelectTrigger className="h-8 w-[110px] rounded-lg text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="on_job">On Job</SelectItem>
                    <SelectItem value="break">Break</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {eng.skills && eng.skills.length > 0 ? (
                    eng.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[11px]">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No skills listed</span>
                  )}
                </div>

                <div className="border-t border-border pt-3 text-xs text-muted-foreground space-y-1">
                  {eng.profiles?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-muted-foreground/70" />
                      <span className="truncate">{eng.profiles.email}</span>
                    </div>
                  )}
                  {eng.profiles?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 text-muted-foreground/70" />
                      <span>{eng.profiles.phone}</span>
                    </div>
                  )}
                  {eng.home_postcode && (
                    <div className="flex items-center gap-2 text-[11px] text-brand font-medium">
                      <MapPin className="size-3.5 text-brand" />
                      <span>Home: {eng.home_postcode} {eng.current_lat != null && eng.current_lng != null ? `(${eng.current_lat.toFixed(3)}, ${eng.current_lng.toFixed(3)})` : ""}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
