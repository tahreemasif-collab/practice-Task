import { useState } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const links = [
  { label: "Services", href: "#services" },
  { label: "Platform", href: "#platform" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-navy-foreground/75 transition-colors hover:text-navy-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 text-sm font-semibold text-navy-foreground md:inline-flex">
            <ShieldCheck className="size-4 text-brand" />
            24/7 UK Dispatch
          </span>
          <Button variant="glass" size="sm" className="hidden rounded-full sm:inline-flex" asChild>
            <a href="/login">Sign in</a>
          </Button>
          <Button variant="brand" size="sm" className="hidden rounded-full sm:inline-flex" asChild>
            <a href="/signup">Get Started</a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle menu"
            className="text-navy-foreground hover:bg-white/10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="mx-5 mb-2 flex flex-col gap-1 rounded-2xl surface-glass p-3 lg:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-navy-foreground/85 hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
