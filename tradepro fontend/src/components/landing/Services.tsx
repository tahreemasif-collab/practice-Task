import { Droplets, Fan, Hammer, Sparkles, Wrench, Zap } from "lucide-react";

const services = [
  {
    icon: Droplets,
    name: "Plumbing",
    desc: "Leaks, boilers, bathrooms and emergency callouts.",
    from: "£65",
  },
  {
    icon: Zap,
    name: "Electrical",
    desc: "NICEIC certified rewires, EV chargers, fault finding.",
    from: "£75",
  },
  {
    icon: Fan,
    name: "Heating & HVAC",
    desc: "Servicing, installs and annual maintenance plans.",
    from: "£85",
  },
  {
    icon: Sparkles,
    name: "Cleaning",
    desc: "End of tenancy, commercial and deep cleans.",
    from: "£45",
  },
  {
    icon: Hammer,
    name: "Handyman",
    desc: "Carpentry, fixings, flat-pack and odd jobs.",
    from: "£40",
  },
  {
    icon: Wrench,
    name: "Maintenance",
    desc: "Planned property maintenance for landlords.",
    from: "£55",
  },
];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Service categories
        </p>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
          Every trade, one dispatch engine
        </h2>
        <p className="mt-3 text-muted-foreground">
          Jobs are routed to the nearest available, qualified engineer using live GPS, workload and
          specialisation.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.name}
            className="group card-elevated rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-secondary transition-colors group-hover:bg-brand/15">
              <service.icon className="size-5 text-primary transition-colors group-hover:text-brand" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{service.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.desc}</p>
            <p className="mt-4 text-sm font-semibold text-primary">From {service.from}/hr</p>
          </article>
        ))}
      </div>
    </section>
  );
}
