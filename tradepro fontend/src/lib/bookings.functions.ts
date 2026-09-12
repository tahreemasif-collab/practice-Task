/**
 * Public booking + lead capture server functions.
 * Copy to: src/lib/bookings.functions.ts
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createServerPublicClient } from "@/integrations/supabase/client";

const bookingSchema = z.object({
  service: z.string().trim().min(1).max(80),
  postcode: z.string().trim().min(4).max(10),
  date: z.string().trim().max(20).optional(),
  slot: z.enum(["morning", "afternoon", "evening", "asap"]),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(9).max(20),
  notes: z.string().trim().max(600).optional(),
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(10).max(1000),
});

/** Landing page booking form -> public.leads */
export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createServerPublicClient();
    const { error } = await supabase.from("leads").insert({
      kind: "booking",
      service: data.service,
      postcode: data.postcode,
      preferred_date: data.date || null,
      slot: data.slot,
      full_name: data.name,
      phone: data.phone,
      message: data.notes ?? null,
    });
    if (error) throw new Error("Could not save your request. Please try again.");
    return { ok: true };
  });

/** Contact form -> public.leads */
export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createServerPublicClient();
    const { error } = await supabase.from("leads").insert({
      kind: "contact",
      full_name: data.name,
      email: data.email,
      message: data.message,
    });
    if (error) throw new Error("Could not send your message.");
    return { ok: true };
  });

/** Public services list for the booking dropdown + pricing */
export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createServerPublicClient();
  const { data } = await supabase
    .from("services")
    .select("id, name, category, base_price_pence, callout_fee_pence, duration_minutes")
    .eq("is_active", true)
    .order("category");
  return data ?? [];
});

/** Instant estimate via the estimate_quote RPC */
export const estimateQuote = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        serviceId: z.string().uuid(),
        priority: z.enum(["standard", "urgent", "emergency"]).default("standard"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = createServerPublicClient();
    const { data: quote, error } = await supabase.rpc("estimate_quote", {
      _service_id: data.serviceId,
      _priority: data.priority,
    });
    if (error) throw new Error("Could not calculate a quote.");
    return quote;
  });
