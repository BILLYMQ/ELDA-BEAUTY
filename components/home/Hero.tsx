"use client";

import Link from "next/link";
import type { HomeContent } from "@/types";
import PerfumeIllustration from "./PerfumeIllustration";

export default function Hero({ content }: { content: HomeContent }) {
  return (
    <section className="relative overflow-hidden bg-elda-gradient">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-elda-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-elda-purple-light/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="animate-fade-in text-center lg:text-left">
          <span className="badge mb-5 bg-elda-gold/20 text-elda-gold-light">
            Maison de parfumerie de luxe
          </span>
          <h1 className="font-display text-3xl font-bold leading-tight text-elda-cream sm:text-4xl lg:text-5xl">
            {content.heroSlogan}
          </h1>
          <p className="mx-auto mt-5 max-w-lg font-body text-base leading-relaxed text-elda-cream/80 lg:mx-0">
            {content.heroSubtext}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/nouveautes" className="btn-gold">
              Découvrir nos parfums
            </Link>
            <Link
              href="/panier-reservation"
              className="btn-secondary !border-elda-cream !text-elda-cream hover:!bg-elda-cream hover:!text-elda-purple-dark"
            >
              Commander maintenant
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="animate-float">
            <PerfumeIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
