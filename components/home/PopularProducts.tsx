"use client";

import type { Product } from "@/types";
import ProductCard from "../ProductCard";

export default function PopularProducts({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="section-title">Nos parfums populaires</h2>
        <p className="mx-auto mt-3 max-w-xl font-body text-sm text-elda-black/60">
          Une sélection raffinée de nos fragrances les plus appréciées.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-elda-gold/30 bg-white px-6 py-14 text-center shadow-elda">
          <p className="font-display text-lg text-elda-purple">
            Aucun parfum n&apos;est disponible pour le moment. Revenez bientôt découvrir
            la collection ELDA BEAUTY.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} variant="home" />
          ))}
        </div>
      )}
    </section>
  );
}
