import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  Wrench,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  Sparkles,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TradePro 360" },
      { name: "description", content: "TradePro 360 Management Dashboard" },
    ],
  }),
  component: DashboardLayout,
});

const navItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Jobs Board", to: "/dashboard/jobs", icon: Briefcase },
  { label: "AI Smart Dispatch", to: "/dashboard/dispatch", icon: Sparkles, badge: "AI" },
  { label: "Engineers", to: "/dashboard/engineers", icon: Wrench },
  { label: "Customers", to: "/dashboard/customers", icon: Users },
  { label: "Invoices", to: "/dashboard/invoices", icon: FileText },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate({ to: "/login" });
        return;
      }
      setUser(data.user);
      setLoading(false);
    }
    loadUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate({ to: "/login" });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-navy-deep text-navy-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 rounded-xl bg-brand animate-pulse" />
          <p className="text-sm font-medium text-navy-foreground/70">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar p-4 lg:flex">
        {/* Brand */}
        <div className="flex items-center justify-between px-2 py-3">
          <Logo tone="light" />
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-1 flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to as any}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand text-brand-foreground font-semibold shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("size-4.5", isActive ? "text-brand-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="mt-auto border-t border-sidebar-border pt-4">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/20 font-bold text-brand">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex flex-col truncate">
                <span className="truncate text-xs font-semibold text-sidebar-foreground">
                  {user?.user_metadata?.full_name || "Business Owner"}
                </span>
                <span className="truncate text-[11px] text-sidebar-foreground/60">
                  {user?.email}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sign Out"
              className="text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="flex w-72 flex-col bg-sidebar p-4 shadow-xl">
            <div className="flex items-center justify-between px-2 py-3">
              <Logo tone="light" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="text-sidebar-foreground"
              >
                <X className="size-5" />
              </Button>
            </div>

            <nav className="mt-6 flex flex-1 flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-brand text-brand-foreground font-semibold"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-extrabold text-brand">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-sidebar-border pt-4">
              <Button
                variant="destructive"
                className="w-full justify-center gap-2 rounded-xl"
                onClick={handleSignOut}
              >
                <LogOut className="size-4" /> Sign Out
              </Button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span>Dashboard</span>
              <ChevronRight className="size-3.5" />
              <span className="font-semibold text-foreground capitalize">
                {location.pathname.split("/")[2] || "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="relative rounded-full">
              <Bell className="size-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
