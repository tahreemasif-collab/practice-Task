import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Save, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [{ title: "Settings — TradePro 360" }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("TradePro 360 Demo Ltd");
  const [phone, setPhone] = useState("0800 090 1360");
  const [email, setEmail] = useState("hello@tradepro360.co.uk");
  const [city, setCity] = useState("Birmingham");
  const [postcode, setPostcode] = useState("B1 1AA");
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Company profile & settings saved!");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Company Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Update trade business profile, contact details, and service coverage
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Building2 className="size-5 text-brand" /> Business Details
          </CardTitle>
          <CardDescription>
            These details appear on quotes, invoices, and your public booking page.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cName">Company / Trading Name</Label>
              <Input
                id="cName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cPhone">Business Phone</Label>
                <Input
                  id="cPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cEmail">Public Email</Label>
                <Input
                  id="cEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cCity">Headquarters City</Label>
                <Input
                  id="cCity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cPostcode">Postcode</Label>
                <Input
                  id="cPostcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="brand" disabled={saving} className="gap-2 font-bold rounded-xl">
                <Save className="size-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
