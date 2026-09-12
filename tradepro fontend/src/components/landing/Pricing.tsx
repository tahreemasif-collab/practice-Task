import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "£29",
    tagline: "Sole traders getting organised.",
    features: [
      "Up to 2 engineers",
      "Unlimited bookings",
      "Quotes & PDF invoices",
      "Stripe payments",
    ],
  },
  {
    name: "Growth",
    price: "£79",
    tagline: "Growing teams that need dispatch.",
    features: [
      "Up to 10 engineers",
      "AI job dispatching",
      "Live tracking & ETAs",
      "Client portal & chat",
      "Reports & analytics",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    tagline: "Multi-branch and white label.",
    features: [
      "Unlimited engineers",
      "White label & custom domain",
      "Role-based permissions",
      "API access & audit logs",
      "Dedicated support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Pricing plans
        </p>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Simple pricing, per company</h2>
        <p className="mt-3 text-muted-foreground">Monthly, excluding VAT. Cancel anytime.</p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "flex flex-col rounded-3xl p-7",
              plan.featured
                ? "bg-navy-gradient text-navy-foreground shadow-[0_40px_80px_-40px_oklch(0.2_0.1_265/0.6)]"
                : "card-elevated",
            )}
          >
            {plan.featured && (
              <span className="mb-4 w-fit rounded-full bg-brand px-3 py-1 text-xs font-bold text-brand-foreground">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p
              className={cn(
                "mt-1 text-sm",
                plan.featured ? "text-navy-foreground/70" : "text-muted-foreground",
              )}
            >
              {plan.tagline}
            </p>
            <p className="mt-5 text-4xl font-extrabold">
              {plan.price}
              {plan.price !== "Custom" && (
                <span
                  className={cn(
                    "text-base font-medium",
                    plan.featured ? "text-navy-foreground/60" : "text-muted-foreground",
                  )}
                >
                  /mo
                </span>
              )}
            </p>

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      plan.featured ? "text-brand" : "text-primary",
                    )}
                  />
                  <span className={plan.featured ? "text-navy-foreground/85" : "text-foreground"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.featured ? "brand" : "navy"}
              size="lg"
              className="mt-7 rounded-full"
              asChild
            >
              <a href="#book">{plan.price === "Custom" ? "Talk to sales" : "Start free trial"}</a>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
