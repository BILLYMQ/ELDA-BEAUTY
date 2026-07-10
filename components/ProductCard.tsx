"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/CartContext";
import { useToast } from "@/lib/ToastContext";

interface ProductCardProps {
  product: Product;
  variant?: "home" | "nouveautes";
  onView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  variant = "home",
  onView,
}: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`${product.name} a été ajouté à votre panier.`, "success");
  };

  const handleOrder = () => {
    addToCart(product);
    showToast(`${product.name} ajouté. Direction le panier.`, "success");
    router.push("/panier-reservation?tab=panier");
  };

  const handleReserve = () => {
    router.push(`/panier-reservation?tab=reservation&productId=${product.id}`);
  };

  const handleContact = () => {
    router.push("/messagerie");
  };

  return (
    <div className="card-elda flex flex-col overflow-hidden">
      <div className="relative aspect-square w-full overflow-hidden bg-elda-beige">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-elda-gradient-soft font-display text-elda-purple/40">
            ELDA BEAUTY
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="badge bg-elda-gold text-elda-black shadow">Nouveau</span>
          )}
          {!product.available && (
            <span className="badge bg-elda-black/80 text-elda-cream shadow">
              Rupture de stock
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="badge w-fit bg-elda-purple/10 text-elda-purple">
          {product.category}
        </span>
        <h3 className="font-display text-lg font-semibold text-elda-black">
          {product.name}
        </h3>
        <p className="line-clamp-2 flex-1 font-body text-sm text-elda-black/60">
          {product.description}
        </p>
        <p className="font-display text-base font-semibold text-elda-gold-dark">
          {formatPrice(product.price)}
        </p>

        <div className="mt-2 flex flex-col gap-2">
          {variant === "home" ? (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.available}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ajouter au panier
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={handleReserve} className="btn-secondary w-full !px-3 !py-2 text-xs">
                  Réserver
                </button>
                <button type="button" onClick={handleContact} className="btn-secondary w-full !px-3 !py-2 text-xs">
                  Contacter
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onView?.(product)}
                className="btn-secondary w-full !py-2 text-xs"
              >
                Voir le produit
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleOrder}
                  disabled={!product.available}
                  className="btn-primary w-full !px-3 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Commander
                </button>
                <button type="button" onClick={handleReserve} className="btn-gold w-full !px-3 !py-2 text-xs">
                  Réserver
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
