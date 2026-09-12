/**
 * Authenticated job + dispatch server functions.
 * Copy to: src/lib/jobs.functions.ts
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const statusEnum = z.enum([
  "pending",
  "quoted",
  "assigned",
  "en_route",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);

/** Owner/dispatcher job board */
export const listCompanyJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("jobs")
      .select(
        "id, reference, title, status, priority, postcode, scheduled_date, slot, quote_pence, dispatch_score, dispatch_reason, engineer_id, customers(full_name, phone)",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Engineer's own jobs for today */
export const listMyJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: eng } = await context.supabase
      .from("engineers")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!eng) return [];
    const { data } = await context.supabase
      .from("jobs")
      .select("id, reference, title, status, priority, postcode, scheduled_date, slot, lat, lng")
      .eq("engineer_id", eng.id)
      .order("scheduled_date");
    return data ?? [];
  });

export async function geocodeUKPostcode(postcode: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const cleaned = postcode.replace(/\s+/g, "").toUpperCase();
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status === 200 && json.result) {
      return {
        lat: json.result.latitude,
        lng: json.result.longitude,
      };
    }
  } catch (e) {
    console.error("Geocoding failed for postcode:", postcode, e);
  }
  return null;
}

/** Create a job from the dashboard */
export const createJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        companyId: z.string().uuid(),
        customerId: z.string().uuid().optional(),
        serviceId: z.string().uuid().optional(),
        title: z.string().trim().min(3).max(140),
        description: z.string().trim().max(2000).optional(),
        postcode: z.string().trim().min(4).max(10),
        scheduledDate: z.string().optional(),
        slot: z.enum(["morning", "afternoon", "evening", "asap"]).optional(),
        priority: z.enum(["standard", "urgent", "emergency"]).default("standard"),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const coords = await geocodeUKPostcode(data.postcode);
    const { data: job, error } = await context.supabase
      .from("jobs")
      .insert({
        company_id: data.companyId,
        customer_id: data.customerId ?? null,
        service_id: data.serviceId ?? null,
        created_by: context.userId, // never trust client-supplied ownership
        title: data.title,
        description: data.description ?? null,
        postcode: data.postcode,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        scheduled_date: data.scheduledDate ?? null,
        slot: data.slot ?? null,
        priority: data.priority,
      })
      .select("id, reference")
      .single();
    if (error) throw new Error(error.message);
    return job;
  });

/** AI ranking preview for a job */
export const rankEngineers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ jobId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: ranked, error } = await context.supabase.rpc("rank_engineers_for_job", {
      _job_id: data.jobId,
    });
    if (error) throw new Error(error.message);
    return ranked ?? [];
  });

/** One-click smart dispatch */
export const autoAssign = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ jobId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("auto_assign_job", {
      _job_id: data.jobId,
    });
    if (error) throw new Error(error.message);
    return result;
  });

/** Engineer status updates (en route / started / completed) */
export const updateJobStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        jobId: z.string().uuid(),
        status: statusEnum,
        finalPricePence: z.number().int().min(0).max(10_000_000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("jobs")
      .update({
        status: data.status,
        ...(data.finalPricePence !== undefined ? { final_price_pence: data.finalPricePence } : {}),
      })
      .eq("id", data.jobId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Live location ping from the engineer app */
export const pingLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
        jobId: z.string().uuid().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: eng } = await context.supabase
      .from("engineers")
      .select("id")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!eng) throw new Error("Not an engineer");

    await context.supabase.from("engineer_locations").insert({
      engineer_id: eng.id,
      lat: data.lat,
      lng: data.lng,
      job_id: data.jobId ?? null,
    });
    await context.supabase
      .from("engineers")
      .update({
        current_lat: data.lat,
        current_lng: data.lng,
        location_updated_at: new Date().toISOString(),
      })
      .eq("id", eng.id);

    return { ok: true };
  });

/** Owner dashboard KPIs */
export const dashboardStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ companyId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: stats, error } = await context.supabase.rpc("company_dashboard_stats", {
      _company_id: data.companyId,
    });
    if (error) throw new Error(error.message);
    return stats;
  });
