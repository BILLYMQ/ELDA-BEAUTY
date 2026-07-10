import Link from "next/link";
import type { HomeContent } from "@/types";

export default function CtaSection({ content }: { content: HomeContent }) {
  return (
    <section className="relative overflow-hidden bg-elda-gradient py-16">
      <div className="pointer-events-none absolute inset-0 opacity-20 shimmer-gold" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-elda-cream sm:text-3xl">
          {content.ctaTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm text-elda-cream/80">
          {content.ctaText}
        </p>
        <div className="mt-8">
          <Link href="/nouveautes" className="btn-gold">
            Explorer la collection
          </Link>
        </div>
      </div>
    </section>
  );
}
