import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/landing/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Building2, User, Loader2, Mail, Phone, KeyRound, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — TradePro 360" },
      { name: "description", content: "Create your TradePro 360 account" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"owner" | "customer">("owner");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Terms & Privacy Policy");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: role,
          },
        },
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        return;
      }

      if (data.user) {
        toast.success("Account created successfully!");
        if (data.session) {
          if (role === "owner") {
            navigate({ to: "/dashboard" as any });
          } else {
            navigate({ to: "/customer/jobs" as any });
          }
        } else {
          toast.info("Please check your email to confirm your account");
          navigate({ to: "/login" as any });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "google" | "azure") => {
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
      toast.error(err.message || `Failed to sign up with ${provider}`);
    } finally {
      setSocialLoading(null);
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
              Create an account
            </CardTitle>
            <CardDescription className="text-sm text-slate-300">
              Join TradePro 360 to automate dispatch & job booking
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4 pt-2">
              {/* Account Type Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-200">I am joining as a:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("owner")}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition-all cursor-pointer",
                      role === "owner"
                        ? "border-cyan-400 bg-cyan-500/20 text-white font-semibold shadow-inner ring-1 ring-cyan-400/50"
                        : "border-slate-700/80 bg-slate-950/40 text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Building2 className={cn("size-5", role === "owner" ? "text-cyan-400" : "text-slate-400")} />
                    <span className="text-xs">Trade Business</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition-all cursor-pointer",
                      role === "customer"
                        ? "border-cyan-400 bg-cyan-500/20 text-white font-semibold shadow-inner ring-1 ring-cyan-400/50"
                        : "border-slate-700/80 bg-slate-950/40 text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <User className={cn("size-5", role === "customer" ? "text-cyan-400" : "text-slate-400")} />
                    <span className="text-xs">Customer</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-slate-200">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-slate-950/70 border-slate-700/80 text-white placeholder:text-slate-500 focus-visible:ring-brand focus-visible:border-brand h-11"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-slate-950/70 border-slate-700/80 text-white placeholder:text-slate-500 focus-visible:ring-brand focus-visible:border-brand h-11"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-200">
                  Phone Number (Optional)
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07700 900123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 bg-slate-950/70 border-slate-700/80 text-white placeholder:text-slate-500 focus-visible:ring-brand focus-visible:border-brand h-11"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
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

              {/* Terms & Privacy */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                  className="border-slate-600 data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground"
                />
                <Label htmlFor="terms" className="text-xs font-normal text-slate-300 cursor-pointer select-none">
                  I agree to the Terms of Service & Privacy Policy
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
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Social Signup */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={() => handleSocialSignup("google")}
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
                  onClick={() => handleSocialSignup("azure")}
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
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-brand hover:text-cyan-300 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Security badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="size-4 text-cyan-400" /> Instant setup · 14-day free trial included
        </div>
      </div>
    </div>
  );
}

