import { Logo } from "./Logo";

const columns = [
  { title: "Platform", links: ["Bookings", "Dispatch", "Invoicing", "Payments"] },
  { title: "Trades", links: ["Plumbers", "Electricians", "HVAC", "Cleaners"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Status"] },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep py-14 text-navy-foreground">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-navy-foreground/65">
              Smart booking and dispatch for UK trade businesses.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-bold">{column.title}</p>
                <ul className="mt-3 space-y-2 text-sm text-navy-foreground/65">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#top" className="transition-colors hover:text-brand">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-navy-foreground/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} TradePro 360 Ltd. Registered in England &amp; Wales.</p>
          <p>Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  );
}
