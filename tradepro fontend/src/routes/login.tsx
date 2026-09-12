import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldCheck, Eye, EyeOff, Sparkles, Building2, Wrench, UserCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — TradePro 360" },
      { name: "description", content: "Sign in to your TradePro 360 account" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Password reset modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("tradepro_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem("tradepro_remember_email", email);
      } else {
        localStorage.removeItem("tradepro_remember_email");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in");
        return;
      }

      if (data.session) {
        toast.success("Successfully logged in!");
        // Fetch user role to direct to correct dashboard
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        const role = userRole?.role;
        if (role === "engineer") {
          navigate({ to: "/engineer/jobs" as any });
        } else if (role === "customer") {
          navigate({ to: "/customer/jobs" as any });
        } else {
          navigate({ to: "/dashboard" as any });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: "owner" | "engineer" | "customer") => {
    if (role === "owner") {
      setEmail("admin@tradepro360.co.uk");
      setPassword("demo123456");
      toast.info("Demo Admin credentials filled. Click Sign In.");
    } else if (role === "engineer") {
      setEmail("engineer@tradepro360.co.uk");
      setPassword("demo123456");
      toast.info("Demo Engineer credentials filled. Click Sign In.");
    } else {
      setEmail("customer@tradepro360.co.uk");
      setPassword("demo123456");
      toast.info("Demo Customer credentials filled. Click Sign In.");
    }
  };

  const handleSocialLogin = async (provider: "google" | "azure") => {
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message || `Failed to connect to ${provider}`);
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        toast.error(error.message || "Could not send reset email");
      } else {
        toast.success("Password reset email sent! Please check your inbox.");
        setForgotModalOpen(false);
        setResetEmail("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process request");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-navy-gradient px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Ambient Glow Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--color-brand)_0%,_transparent_50%)] opacity-25" />
      <div className="pointer-events-none absolute bottom-0 right-0 size-96 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 shadow-md backdrop-blur-md transition-all hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="size-4" /> Back to Home
        </Link>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo tone="light" />
        </div>

        <Card className="rounded-2xl border border-slate-700/80 bg-slate-900/90 text-white shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
          <CardHeader className="space-y-1.5 text-center">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-slate-300">
              Sign in to manage your jobs, team, or bookings
            </CardDescription>

            {/* Quick Demo Access Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-2">
                <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
                <span>Quick Fill Demo Credentials:</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("owner")}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/60 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs cursor-pointer"
                >
                  <Building2 className="size-3.5 mb-1 text-cyan-400" />
                  <span className="font-medium text-[11px]">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("engineer")}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/60 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs cursor-pointer"
                >
                  <Wrench className="size-3.5 mb-1 text-emerald-400" />
                  <span className="font-medium text-[11px]">Engineer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("customer")}
                  className="flex flex-col items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/60 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs cursor-pointer"
                >
                  <UserCheck className="size-3.5 mb-1 text-purple-400" />
                  <span className="font-medium text-[11px]">Customer</span>
                </button>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-2">
              {/* Email Address Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@business.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-slate-950/70 border-slate-700/80 text-white placeholder:text-slate-500 focus-visible:ring-brand focus-visible:border-brand h-11"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setForgotModalOpen(true);
                    }}
                    className="text-xs text-brand hover:text-cyan-300 hover:underline font-medium cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 bg-slate-950/70 border-slate-700/80 text-white placeholder:text-slate-500 focus-visible:ring-brand focus-visible:border-brand h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  className="border-slate-600 data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground"
                />
                <Label htmlFor="remember" className="text-xs font-normal text-slate-300 cursor-pointer select-none">
                  Remember my email on this browser
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={loading}
                className="w-full rounded-xl py-3 font-bold h-11 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative w-full my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/60" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={!!socialLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/40 p-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <svg className="size-4" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9c-.2-.7-.3-1.4-.3-2.2"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                      />
                    </svg>
                  )}
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("azure")}
                  disabled={!!socialLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-950/40 p-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
                >
                  {socialLoading === "azure" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <svg className="size-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                  )}
                  Microsoft
                </button>
              </div>

              <div className="text-center text-sm text-slate-300 pt-2">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-brand hover:text-cyan-300 hover:underline">
                  Sign up free
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Security badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="size-4 text-cyan-400" /> 256-bit Encrypted Supabase Auth
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={forgotModalOpen} onOpenChange={setForgotModalOpen}>
        <DialogContent className="border border-slate-700 bg-slate-900 text-white rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="size-5 text-cyan-400" /> Reset Password
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-sm">
              Enter your email address below and we'll send you instructions to reset your password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium text-slate-200">
                Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="name@business.co.uk"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="bg-slate-950/70 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-brand h-11"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 flex flex-row justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotModalOpen(false)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button type="submit" variant="brand" disabled={resetLoading}>
                {resetLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

