"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useHomeContent, useProducts } from "@/lib/hooks";
import { addOrder, addReservation } from "@/lib/dataStore";
import { useToast } from "@/lib/ToastContext";
import { formatPrice, generateId } from "@/lib/utils";
import type { Order, Reservation } from "@/types";

type Tab = "panier" | "reservation";

function CartSection() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { homeContent } = useHomeContent();
  const { showToast } = useToast();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasUnpricedItems = items.some((i) => i.price === undefined);
  const subtotal = items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);
  const shipping = homeContent.shippingFee ?? 0;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.customerName.trim()) nextErrors.customerName = "Le nom complet est requis.";
    if (!form.phone.trim()) nextErrors.phone = "Le téléphone est requis.";
    if (!form.email.trim()) nextErrors.email = "L'adresse e-mail est requise.";
    if (!form.address.trim()) nextErrors.address = "L'adresse de livraison est requise.";
    if (items.length === 0) nextErrors.items = "Votre panier est vide.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const order: Order = {
      id: generateId(),
      items,
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      message: form.message.trim() || undefined,
      subtotal: hasUnpricedItems ? undefined : subtotal,
      shipping: hasUnpricedItems ? undefined : shipping,
      total: hasUnpricedItems ? undefined : total,
      hasUnpricedItems,
      status: "En attente",
      createdAt: Date.now(),
    };

    addOrder(order);
    clearCart();
    setForm({ customerName: "", phone: "", email: "", address: "", message: "" });
    setSuccess(true);
    showToast("Votre commande a été reçue.", "success");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <h2 className="mb-4 font-display text-xl font-semibold text-elda-purple-dark">
          Votre panier
        </h2>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-elda-gold/30 bg-white px-6 py-12 text-center shadow-elda">
            <p className="font-body text-sm text-elda-black/60">Votre panier est vide.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-xl border border-elda-gold/20 bg-white p-3 shadow-elda"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-elda-beige">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-elda-black">
                    {item.name}
                  </p>
                  <p className="font-body text-xs text-elda-black/50">{item.category}</p>
                  <p className="font-body text-sm font-semibold text-elda-gold-dark">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-elda-purple/30 text-elda-purple"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-body text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-elda-purple/30 text-elda-purple"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.productId)}
                  className="ml-2 text-sm text-red-500 hover:text-red-700"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="rounded-xl border border-elda-gold/20 bg-white p-4 shadow-elda">
              {hasUnpricedItems && (
                <p className="mb-2 font-body text-sm text-elda-purple">
                  Prix à confirmer avec ELDA BEAUTY.
                </p>
              )}
              {!hasUnpricedItems && (
                <>
                  <div className="flex justify-between font-body text-sm text-elda-black/70">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="flex justify-between font-body text-sm text-elda-black/70">
                      <span>Livraison</span>
                      <span>{formatPrice(shipping)}</span>
                    </div>
                  )}
                  <div className="mt-2 flex justify-between border-t border-elda-gold/20 pt-2 font-display text-base font-semibold text-elda-purple-dark">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-semibold text-elda-purple-dark">
          Confirmer la commande
        </h2>
        {success && (
          <div className="mb-4 rounded-xl border border-green-300 bg-green-50 p-4 font-body text-sm text-green-700">
            Votre commande a été reçue. ELDA BEAUTY vous contactera pour finaliser le paiement
            et la livraison.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
          <div>
            <input
              placeholder="Nom complet"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="input-elda"
            />
            {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
          </div>
          <div>
            <input
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-elda"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-elda"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <input
              placeholder="Adresse de livraison"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-elda"
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
          </div>
          <textarea
            placeholder="Message optionnel"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input-elda min-h-[80px]"
          />
          {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}
          <button type="submit" className="btn-primary w-full">
            Confirmer la commande
          </button>
        </form>
      </div>
    </div>
  );
}

function ReservationSection({ initialProductId }: { initialProductId: string | null }) {
  const { products } = useProducts();
  const { showToast } = useToast();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    productId: initialProductId || "",
    quantity: 1,
    desiredDate: "",
    message: "",
  });

  useEffect(() => {
    if (initialProductId) {
      setForm((f) => ({ ...f, productId: initialProductId }));
    }
  }, [initialProductId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.customerName.trim()) nextErrors.customerName = "Le nom complet est requis.";
    if (!form.phone.trim()) nextErrors.phone = "Le téléphone est requis.";
    if (!form.email.trim()) nextErrors.email = "L'adresse e-mail est requise.";
    if (!form.productId) nextErrors.productId = "Veuillez choisir un produit.";
    if (!form.desiredDate) nextErrors.desiredDate = "La date souhaitée est requise.";
    if (form.quantity < 1) nextErrors.quantity = "Quantité invalide.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const product = products.find((p) => p.id === form.productId);
    const reservation: Reservation = {
      id: generateId(),
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      productId: form.productId,
      productName: product?.name || "Produit",
      quantity: form.quantity,
      desiredDate: form.desiredDate,
      message: form.message.trim() || undefined,
      status: "En attente",
      createdAt: Date.now(),
    };

    addReservation(reservation);
    setForm({
      customerName: "",
      phone: "",
      email: "",
      productId: "",
      quantity: 1,
      desiredDate: "",
      message: "",
    });
    setSuccess(true);
    showToast("Votre réservation a été envoyée avec succès.", "success");
  };

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="mb-4 text-center font-display text-xl font-semibold text-elda-purple-dark">
        Réserver un parfum
      </h2>
      {success && (
        <div className="mb-4 rounded-xl border border-green-300 bg-green-50 p-4 text-center font-body text-sm text-green-700">
          Votre réservation a été envoyée avec succès.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
        <div>
          <input
            placeholder="Nom complet"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="input-elda"
          />
          {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
        </div>
        <div>
          <input
            placeholder="Téléphone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-elda"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-elda"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            className="input-elda"
          >
            <option value="">Produit souhaité</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>
          {products.length === 0 && (
            <p className="mt-1 font-body text-xs text-elda-black/50">
              Aucun produit disponible pour le moment.
            </p>
          )}
          {errors.productId && <p className="mt-1 text-xs text-red-500">{errors.productId}</p>}
        </div>
        <div>
          <input
            type="number"
            min={1}
            placeholder="Quantité"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            className="input-elda"
          />
          {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
        </div>
        <div>
          <input
            type="date"
            value={form.desiredDate}
            onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
            className="input-elda"
          />
          {errors.desiredDate && <p className="mt-1 text-xs text-red-500">{errors.desiredDate}</p>}
        </div>
        <textarea
          placeholder="Message optionnel"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input-elda min-h-[80px]"
        />
        <button type="submit" className="btn-primary w-full">
          Envoyer la réservation
        </button>
      </form>
    </div>
  );
}

function PanierReservationContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "panier";
  const initialProductId = searchParams.get("productId");
  const [tab, setTab] = useState<Tab>(initialTab === "reservation" ? "reservation" : "panier");

  const tabs = useMemo(
    () => [
      { id: "panier" as Tab, label: "Panier" },
      { id: "reservation" as Tab, label: "Réservation" },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="section-title">Panier & Réservation</h1>
      </div>

      <div className="mx-auto mb-10 flex w-fit gap-2 rounded-full border border-elda-gold/30 bg-white p-1 shadow-elda">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-6 py-2 font-body text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-elda-purple text-elda-cream" : "text-elda-purple-dark"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "panier" ? (
        <CartSection />
      ) : (
        <ReservationSection initialProductId={initialProductId} />
      )}
    </div>
  );
}

export default function PanierReservationPage() {
  return (
    <Suspense fallback={null}>
      <PanierReservationContent />
    </Suspense>
  );
}
