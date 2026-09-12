import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How quickly can an engineer arrive?",
    a: "Emergency callouts are typically dispatched within 60 minutes in major UK cities. Standard bookings can be scheduled for any slot up to 8pm.",
  },
  {
    q: "Are your engineers vetted?",
    a: "Every engineer is ID checked, insured and holds the relevant certification — Gas Safe for heating work and NICEIC for electrical work.",
  },
  {
    q: "Is the quote fixed?",
    a: "Quotes include labour, materials, travel and VAT and are confirmed before work begins. Any variation is agreed with you first.",
  },
  {
    q: "Can I embed booking on my Google Business Profile?",
    a: "Yes. TradePro 360 gives you a Book a Free Quote widget that opens with the customer's location pre-filled by geolocation.",
  },
  {
    q: "Can I brand the platform as my own?",
    a: "On Enterprise you get your own logo, brand colours and custom domain, with data fully isolated from other companies.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">FAQ</p>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Questions, answered</h2>
      </div>

      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q} className="border-b border-border">
            <AccordionTrigger className="text-left text-base font-semibold">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
