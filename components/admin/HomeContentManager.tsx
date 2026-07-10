"use client";

import { useEffect, useState } from "react";
import { useHomeContent, useProducts } from "@/lib/hooks";
import { useToast } from "@/lib/ToastContext";
import { generateId } from "@/lib/utils";
import type { HomeContent, Testimonial, WhyChooseItem } from "@/types";

export default function HomeContentManager() {
  const { homeContent, setHomeContent } = useHomeContent();
  const { products } = useProducts();
  const { showToast } = useToast();
  const [form, setForm] = useState<HomeContent>(homeContent);

  useEffect(() => {
    setForm(homeContent);
  }, [homeContent]);

  const updateWhyChooseUs = (id: string, patch: Partial<WhyChooseItem>) => {
    setForm((f) => ({
      ...f,
      whyChooseUs: f.whyChooseUs.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const addWhyChooseUs = () => {
    setForm((f) => ({
      ...f,
      whyChooseUs: [
        ...f.whyChooseUs,
        { id: generateId(), icon: "✨", title: "", description: "" },
      ],
    }));
  };

  const removeWhyChooseUs = (id: string) => {
    setForm((f) => ({ ...f, whyChooseUs: f.whyChooseUs.filter((i) => i.id !== id) }));
  };

  const updateTestimonial = (id: string, patch: Partial<Testimonial>) => {
    setForm((f) => ({
      ...f,
      testimonials: f.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const addTestimonial = () => {
    setForm((f) => ({
      ...f,
      testimonials: [...f.testimonials, { id: generateId(), name: "", text: "", rating: 5 }],
    }));
  };

  const removeTestimonial = (id: string) => {
    setForm((f) => ({ ...f, testimonials: f.testimonials.filter((t) => t.id !== id) }));
  };

  const toggleFeatured = (productId: string) => {
    setForm((f) => ({
      ...f,
      featuredProductIds: f.featuredProductIds.includes(productId)
        ? f.featuredProductIds.filter((id) => id !== productId)
        : [...f.featuredProductIds, productId],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHomeContent(form);
    showToast("Contenu de la page d'accueil mis à jour.", "success");
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <h2 className="font-display text-lg font-semibold text-elda-purple-dark">
        Contenu de la page d&apos;accueil
      </h2>

      <section className="space-y-3 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
        <h3 className="font-display text-sm font-semibold text-elda-purple">Section Hero</h3>
        <label className="block font-body text-xs text-elda-black/60">Slogan</label>
        <input
          value={form.heroSlogan}
          onChange={(e) => setForm({ ...form, heroSlogan: e.target.value })}
          className="input-elda"
        />
        <label className="block font-body text-xs text-elda-black/60">Texte principal</label>
        <textarea
          value={form.heroSubtext}
          onChange={(e) => setForm({ ...form, heroSubtext: e.target.value })}
          className="input-elda min-h-[70px]"
        />
      </section>

      <section className="space-y-3 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
        <h3 className="font-display text-sm font-semibold text-elda-purple">
          Section appel à l&apos;action
        </h3>
        <label className="block font-body text-xs text-elda-black/60">Titre</label>
        <input
          value={form.ctaTitle}
          onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
          className="input-elda"
        />
        <label className="block font-body text-xs text-elda-black/60">Texte</label>
        <textarea
          value={form.ctaText}
          onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
          className="input-elda min-h-[70px]"
        />
      </section>

      <section className="space-y-3 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
        <h3 className="font-display text-sm font-semibold text-elda-purple">Livraison</h3>
        <label className="block font-body text-xs text-elda-black/60">
          Frais de livraison (laisser vide si non défini)
        </label>
        <input
          type="number"
          value={form.shippingFee ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              shippingFee: e.target.value.trim() === "" ? undefined : Number(e.target.value),
            })
          }
          className="input-elda max-w-xs"
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-elda-purple">
            Pourquoi choisir ELDA BEAUTY ?
          </h3>
          <button type="button" onClick={addWhyChooseUs} className="btn-secondary !px-3 !py-1.5 text-xs">
            + Ajouter
          </button>
        </div>
        {form.whyChooseUs.map((item) => (
          <div key={item.id} className="grid gap-2 rounded-xl border border-elda-gold/10 p-3 sm:grid-cols-[60px_1fr_1fr_auto]">
            <input
              value={item.icon}
              onChange={(e) => updateWhyChooseUs(item.id, { icon: e.target.value })}
              className="input-elda text-center"
              placeholder="🔸"
            />
            <input
              value={item.title}
              onChange={(e) => updateWhyChooseUs(item.id, { title: e.target.value })}
              className="input-elda"
              placeholder="Titre"
            />
            <input
              value={item.description}
              onChange={(e) => updateWhyChooseUs(item.id, { description: e.target.value })}
              className="input-elda"
              placeholder="Description"
            />
            <button
              type="button"
              onClick={() => removeWhyChooseUs(item.id)}
              className="rounded-full border-2 border-red-400 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-400 hover:text-white"
            >
              Retirer
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-semibold text-elda-purple">Témoignages clients</h3>
          <button type="button" onClick={addTestimonial} className="btn-secondary !px-3 !py-1.5 text-xs">
            + Ajouter
          </button>
        </div>
        {form.testimonials.map((t) => (
          <div key={t.id} className="grid gap-2 rounded-xl border border-elda-gold/10 p-3 sm:grid-cols-[1fr_2fr_80px_auto]">
            <input
              value={t.name}
              onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
              className="input-elda"
              placeholder="Nom du client"
            />
            <input
              value={t.text}
              onChange={(e) => updateTestimonial(t.id, { text: e.target.value })}
              className="input-elda"
              placeholder="Témoignage"
            />
            <input
              type="number"
              min={1}
              max={5}
              value={t.rating}
              onChange={(e) => updateTestimonial(t.id, { rating: Number(e.target.value) })}
              className="input-elda"
            />
            <button
              type="button"
              onClick={() => removeTestimonial(t.id)}
              className="rounded-full border-2 border-red-400 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-400 hover:text-white"
            >
              Retirer
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border border-elda-gold/20 bg-white p-5 shadow-elda">
        <h3 className="font-display text-sm font-semibold text-elda-purple">
          Produits mis en avant
        </h3>
        {products.length === 0 ? (
          <p className="font-body text-sm text-elda-black/50">Aucun produit à mettre en avant.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {products.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-2 rounded-lg border border-elda-gold/10 px-3 py-2 font-body text-sm text-elda-black/70"
              >
                <input
                  type="checkbox"
                  checked={form.featuredProductIds.includes(p.id)}
                  onChange={() => toggleFeatured(p.id)}
                />
                {p.name}
              </label>
            ))}
          </div>
        )}
      </section>

      <button type="submit" className="btn-primary">
        Enregistrer les modifications
      </button>
    </form>
  );
}
