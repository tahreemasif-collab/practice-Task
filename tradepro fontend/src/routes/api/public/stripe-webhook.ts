/**
 * Stripe webhook (payments + subscriptions).
 * Copy to: src/routes/api/public/stripe-webhook.ts
 * Stripe dashboard URL: https://<your-domain>/api/public/stripe-webhook
 */
import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        const apiKey = process.env["STRIPE_SECRET_KEY"];
        if (!secret || !apiKey) return new Response("Not configured", { status: 500 });

        const signature = request.headers.get("stripe-signature");
        const body = await request.text();
        if (!signature) return new Response("Missing signature", { status: 401 });

        const { default: StripeInstance } = await import("stripe");
        const stripe = new StripeInstance(apiKey);

        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, secret);
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }

        const { createAdminClient } = await import("@/integrations/supabase/client.server");
        const admin = createAdminClient();

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const invoiceId = session.metadata?.["invoice_id"];
            const companyId = session.metadata?.["company_id"];
            if (invoiceId) {
              await admin
                .from("invoices")
                .update({
                  status: "paid",
                  paid_at: new Date().toISOString(),
                  stripe_checkout_session_id: session.id,
                })
                .eq("id", invoiceId);
            }
            if (companyId) {
              await admin.from("payments").insert({
                invoice_id: invoiceId ?? null,
                company_id: companyId,
                amount_pence: session.amount_total ?? 0,
                currency: session.currency ?? "gbp",
                provider_reference: session.id,
                status: "succeeded",
                raw_event: event as unknown as Record<string, unknown>,
              });
            }
            break;
          }
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted": {
            const sub = event.data.object as Stripe.Subscription;
            const companyId = sub.metadata?.["company_id"];
            if (companyId) {
              await admin
                .from("subscriptions")
                .update({
                  status: sub.status,
                  stripe_subscription_id: sub.id,
                  current_period_end: (sub as any).current_period_end
                    ? new Date((sub as any).current_period_end * 1000).toISOString()
                    : new Date().toISOString(),
                })
                .eq("company_id", companyId);
            }
            break;
          }
          default:
            break;
        }

        return new Response("ok");
      },
    },
  },
});
