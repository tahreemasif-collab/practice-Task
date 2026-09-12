import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/lib/bookings.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a little more").max(1000),
});

type ContactValues = z.infer<typeof schema>;

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      await submitContact({
        data: {
          name: values.name,
          email: values.email,
          message: values.message,
        },
      });
      toast.success("Message sent", { description: "Our team replies within one working hour." });
      reset();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not send message. Please try again.";
      toast.error(message);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
      <div className="grid gap-8 rounded-4xl bg-navy-gradient p-7 lg:grid-cols-2 lg:p-12">
        <div>
          <h2 className="text-3xl font-extrabold text-navy-foreground sm:text-4xl">
            Talk to the TradePro 360 team
          </h2>
          <p className="mt-3 max-w-md text-navy-foreground/75">
            Book a walkthrough of the dispatch engine, or ask us anything about migrating your
            existing bookings.
          </p>

          <ul className="mt-8 space-y-4 text-sm text-navy-foreground/85">
            <li className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/20">
                <Phone className="size-4 text-brand" />
              </span>
              0800 090 1360
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/20">
                <Mail className="size-4 text-brand" />
              </span>
              hello@tradepro360.co.uk
            </li>
            <li className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/20">
                <MapPin className="size-4 text-brand" />
              </span>
              Nationwide coverage · Head office, Birmingham
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl bg-card p-6 text-card-foreground"
        >
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Name</span>
              <Input className="h-11 rounded-xl" placeholder="Jane Cooper" {...register("name")} />
              {errors.name && (
                <span className="mt-1 block text-xs text-destructive">{errors.name.message}</span>
              )}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <Input
                className="h-11 rounded-xl"
                placeholder="jane@company.co.uk"
                {...register("email")}
              />
              {errors.email && (
                <span className="mt-1 block text-xs text-destructive">{errors.email.message}</span>
              )}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Message</span>
              <Textarea
                rows={4}
                className="rounded-xl"
                placeholder="We run a team of 6 engineers…"
                {...register("message")}
              />
              {errors.message && (
                <span className="mt-1 block text-xs text-destructive">
                  {errors.message.message}
                </span>
              )}
            </label>
          </div>
          <Button
            type="submit"
            variant="brand"
            size="lg"
            className="mt-5 w-full rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
