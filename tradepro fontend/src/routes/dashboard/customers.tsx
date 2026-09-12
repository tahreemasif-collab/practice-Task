import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Search, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/customers")({
  head: () => ({
    meta: [{ title: "Customers — TradePro 360" }],
  }),
  component: CustomersPage,
});

interface Customer {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  postcode: string | null;
  address_line1: string | null;
  city: string | null;
  created_at: string;
}

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load customer list");
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(s) ||
      c.phone.toLowerCase().includes(s) ||
      (c.email && c.email.toLowerCase().includes(s)) ||
      (c.postcode && c.postcode.toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Customer Directory
        </h1>
        <p className="text-sm text-muted-foreground">
          View client contact records, postcodes, and service histories
        </p>
      </div>

      <Card className="card-elevated p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, phone, email or postcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </Card>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Loading customers...</div>
      ) : filtered.length === 0 ? (
        <Card className="card-elevated p-12 text-center text-muted-foreground">
          <Users className="mx-auto size-10 text-muted-foreground/30 mb-3" />
          <h3 className="text-lg font-bold text-foreground">No customer records found</h3>
          <p className="text-xs mt-1">Customers will automatically be added when booking jobs.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cust) => (
            <Card key={cust.id} className="card-elevated">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="grid size-10 place-items-center rounded-full bg-brand/10 text-brand font-bold">
                  {cust.full_name[0]?.toUpperCase() || "C"}
                </div>
                <div>
                  <CardTitle className="text-base font-bold">{cust.full_name}</CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="size-3" /> Added {new Date(cust.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-xs text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-brand" />
                  <span className="font-semibold text-foreground">{cust.phone}</span>
                </div>
                {cust.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground/70" />
                    <span>{cust.email}</span>
                  </div>
                )}
                {cust.postcode && (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-muted-foreground/70" />
                    <span>{cust.address_line1 ? `${cust.address_line1}, ` : ""}{cust.city ? `${cust.city}, ` : ""}{cust.postcode}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
