import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  LogOut,
  Bell,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/engineer")({
  head: () => ({
    meta: [
      { title: "Engineer Portal — TradePro 360" },
      { name: "description", content: "TradePro 360 Field Engineer Portal" },
    ],
  }),
  component: EngineerLayout,
});

function EngineerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          navigate({ to: "/login" });
          return;
        }

        // Fetch user role
        const { data: userRole, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .maybeSingle();

        if (error || !userRole || userRole.role !== "engineer") {
          toast.error("Access Denied: You must be registered as an Engineer");
          navigate({ to: "/login" });
          return;
        }

        setUser(data.user);
        setLoading(false);
      } catch (err: any) {
        toast.error("Authorization check failed");
        navigate({ to: "/login" });
      }
    }
    checkRole();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/login" });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-navy-gradient text-navy-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-xl bg-brand animate-pulse" />
          <p className="text-sm font-medium text-navy-foreground/70">Authenticating Engineer Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Header bar optimized for mobile first (Engineers in field) */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo tone="dark" />
          <span className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand">
            FIELD ENG
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-foreground">
              {user?.user_metadata?.full_name || "Field Engineer"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">
              {user?.email}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            title="Sign Out"
            className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-full"
          >
            <LogOut className="size-4.5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Mobile Sticky Bottom Nav indicator bar */}
      <footer className="mt-auto border-t border-border bg-card p-3 text-center text-[10px] text-muted-foreground flex justify-center items-center gap-2">
        <ShieldCheck className="size-3.5 text-brand" /> Secured Engineer Work Session · Live GPS Sync Active
      </footer>
    </div>
  );
}
