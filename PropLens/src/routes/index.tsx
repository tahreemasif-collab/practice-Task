import { createFileRoute } from "@tanstack/react-router";
import { Globe, MapPin, Search } from "lucide-react";
import { Sidebar } from "@/components/proplens/Sidebar";
import { Topbar } from "@/components/proplens/Topbar";
import { StatCards } from "@/components/proplens/StatCards";
import { PropertyGrid } from "@/components/proplens/PropertyGrid";
import { InsightPanels } from "@/components/proplens/InsightPanels";
import { OfferTracker } from "@/components/proplens/OfferTracker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PropLens — CRM & Property Portal for UK Estate Agents" },
      {
        name: "description",
        content:
          "PropLens automates listing syndication to Rightmove, Zoopla and OnTheMarket, matches buyers with AI, and gives landlords a live portal for rent and maintenance.",
      },
      { property: "og:title", content: "PropLens — Estate Agent CRM & Property Portal" },
      {
        property: "og:description",
        content:
          "One workspace for UK estate and letting agents: portal syndication, AI buyer matching, 360° tours, landlord reporting and a realtime offer tracker.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-5 py-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Wednesday · Kensington branch</p>
              <h1 className="mt-1 text-3xl font-bold">Good morning, Amelia</h1>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm">
              <Globe className="size-4 text-primary" />
              <span className="text-muted-foreground">Google search feed</span>
              <span className="font-semibold">live · 42 enquiries today</span>
            </div>
          </div>

          <div className="mt-6">
            <StatCards />
          </div>

          <section className="panel mt-8 flex flex-wrap items-center gap-4 p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
              <Search className="size-5" />
            </span>
            <div className="min-w-[220px] flex-1">
              <h2 className="text-base font-bold">Live city availability</h2>
              <p className="text-sm text-muted-foreground">
                Buyers arriving from your Google Business Profile see real-time stock by city.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["London 38", "Manchester 24", "Bristol 17", "Leeds 21", "Edinburgh 12"].map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm"
                >
                  <MapPin className="size-3.5 text-primary" />
                  {c}
                </span>
              ))}
            </div>
          </section>

          <PropertyGrid />
          <OfferTracker />
          <InsightPanels />

          <footer className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            PropLens · CRM &amp; property portal for UK estate and letting agents.
          </footer>
        </main>
      </div>
    </div>
  );
}
