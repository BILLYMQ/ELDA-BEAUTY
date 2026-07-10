import type { Testimonial } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="text-elda-gold" aria-label={`${rating} sur 5`}>
      {"★".repeat(Math.max(0, Math.min(5, rating)))}
      {"☆".repeat(5 - Math.max(0, Math.min(5, rating)))}
    </div>
  );
}

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="section-title">Ce que disent nos clients</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-3 rounded-2xl border border-elda-gold/20 bg-white p-6 shadow-elda"
          >
            <Stars rating={t.rating} />
            <p className="font-body text-sm italic leading-relaxed text-elda-black/70">
              &ldquo;{t.text}&rdquo;
            </p>
            <p className="mt-auto font-display text-sm font-semibold text-elda-purple">
              — {t.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
