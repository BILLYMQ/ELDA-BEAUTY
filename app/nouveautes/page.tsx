"use client";

import { useMemo, useState } from "react";
import { useProducts } from "@/lib/hooks";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import type { Product, ProductCategory } from "@/types";
import { CATEGORIES } from "@/lib/constants";

type CategoryFilter = "Tous" | ProductCategory;
type SortOrder = "none" | "asc" | "desc";

export default function NouveautesPage() {
  const { products } = useProducts();
  const [category, setCategory] = useState<CategoryFilter>("Tous");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(true);
  const [sort, setSort] = useState<SortOrder>("none");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const newProducts = useMemo(() => products.filter((p) => p.isNew), [products]);

  const filtered = useMemo(() => {
    let list = [...newProducts];
    if (category !== "Tous") list = list.filter((p) => p.category === category);
    if (availableOnly) list = list.filter((p) => p.available);
    if (newOnly) list = list.filter((p) => p.isNew);
    if (sort === "asc") {
      list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    } else if (sort === "desc") {
      list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    }
    return list;
  }, [newProducts, category, availableOnly, newOnly, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="section-title">Nouveautés</h1>
        <p className="mx-auto mt-3 max-w-xl font-body text-sm text-elda-black/60">
          Découvrez les dernières créations ELDA BEAUTY.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-elda-gold/20 bg-white p-4 shadow-elda sm:p-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(["Tous", ...CATEGORIES] as CategoryFilter[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`badge border px-4 py-2 transition-colors ${
                category === c
                  ? "border-elda-purple bg-elda-purple text-elda-cream"
                  : "border-elda-purple/20 bg-transparent text-elda-purple hover:bg-elda-purple/10"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAvailableOnly((v) => !v)}
            className={`badge border px-4 py-2 transition-colors ${
              availableOnly
                ? "border-elda-gold bg-elda-gold text-elda-black"
                : "border-elda-gold/40 bg-transparent text-elda-gold-dark hover:bg-elda-gold/10"
            }`}
          >
            Disponible
          </button>
          <button
            type="button"
            onClick={() => setNewOnly((v) => !v)}
            className={`badge border px-4 py-2 transition-colors ${
              newOnly
                ? "border-elda-gold bg-elda-gold text-elda-black"
                : "border-elda-gold/40 bg-transparent text-elda-gold-dark hover:bg-elda-gold/10"
            }`}
          >
            Nouveauté
          </button>
        </div>

        <div className="flex justify-center">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="input-elda max-w-xs"
          >
            <option value="none">Trier par prix</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {newProducts.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-elda-gold/30 bg-white px-6 py-14 text-center shadow-elda">
          <p className="font-display text-lg text-elda-purple">
            Aucune nouveauté disponible pour le moment.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mx-auto max-w-xl rounded-2xl border border-elda-gold/30 bg-white px-6 py-14 text-center shadow-elda">
          <p className="font-display text-lg text-elda-purple">
            Aucun parfum ne correspond à ces filtres.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variant="nouveautes"
              onView={setViewProduct}
            />
          ))}
        </div>
      )}

      {viewProduct && (
        <ProductModal product={viewProduct} onClose={() => setViewProduct(null)} />
      )}
    </div>
  );
}
