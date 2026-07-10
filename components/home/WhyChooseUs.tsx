import type { WhyChooseItem } from "@/types";

export default function WhyChooseUs({ items }: { items: WhyChooseItem[] }) {
  return (
    <section className="bg-elda-beige/60 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="section-title">Pourquoi choisir ELDA BEAUTY ?</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-elda-gold/20 bg-white p-6 text-center shadow-elda transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-elda-gradient text-2xl">
                {item.icon}
              </div>
              <h3 className="font-display text-base font-semibold text-elda-purple-dark">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-sm text-elda-black/60">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
