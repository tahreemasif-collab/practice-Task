import { Hexagon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <a href="#top" className="flex shrink-0 items-center gap-2">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand">
        <Hexagon className="size-5 text-brand-foreground" strokeWidth={2.5} />
      </span>
      <span
        className={cn(
          "truncate text-lg font-extrabold tracking-tight",
          tone === "light" ? "text-navy-foreground" : "text-foreground",
        )}
      >
        TradePro <span className="text-brand">360</span>
      </span>
    </a>
  );
}
