"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";
import { useToast } from "@/lib/ToastContext";

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-elda-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-elda-cream shadow-elda"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="aspect-square w-full bg-elda-beige">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-elda-purple/40">
                ELDA BEAUTY
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 p-6">
            <div className="flex items-center gap-2">
              <span className="badge bg-elda-purple/10 text-elda-purple">{product.category}</span>
              {product.isNew && <span className="badge bg-elda-gold text-elda-black">Nouveau</span>}
              <span
                className={`badge ${
                  product.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {product.available ? "Disponible" : "Rupture de stock"}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-elda-black">{product.name}</h2>
            <p className="font-body text-sm leading-relaxed text-elda-black/70">
              {product.description}
            </p>
            <p className="font-display text-xl font-semibold text-elda-gold-dark">
              {formatPrice(product.price)}
            </p>
            <div className="mt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={!product.available}
                onClick={() => {
                  addToCart(product);
                  showToast(`${product.name} a été ajouté à votre panier.`);
                }}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ajouter au panier
              </button>
              <button
                type="button"
                onClick={() =>
                  router.push(`/panier-reservation?tab=reservation&productId=${product.id}`)
                }
                className="btn-gold w-full"
              >
                Réserver
              </button>
              <button
                type="button"
                onClick={() => router.push("/messagerie")}
                className="btn-secondary w-full"
              >
                Contacter
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-elda-cream/90 text-elda-purple shadow"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
