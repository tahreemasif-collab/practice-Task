import { Star } from "lucide-react";

const reviews = [
  {
    quote:
      "We went from a paper diary to fully automated dispatch. Our engineers do two extra jobs a day.",
    name: "Daniel Whitfield",
    role: "Whitfield Plumbing, Manchester",
  },
  {
    quote:
      "Customers love the live tracking. Complaints about arrival windows have basically disappeared.",
    name: "Priya Raman",
    role: "BrightSpark Electrical, London",
  },
  {
    quote:
      "Quotes and VAT invoices generate themselves. My admin time dropped from 10 hours a week to one.",
    name: "Callum Reid",
    role: "Reid Heating Services, Glasgow",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Customer reviews
        </p>
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Trusted across the UK</h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {reviews.map((review) => (
          <figure key={review.name} className="card-elevated flex flex-col rounded-3xl p-6">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-brand text-brand" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
              “{review.quote}”
            </blockquote>
            <figcaption className="mt-5 border-t border-border pt-4">
              <span className="block text-sm font-bold">{review.name}</span>
              <span className="block text-xs text-muted-foreground">{review.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
