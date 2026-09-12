/**
 * Privileged (super admin / owner) server functions.
 * Copy to: src/lib/admin.functions.ts
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";

interface AuthContext {
  supabase: SupabaseClient;
  userId: string;
}

async function assertRole(context: AuthContext, role: "super_admin" | "owner") {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: role,
  });
  if (!data) throw new Error("Forbidden");
}

interface Subscription {
  tier: string;
  status: string;
}

/** Super admin: platform-wide overview */
export const platformOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context as AuthContext, "super_admin");
    const { createAdminClient } = await import("@/integrations/supabase/client.server");
    const admin = createAdminClient();

    const [companies, jobs, subs] = await Promise.all([
      admin.from("companies").select("id", { count: "exact", head: true }),
      admin.from("jobs").select("id", { count: "exact", head: true }),
      admin.from("subscriptions").select("tier, status"),
    ]);

    const subscriptions = (subs.data ?? []) as Subscription[];

    return {
      companies: companies.count ?? 0,
      jobs: jobs.count ?? 0,
      activeSubscriptions: subscriptions.filter((s) => s.status === "active").length,
      byTier: subscriptions.reduce((acc: Record<string, number>, s) => {
        acc[s.tier] = (acc[s.tier] ?? 0) + 1;
        return acc;
      }, {}),
    };
  });

/** Owner: invite an engineer (creates auth user + engineer row + role) */
export const inviteEngineer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        fullName: z.string().trim().min(2).max(80),
        companyId: z.string().uuid(),
        skills: z.array(z.string().max(40)).max(20).default([]),
        homePostcode: z.string().trim().min(4).max(10).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context as AuthContext, "owner");
    const { createAdminClient } = await import("@/integrations/supabase/client.server");
    const admin = createAdminClient();

    const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(data.email, {
      data: { full_name: data.fullName, role: "engineer" },
    });
    if (error || !invited.user) throw new Error("Could not invite engineer");

    const { geocodeUKPostcode } = await import("./jobs.functions");
    const coords = data.homePostcode ? await geocodeUKPostcode(data.homePostcode) : null;

    await admin.from("profiles").upsert({
      id: invited.user.id,
      full_name: data.fullName,
      email: data.email,
      company_id: data.companyId,
    });
    await admin
      .from("user_roles")
      .insert({ user_id: invited.user.id, role: "engineer", company_id: data.companyId });
    await admin.from("engineers").insert({
      user_id: invited.user.id,
      company_id: data.companyId,
      skills: data.skills,
      status: "offline",
      home_postcode: data.homePostcode || null,
      current_lat: coords?.lat ?? null,
      current_lng: coords?.lng ?? null,
    });

    return { ok: true, userId: invited.user.id };
  });

/** Owner: convert a landing-page lead into a scheduled job */
export const convertLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ leadId: z.string().uuid(), companyId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: jobId, error } = await context.supabase.rpc("convert_lead_to_job", {
      _lead_id: data.leadId,
      _company_id: data.companyId,
    });
    if (error) throw new Error(error.message);
    return { jobId };
  });
