import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Services } from "@/components/landing/Services";
import { Platform } from "@/components/landing/Platform";
import { Reviews } from "@/components/landing/Reviews";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { ContactSection } from "@/components/landing/ContactSection";
import { SiteFooter } from "@/components/landing/SiteFooter";

const title = "TradePro 360 — Smart Booking & Dispatch for UK Trades";
const description =
  "Book vetted UK plumbers, electricians, cleaners and HVAC engineers in minutes. AI dispatch, live tracking, instant quotes and automated invoicing.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Platform />
        <Reviews />
        <Pricing />
        <Faq />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
