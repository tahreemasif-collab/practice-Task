import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, CheckCircle, Clock, DollarSign, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/invoices")({
  head: () => ({
    meta: [{ title: "Invoices — TradePro 360" }],
  }),
  component: InvoicesPage,
});

interface Invoice {
  id: string;
  reference: string;
  status: string;
  subtotal_pence: number;
  vat_pence: number;
  total_pence: number;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  customers?: { full_name: string } | null;
}

function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoices() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("invoices")
          .select("*, customers(full_name)")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setInvoices(data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    }
    loadInvoices();
  }, []);

  const formatPounds = (pence: number) => {
    return `£${(pence / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Invoices & Automated Billing
          </h1>
          <p className="text-sm text-muted-foreground">
            20% UK VAT calculated automatically upon job completion
          </p>
        </div>

        <Button variant="brand" size="default" onClick={() => toast.info("Invoices are generated upon job completion or via job status change")} className="gap-2 rounded-xl font-bold shadow-md">
          <Plus className="size-4" /> Create Manual Invoice
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Loading invoices...</div>
      ) : invoices.length === 0 ? (
        <Card className="card-elevated p-12 text-center text-muted-foreground">
          <FileText className="mx-auto size-10 text-muted-foreground/30 mb-3" />
          <h3 className="text-lg font-bold text-foreground">No invoices generated yet</h3>
          <p className="text-xs mt-1">Invoices are automatically created when jobs are completed.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {invoices.map((inv) => (
            <Card key={inv.id} className="card-elevated p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
                      {inv.reference}
                    </span>
                    <Badge variant={inv.status === "paid" ? "default" : "secondary"} className="capitalize text-xs">
                      {inv.status}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">
                    {inv.customers?.full_name || "Direct Customer"}
                  </h4>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-foreground">{formatPounds(inv.total_pence)}</div>
                    <div className="text-[11px] text-muted-foreground">
                      Subtotal: {formatPounds(inv.subtotal_pence)} + VAT: {formatPounds(inv.vat_pence)}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => toast.success(`Downloading PDF for ${inv.reference}`)}>
                    <Download className="size-4 mr-1" /> PDF
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
