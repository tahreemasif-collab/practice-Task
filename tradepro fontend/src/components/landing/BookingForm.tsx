import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDays, LoaderCircle, LocateFixed, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { submitBooking } from "@/lib/bookings.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  service: z.string().min(1, "Choose a service"),
  postcode: z.string().trim().min(4, "Enter a valid UK postcode").max(10, "Postcode is too long"),
  date: z.string().min(1, "Pick a date"),
  slot: z.string().min(1, "Pick a time slot"),
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().min(9, "Enter a contact number").max(20),
  notes: z.string().trim().max(600).optional(),
});

type BookingValues = z.infer<typeof schema>;

const services = [
  "Plumbing",
  "Electrical",
  "Heating & HVAC",
  "Cleaning",
  "Handyman",
  "Emergency Callout",
];

const slots = [
  "Morning (8am–12pm)",
  "Afternoon (12pm–4pm)",
  "Evening (4pm–8pm)",
  "ASAP — Emergency",
];

export function BookingForm() {
  const [locating, setLocating] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: "",
      postcode: "",
      date: "",
      slot: "",
      name: "",
      phone: "",
      notes: "",
    },
  });

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Location is not available on this device");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false);
        setValue("postcode", "Detected location", { shouldValidate: true });
        toast.success("Location detected — we'll confirm the exact address on the call");
      },
      () => {
        setLocating(false);
        toast.error("We couldn't detect your location. Enter a postcode instead.");
      },
      { timeout: 8000 },
    );
  };

  const onSubmit = async (values: BookingValues) => {
    try {
      let mappedSlot: "morning" | "afternoon" | "evening" | "asap" = "asap";
      if (values.slot.startsWith("Morning")) mappedSlot = "morning";
      else if (values.slot.startsWith("Afternoon")) mappedSlot = "afternoon";
      else if (values.slot.startsWith("Evening")) mappedSlot = "evening";
      else if (values.slot.startsWith("ASAP")) mappedSlot = "asap";

      await submitBooking({
        data: {
          service: values.service,
          postcode: values.postcode,
          date: values.date || undefined,
          slot: mappedSlot,
          name: values.name,
          phone: values.phone,
          notes: values.notes || undefined,
        },
      });

      toast.success(`Quote request received for ${values.service}`, {
        description: "An engineer will be dispatched and you'll get a confirmation by SMS.",
      });

      reset();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not submit booking request. Please try again.";
      toast.error(message);
    }
  };

  return (
    <form
      id="book"
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl bg-card p-5 text-card-foreground shadow-[0_40px_90px_-40px_oklch(0.2_0.1_265/0.7)] sm:p-7"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
        <Sparkles className="size-4" />
        Book a free quote
      </div>
      <h2 className="mt-2 text-2xl font-extrabold">Get a fixed price in 60 seconds</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        No commitment. Free quotes. Vetted UK engineers.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Service needed" error={errors.service?.message}>
          <Select
            value={watch("service")}
            onValueChange={(v) => setValue("service", v, { shouldValidate: true })}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Postcode" error={errors.postcode?.message}>
          <div className="flex gap-2">
            <Input
              className="h-11 rounded-xl"
              placeholder="e.g. SW1A 1AA"
              {...register("postcode")}
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Detect my location"
              className="size-11 shrink-0 rounded-xl"
              onClick={detectLocation}
            >
              {locating ? <LoaderCircle className="animate-spin" /> : <LocateFixed />}
            </Button>
          </div>
        </Field>

        <Field label="Preferred date" error={errors.date?.message}>
          <Input type="date" className="h-11 rounded-xl" {...register("date")} />
        </Field>

        <Field label="Time slot" error={errors.slot?.message}>
          <Select
            value={watch("slot")}
            onValueChange={(v) => setValue("slot", v, { shouldValidate: true })}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Select a slot" />
            </SelectTrigger>
            <SelectContent>
              {slots.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Full name" error={errors.name?.message}>
          <Input className="h-11 rounded-xl" placeholder="Jane Cooper" {...register("name")} />
        </Field>

        <Field label="Mobile number" error={errors.phone?.message}>
          <Input className="h-11 rounded-xl" placeholder="07700 900123" {...register("phone")} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Describe the problem (optional)" error={errors.notes?.message}>
            <Textarea
              rows={3}
              className="rounded-xl"
              placeholder="Leaking under the kitchen sink since this morning…"
              {...register("notes")}
            />
          </Field>
        </div>
      </div>

      <Button
        type="submit"
        variant="brand"
        size="xl"
        className="mt-6 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : <CalendarDays />}
        {isSubmitting ? "Sending request…" : "Schedule Now"}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        By booking you agree to our terms. We never share your details.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
