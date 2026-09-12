const stats = [
  { value: "12,400+", label: "Jobs dispatched monthly" },
  { value: "18 min", label: "Average response time" },
  { value: "4.9/5", label: "Customer rating" },
  { value: "320+", label: "UK trade businesses" },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="grid gap-4 rounded-3xl card-elevated p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <p className="text-3xl font-extrabold text-primary lg:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
