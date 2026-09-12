import { Handshake, Radio } from "lucide-react";
import { offers, gbc, type Offer } from "@/data/proplens";
import { cn } from "@/lib/utils";

const stageTone: Record<Offer["stage"], string> = {
  "New offer": "bg-primary-soft text-primary",
  "Counter sent": "bg-warning-soft text-warning",
  Accepted: "bg-success-soft text-success",
  Withdrawn: "bg-destructive-soft text-destructive",
};

export function OfferTracker() {
  return (
    <section className="panel mt-8 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <Handshake className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold">Offer &amp; negotiation tracker</h2>
            <p className="text-sm text-muted-foreground">
              Live view shared with buyers and vendors
            </p>
          </div>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success">
          <Radio className="size-3.5" /> Realtime
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Property</th>
              <th className="px-5 py-3 font-medium">Buyer</th>
              <th className="px-5 py-3 font-medium">Offer</th>
              <th className="px-5 py-3 font-medium">vs asking</th>
              <th className="px-5 py-3 font-medium">Position</th>
              <th className="px-5 py-3 font-medium">Stage</th>
              <th className="px-5 py-3 text-right font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => {
              const diff = Math.round(((o.offer - o.asking) / o.asking) * 1000) / 10;
              return (
                <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/60">
                  <td className="px-5 py-4 font-medium">{o.property}</td>
                  <td className="px-5 py-4 text-muted-foreground">{o.buyer}</td>
                  <td className="px-5 py-4 font-display font-bold">{gbc(o.offer)}</td>
                  <td
                    className={cn(
                      "px-5 py-4 font-medium",
                      diff >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {diff > 0 ? "+" : ""}
                    {diff}%
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{o.chain}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        stageTone[o.stage],
                      )}
                    >
                      {o.stage}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-muted-foreground">
                    {o.updated}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
