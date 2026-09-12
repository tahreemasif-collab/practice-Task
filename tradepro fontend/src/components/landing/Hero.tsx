import { BadgeCheck, Clock, MapPin, ShieldCheck } from "lucide-react";
import { BookingForm } from "./BookingForm";
import plumber from "@/assets/hero-plumber.jpg";
import electrician from "@/assets/hero-electrician.jpg";

const trust = [
  { icon: BadgeCheck, title: "Guaranteed", sub: "Workmanship" },
  { icon: Clock, title: "24H", sub: "Availability" },
  { icon: MapPin, title: "Local UK", sub: "Engineers" },
  { icon: ShieldCheck, title: "Gas Safe", sub: "& NICEIC" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy-gradient pb-16 pt-28 lg:pb-24 lg:pt-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="animate-rise">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-navy-foreground/80">
            <span>Bookings</span>
            <span className="size-1.5 rounded-full bg-brand" />
            <span>Dispatch</span>
            <span className="size-1.5 rounded-full bg-brand" />
            <span>Invoicing</span>
          </div>
          <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] text-navy-foreground sm:text-5xl lg:text-6xl">
            Need a trusted trade in your area?{" "}
            <span className="text-gradient-brand">We dispatch in minutes.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-navy-foreground/75">
            TradePro 360 is the smart booking and dispatch platform behind hundreds of UK plumbers,
            electricians, cleaners and HVAC engineers — with live tracking, instant quotes and
            automated invoicing.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trust.map((item) => (
              <div
                key={item.title}
                className="flex min-w-0 items-center gap-3 rounded-2xl surface-glass px-3 py-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/20">
                  <item.icon className="size-4 text-brand" />
                </span>
                <span className="min-w-0 text-sm leading-tight text-navy-foreground">
                  <span className="block truncate font-semibold">{item.title}</span>
                  <span className="block truncate text-navy-foreground/70">{item.sub}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <img
              src={plumber}
              alt="Plumber repairing a bathroom sink in a UK home"
              width={720}
              height={1088}
              className="h-44 w-full rounded-3xl object-cover sm:h-56"
            />
            <img
              src={electrician}
              alt="Engineer installing a smart thermostat"
              width={720}
              height={1088}
              loading="lazy"
              className="h-44 w-full rounded-3xl object-cover sm:h-56"
            />
          </div>
        </div>

        <div className="animate-rise [animation-delay:120ms]">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
