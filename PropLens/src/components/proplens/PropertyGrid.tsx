import { useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  Eye,
  LayoutGrid,
  List,
  MapPin,
  MoreHorizontal,
  Ruler,
  UploadCloud,
  Video,
} from "lucide-react";
import { properties, gbc, type ListingStatus, type Property } from "@/data/proplens";
import { cn } from "@/lib/utils";

const filters: Array<"All" | ListingStatus> = [
  "All",
  "Available",
  "Under offer",
  "Sold STC",
  "Let agreed",
];

const statusTone: Record<ListingStatus, string> = {
  Available: "bg-success-soft text-success",
  "Under offer": "bg-warning-soft text-warning",
  "Sold STC": "bg-primary-soft text-primary",
  "Let agreed": "bg-accent-soft text-accent",
};

export function PropertyGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const shown = useMemo(
    () => (filter === "All" ? properties : properties.filter((p) => p.status === filter)),
    [filter],
  );

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Portfolio</h2>
          <p className="text-sm text-muted-foreground">
            {shown.length} properties · syndicated to Rightmove, Zoopla &amp; OnTheMarket
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-border bg-card p-1">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                className={cn(
                  "grid size-8 place-items-center rounded-lg transition-colors",
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
              </button>
            ))}
          </div>
          <button className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-sm font-semibold transition-colors hover:bg-muted">
            <UploadCloud className="size-4 text-primary" /> Syndicate all
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              filter === f
                ? "border-transparent bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "mt-5 grid gap-5",
          view === "grid" ? "sm:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1",
        )}
      >
        {shown.map((p) => (
          <PropertyCard key={p.id} property={p} horizontal={view === "list"} />
        ))}
      </div>
    </section>
  );
}

function PropertyCard({ property: p, horizontal }: { property: Property; horizontal: boolean }) {
  return (
    <article
      className={cn(
        "panel group overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]",
        horizontal && "sm:flex",
      )}
    >
      <div className={cn("relative overflow-hidden", horizontal && "sm:w-72 sm:shrink-0")}>
        <img
          src={p.image}
          alt={`${p.title}, ${p.city}`}
          width={800}
          height={600}
          loading="lazy"
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-full"
        />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-card/95 px-2.5 py-1 text-xs font-medium backdrop-blur">
          <MapPin className="size-3.5 text-primary" />
          {p.city}
        </span>
        {p.tour ? (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-medium text-background backdrop-blur">
            <Video className="size-3.5" /> 360°
          </span>
        ) : null}
      </div>

      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold">{p.title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{p.address}</p>
          </div>
          <button aria-label="More actions" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="size-5" />
          </button>
        </div>

        <p className="mt-3 font-display text-2xl font-bold">
          {gbc(p.price)}
          {p.priceSuffix ? (
            <span className="ml-1 text-sm font-medium text-muted-foreground">{p.priceSuffix}</span>
          ) : null}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4" /> {p.beds} beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-4" /> {p.baths} baths
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="size-4" /> {p.sqft.toLocaleString("en-GB")} sq ft
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.portals.map((portal) => (
            <span
              key={portal}
              className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {portal}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              statusTone[p.status],
            )}
          >
            {p.status}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{p.agent}</span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" /> {p.views.toLocaleString("en-GB")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
