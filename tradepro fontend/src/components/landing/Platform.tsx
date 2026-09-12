import { Banknote, BrainCircuit, FileText, MapPinned, MessagesSquare, Route } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI job dispatching",
    desc: "Auto-assigns by GPS distance, availability, workload and specialisation — with manual override.",
  },
  {
    icon: MapPinned,
    title: "Live engineer tracking",
    desc: "Customers watch the van approach, with live ETA and status updates on the map.",
  },
  {
    icon: FileText,
    title: "Instant quotes & invoices",
    desc: "Labour, materials, travel, VAT and emergency charges calculated instantly into a PDF invoice.",
  },
  {
    icon: Banknote,
    title: "Stripe payments",
    desc: "Card, Apple Pay, Google Pay and pay-later, with refunds and full payment history.",
  },
  {
    icon: Route,
    title: "Drag & drop calendar",
    desc: "Daily, weekly and monthly views with engineer availability and automatic reminders.",
  },
  {
    icon: MessagesSquare,
    title: "Client portal & chat",
    desc: "Bookings, photo uploads, invoices, reviews and real-time chat in one branded portal.",
  },
];

export function Platform() {
  return (
    <section id="platform" className="relative overflow-hidden bg-navy-gradient py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Why choose us
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-navy-foreground sm:text-4xl">
            The operations layer for modern trade businesses
          </h2>
          <p className="mt-3 text-navy-foreground/75">
            Everything ServiceTitan and Jobber do, built for UK trades — with white-label branding
            and isolated data per company.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-3xl surface-glass p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand/20">
                <feature.icon className="size-5 text-brand" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-foreground/70">{feature.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
